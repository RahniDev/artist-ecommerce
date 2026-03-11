import { MongoClient } from 'mongodb';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);
}

// Extract database name from URI if not explicitly provided
const extractDbNameFromUri = (uri) => {
    try {
        // Match the database name between the last / and ? or end of string
        const matches = uri.match(/\/([^/?]+)(\?|$)/);
        return matches ? matches[1] : 'test';
    } catch {
        return 'test';
    }
};

// Use provided DB_NAME or extract from URI
const DB_NAME = process.env.DB_NAME || extractDbNameFromUri(MONGODB_URI);
console.log(`Using database: ${DB_NAME}`);

const COLLECTION_NAME = 'products';

const LANGBLY_API_KEY = process.env.LANGBLY_API_KEY;
if (!LANGBLY_API_KEY) {
    console.error('LANGBLY_API_KEY is not defined in .env file');
    process.exit(1);
}

const LANGBLY_API_URL = 'https://api.langbly.com/language/translate/v2';
const TARGET_LANGUAGES = ['de', 'es', 'fr', 'it'];
const BATCH_SIZE = 25;
const MONTHLY_FREE_LIMIT = 500_000;

let charsUsedThisRun = 0;

async function translateText(text, targetLang) {
    try {
        const charCount = text.length;
        
        if (charsUsedThisRun + charCount > MONTHLY_FREE_LIMIT) {
            console.log(`Would exceed monthly limit (${charsUsedThisRun}/${MONTHLY_FREE_LIMIT} chars)`);
            return null;
        }
        
        const response = await axios.post(
            LANGBLY_API_URL,
            null,
            {
                params: {
                    q: text,
                    target: targetLang,
                    source: 'en',
                    key: LANGBLY_API_KEY,
                    format: 'text'
                },
                headers: {
                    'User-Agent': 'MongoDB-Translation-Script/1.0'
                }
            }
        );
        
        charsUsedThisRun += charCount;
        
        if (response.data?.data?.translations?.[0]?.translatedText) {
            return response.data.data.translations[0].translatedText;
        } else if (response.data?.translations?.[0]?.translatedText) {
            return response.data.translations[0].translatedText;
        }
        
        return null;
    } catch (error) {
        console.error(`Translation failed for ${targetLang}:`, error);
        return null;
    }
}

async function processBatch(products, collection) {
    for (const product of products) {
        console.log(`\nProcessing: ${product.name || product._id}`);
        
        let sourceText = '';
        let updates = {};
        let needsUpdate = false;
        
        // Case 1: Description is a string (old format)
        if (typeof product.description === 'string') {
            sourceText = product.description;
            console.log(`Converting string description to object format`);
            
            // Convert to new object format
            updates.description = {
                en: sourceText,
                de: '',
                es: '',
                fr: '',
                it: ''
            };
            needsUpdate = true;
        } 
        // Case 2: Description is an object
        else if (product.description && typeof product.description === 'object') {
            // Check if English exists
            if (!product.description.en) {
                console.log(`No English description found, skipping`);
                continue;
            }
            
            sourceText = product.description.en;
            
            // Check which translations are missing
            const missingTranslations = TARGET_LANGUAGES.filter(lang => 
                !product.description[lang]
            );
            
            if (missingTranslations.length === 0) {
                console.log(`All translations already exist`);
                continue;
            }
            
            console.log(`Missing translations: ${missingTranslations.join(', ')}`);
            updates.description = { ...product.description };
            needsUpdate = true;
        } else {
            console.log(`No valid description found`);
            continue;
        }
        
        // Translate missing languages
        if (needsUpdate && sourceText) {
            for (const lang of TARGET_LANGUAGES) {
                // Skip if already have translation
                if (updates.description[lang]) continue;
                
                if (charsUsedThisRun + sourceText.length > MONTHLY_FREE_LIMIT) {
                    console.log(`Would exceed limit, stopping batch`);
                    return;
                }
                
                console.log(`Translating to ${lang}...`);
                const translated = await translateText(sourceText, lang);
                
                if (translated) {
                    updates.description[lang] = translated;
                    console.log(`${lang} complete`);
                }
            }
        }
        
        // Update the product in MongoDB
        if (needsUpdate && Object.keys(updates).length > 0) {
            await collection.updateOne(
                { _id: product._id },
                { $set: updates }
            );
            console.log(`Product updated successfully`);
        }
    }
}

async function translateProducts() {
    console.log(`Database name: ${DB_NAME}`);
    console.log(`Collection: ${COLLECTION_NAME}`);

    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Debug: Check database stats
        const totalProducts = await collection.countDocuments();
        const stringCount = await collection.countDocuments({ description: { $type: "string" } });
        const objectCount = await collection.countDocuments({ description: { $type: "object" } });
        
        console.log(`\nDatabase stats for ${DB_NAME}.${COLLECTION_NAME}:`);
        console.log(`- Total products: ${totalProducts}`);
        console.log(`- String descriptions: ${stringCount}`);
        console.log(`- Object descriptions: ${objectCount}`);
        
      const query = {
  $or: [
    // Case 1: still a string
    { description: { $type: "string" } },

    // Case 2: object but missing OR empty translations
    {
      "description.en": { $exists: true },
      $or: TARGET_LANGUAGES.flatMap(lang => ([
        { [`description.${lang}`]: { $exists: false } },
        { [`description.${lang}`]: "" },   // catches empty strings
        { [`description.${lang}`]: null }, // catches nulls
      ]))
    }
  ]
};
        
        const productsNeedingTranslation = await collection.countDocuments(query);
        console.log(`\nFound ${productsNeedingTranslation} products needing translations`);
        
        if (productsNeedingTranslation === 0) {
            console.log('No products need translation!');
            return;
        }
        
        // Process in batches
        const cursor = collection.find(query);
        let batch = [];
        let processedCount = 0;
        
        for await (const doc of cursor) {
            batch.push(doc);
            
            if (batch.length >= BATCH_SIZE) {
                await processBatch(batch, collection);
                processedCount += batch.length;
                console.log(`Progress: ${processedCount} products processed, ${charsUsedThisRun.toLocaleString()} chars used`);
                
                if (charsUsedThisRun > MONTHLY_FREE_LIMIT * 0.9) {
                    console.log('Approaching monthly limit, stopping...');
                    break;
                }
                
                batch = [];
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // Process remaining
        if (batch.length > 0 && charsUsedThisRun < MONTHLY_FREE_LIMIT * 0.9) {
            await processBatch(batch, collection);
            processedCount += batch.length;
        }
        
        console.log(`\nTranslation run completed!`);
        console.log(`Products processed: ${processedCount}`);
        console.log(`Characters used: ${charsUsedThisRun.toLocaleString()}/${MONTHLY_FREE_LIMIT.toLocaleString()}`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    translateProducts().catch(console.error);
}

export { translateProducts };