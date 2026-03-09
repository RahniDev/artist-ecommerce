import { MongoClient } from 'mongodb';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.DATABASE;
const DB_NAME = process.env.DB_NAME || 'your_db_name';
const COLLECTION_NAME = 'products';

// Langbly config
const LANGBLY_API_KEY = process.env.LANGBLY_API_KEY;
const LANGBLY_API_URL = 'https://api.langbly.com/translate/v2';

const TARGET_LANGUAGES = ['de', 'es', 'fr', 'it'];
const BATCH_SIZE = 25; // Process fewer at a time to manage character count
const MONTHLY_FREE_LIMIT = 500_000; // characters per month

// Track character usage
let charsUsedThisRun = 0;


async function translateText(text, targetLang) {
    try {
        const charCount = text.length;

        // Check if we'd exceed limit
        if (charsUsedThisRun + charCount > MONTHLY_FREE_LIMIT) {
            console.log(`Would exceed monthly limit (${charsUsedThisRun}/${MONTHLY_FREE_LIMIT} chars)`);
            return null;
        }

        const response = await axios.post(
            LANGBLY_API_URL,
            null, // Langbly uses query params
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
        return response.data.data.translations[0].translatedText;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
    } finally {
        await client.close();
    }
}

async function translateProducts() {
    console.log('Starting Langbly translation...');
    console.log(`Monthly free tier: ${MONTHLY_FREE_LIMIT.toLocaleString()} chars`);

    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Find products missing any of the target language translations
        const missingQuery = {
            $or: TARGET_LANGUAGES.map(lang => ({
                [`description.${lang}`]: { $exists: false }
            }))
        };

        const productsNeedingTranslation = await collection.countDocuments(missingQuery);
        console.log(`Found ${productsNeedingTranslation} products needing translations`);

        // Estimate if we can do all with remaining free tier
        const avgDescLength = 200; // words
        const avgChars = avgDescLength * 5; // ~5 chars per word
        const estimatedCharsNeeded = productsNeedingTranslation * avgChars * TARGET_LANGUAGES.length;

        console.log(`\nTranslation Estimate:`);
        console.log(`Average chars per description: ~${avgChars}`);
        console.log(`Total chars needed: ~${estimatedCharsNeeded.toLocaleString()}`);
        console.log(`Monthly free limit: ${MONTHLY_FREE_LIMIT.toLocaleString()}`);

        if (estimatedCharsNeeded > MONTHLY_FREE_LIMIT) {
            const productsThisMonth = Math.floor(
                MONTHLY_FREE_LIMIT / (avgChars * TARGET_LANGUAGES.length)
            );
            console.log(`\nWill process ~${productsThisMonth} products this month`);
            console.log(`Remaining ${productsNeedingTranslation - productsThisMonth} products will be processed next month`);
        }

        // Process products in batches
        const cursor = collection.find(missingQuery).limit(100); // Start with 100 max
        let processedCount = 0;
        let totalUpdates = 0;
        let batch = [];

        for await (const product of cursor) {
            batch.push(product);

            if (batch.length >= BATCH_SIZE) {
                await processBatch(batch, collection);
                processedCount += batch.length;
                totalUpdates += batch.length;
                console.log(`Progress: ${processedCount} products processed, ${charsUsedThisRun.toLocaleString()} chars used`);

                // Stop if near the limit
                if (charsUsedThisRun > MONTHLY_FREE_LIMIT * 0.9) {
                    console.log('Approaching monthly limit, stopping...');
                    break;
                }

                batch = [];
                await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
            }
        }

        // Process remaining
        if (batch.length > 0 && charsUsedThisRun < MONTHLY_FREE_LIMIT * 0.9) {
            await processBatch(batch, collection);
            totalUpdates += batch.length;
        }

        console.log(`\nTranslation run completed!`);
        console.log(`Products updated: ${totalUpdates}`);
        console.log(`Characters used: ${charsUsedThisRun.toLocaleString()}/${MONTHLY_FREE_LIMIT.toLocaleString()}`);
        console.log(`Remaining this month: ${(MONTHLY_FREE_LIMIT - charsUsedThisRun).toLocaleString()} chars`);

        if (charsUsedThisRun >= MONTHLY_FREE_LIMIT * 0.9) {
            console.log(`\n You've used 90% of your monthly free tier. Schedule next run for next month.`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

async function processBatch(products, collection) {
    for (const product of products) {
        console.log(`\nProcessing: ${product.name || product._id}`);

        const sourceText = product.description?.en || product.description;
        if (!sourceText || typeof sourceText !== 'string') {
            console.log(`  No source text for ${product._id}`);
            continue;
        }

        const updates = {};

        for (const lang of TARGET_LANGUAGES) {
            // Skip if already translated
            if (product.description?.[lang]) {
                console.log(`  ${lang} already exists, skipping`);
                continue;
            }

            // Check if it would exceed limit
            if (charsUsedThisRun + sourceText.length > MONTHLY_FREE_LIMIT) {
                console.log(`Would exceed limit, stopping batch`);
                return;
            }

            console.log(`  Translating to ${lang}...`);
            const translated = await translateText(sourceText, lang);

            if (translated) {
                updates[`description.${lang}`] = translated;
                console.log(`${lang} complete`);
            }
        }

        if (Object.keys(updates).length > 0) {
            await collection.updateOne(
                { _id: product._id },
                { $set: updates }
            );
            console.log(`Product updated with ${Object.keys(updates).length} translations`);
        }
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    translateProducts().catch(console.error);
}

export { translateProducts };