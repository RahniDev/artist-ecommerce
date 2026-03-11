import formidable, { Fields, Files } from 'formidable'
import * as fs from 'fs'
import { Product } from './product.model.js'
import { errorHandler, MongoError } from '../../helpers/errorHandler.js'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            product?: import('./product.model.js').IProductDocument
        }
    }
}

export const productById = async (
    req: Request,
    res: Response,
    next: NextFunction,
    id: string
) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        const product = await Product.findById(id)
            .populate("category")
            .select("-photo")

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        req.product = product as any;
        return next();
    } catch (err) {
        console.error("productById error:", err);
        return res.status(500).json({ error: "Failed to load product" });
    }
};

export const read = (req: Request, res: Response): Response => {
    if (!req.product) {
        return res.status(404).json({ error: "Product not loaded" })
    }
    
    const { lang = 'en' } = req.query;
    
    const product = req.product.toObject();
    
    // Safe access with type checking
    let description = '';
    if (product.description && typeof product.description === 'object') {
        const desc = product.description as any;
        description = desc[lang as string] || desc.en || '';
    } else {
        description = product.description as string || '';
    }
    
    const response = {
        ...product,
        description
    };
    
    return res.json(response);
}

export const list = async (req: Request, res: Response) => {
    try {
        const { lang = 'en' } = req.query;
        
        const products = await Product.find()
            .select("-photo")
            .sort({ createdAt: -1 })
            .limit(6)
            .lean();

        // Transform each product with safe type checking
        const transformedProducts = products.map(product => {
            let description = '';
            if (product.description && typeof product.description === 'object') {
                const desc = product.description as any;
                description = desc[lang as string] || desc.en || '';
            } else {
                description = product.description as string || '';
            }
            
            return {
                ...product,
                description
            };
        });

        return res.status(200).json({ data: transformedProducts });
    } catch (err) {
        return res.status(400).json({ error: "Products not found" });
    }
};
export const createprod = async (req: Request, res: Response) => {
    try {
        const testProduct = new Product({
            name: "Test Product",
            description: {
                en: "Test Description"
            },
            price: 99.99,
            category: new mongoose.Types.ObjectId(), // You'll need a real category ID
            quantity: 10,
            shipping: true,
            weight: 100
        });
        
        const result = await testProduct.save();
        console.log("Test product saved:", result._id);
        res.json({ success: true, id: result._id });
    } catch (error) {
        console.error("Test product error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ error: errorMessage });
    }
};

// returns products in same category 
export const listRelated = async (req: Request, res: Response) => {
    let limit = req.query.limit ? Number(req.query.limit) : 6
    try {
        const products = await Product.find(
            {
                _id: { $ne: req.product?._id },
                category: req.product?.category
            })
            .limit(limit)
            .populate('category', '_id name')
            .lean()
        return res.json({ data: products });
    } catch (err) { return res.status(400).json({ error: 'Products not found' }) }
}

export const listCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Product.distinct("category")
        return res.json(categories)
    } catch (err) { return res.status(400).json({ error: 'Categories not found' }) }
}

export const photo = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.productId)
            .select("photo");

        if (!product || !product.photo?.data) {
            return res.status(404).send("No image");
        }

        res.set("Content-Type", product.photo.contentType);
        return res.send(product.photo.data);
    } catch (err) {
        return res.status(500).send("Image error");
    }
};

export const create = async (req: Request, res: Response) => {
    const form = formidable();

    try {
        const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        console.log("Fields received:", fields); // LOG 1: See what fields are coming in
        console.log("Files received:", files);   // LOG 2: See if file is coming in

        let { name, description, price, category, subcategory, quantity, shipping, weight, width, height, length } = fields;

        const normalize = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] : v;

        const nameValue = normalize(name);
        const descriptionValue = normalize(description);
        const priceValue = Number(normalize(price));
        const quantityValue = Number(normalize(quantity));
        const categoryValue = normalize(category);
        const shippingValue =
            normalize(shipping) === "1" ||
            normalize(shipping) === "true";
        const weightValue = Number(normalize(weight));
        const widthValue = normalize(width) ? Number(normalize(width)) : undefined;
        const heightValue = normalize(height) ? Number(normalize(height)) : undefined;
        const lengthValue = normalize(length) ? Number(normalize(length)) : undefined;

        console.log("Parsed values:", { // LOG 3: See parsed values
            nameValue,
            descriptionValue,
            priceValue,
            categoryValue,
            quantityValue,
            shippingValue,
            weightValue
        });

        if (
            nameValue == null ||
            descriptionValue == null ||
            isNaN(priceValue) ||
            categoryValue == null ||
            isNaN(quantityValue) ||
            shippingValue == null
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const product = new Product({
            name: nameValue,
            description: {
                en: descriptionValue,
                de: "",
                es: "",
                fr: "",
                it: ""
            },
            price: priceValue,
            category: categoryValue,
            subcategory: normalize(subcategory) || null,
            quantity: quantityValue,
            shipping: shippingValue,
            weight: weightValue,
            width: widthValue,
            height: heightValue,
            length: lengthValue,

        });

        console.log("Product before save:", product); // LOG 4: See the product object before saving

        const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;
        if (photo) {
            if (photo.size > 1_000_000) {
                return res.status(400).json({ error: "Image should be less than 1MB" });
            }
            product.photo = {
                data: await fs.promises.readFile(photo.filepath),
                contentType: photo.mimetype || "application/octet-stream"
            };
        }

        const result = await product.save();
        console.log("Product saved with ID:", result._id); // LOG 5: See the saved product ID
        
        return res.json({ data: result });

    } catch (err) {
        console.error("ERROR in create:", err); // LOG 6: See any errors
        return res.status(400).json({ error: "Product creation failed" });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await product.deleteOne();
        return res.json({
            message: "Product deleted successfully",
            productId: product._id
        });
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err as MongoError) });
    }
};

export const update = async (req: Request, res: Response) => {
    const form = formidable();
    try {
        const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>
            ((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) return reject(err);
                    resolve({ fields, files });
                });
            });

        let product = req.product;
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

      if (fields.description) {
    // Handle the read-only fields correctly
    const descriptionField = fields.description;
    const descriptionValue = Array.isArray(descriptionField) 
        ? descriptionField[0] 
        : descriptionField;
    
    if (descriptionValue && typeof descriptionValue === 'string') {
        product.description = {
            ...product.description,  // Keep existing translations
            en: descriptionValue      // Update English
        };
    }
    
    // We can't delete from fields, so we'll skip it in the Object.assign
    // by creating a new object without description
    const otherFields = Object.entries(fields)
        .filter(([key]) => key !== 'description')
        .reduce((acc, [key, value]) => {
            acc[key] = Array.isArray(value) ? value[0] : value;
            return acc;
        }, {} as Record<string, any>);
    
    Object.assign(product, otherFields);
} else {
    // Process all fields normally if no description
    Object.assign(
        product,
        Object.fromEntries(
            Object.entries(fields).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
        )
    );
}

        const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

        if (photo) {
            if (photo.size > 1_000_000) {
                return res.status(400).json({ error: "Image should be less than 1MB" });
            }
            const photoBuffer = await fs.promises.readFile(photo.filepath);
            product.photo = { data: photoBuffer, contentType: photo.mimetype || "application/octet-stream" };
        }
        const result = await product.save();
        return res.json(result);
    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: errorHandler(err as MongoError) });
    }
};

export const listBySubcategory = async (req: Request, res: Response) => {
  try {
    const { lang = 'en' } = req.query;
    
    const products = await Product.find({ subcategory: req.params.subcategoryId })
      .select("-photo")
      .lean();
      
    // Transform each product with safe type checking
    const transformedProducts = products.map(product => {
        let description = '';
        if (product.description && typeof product.description === 'object') {
            const desc = product.description as any;
            description = desc[lang as string] || desc.en || '';
        } else {
            description = product.description as string || '';
        }
        
        return {
            ...product,
            description
        };
    });
    
    return res.json({ data: transformedProducts });
  } catch (err) {
    return res.status(400).json({ error: "Products not found" });
  }
};

export const listSearch = async (req: Request, res: Response) => {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const category = typeof req.query.category === "string" ? req.query.category : "";
    const { lang = 'en' } = req.query;

    if (!search) {
        return res.json([]);
    }

    const query: Record<string, any> = {
        name: { $regex: search, $options: "i" }
    };

    if (category && category !== "All") {
        query.category = category;
    }

    try {
        const products = await Product.find(query)
            .select("-photo")
            .lean();

        // Transform each product with safe type checking
        const transformedProducts = products.map(product => {
            let description = '';
            if (product.description && typeof product.description === 'object') {
                const desc = product.description as any;
                description = desc[lang as string] || desc.en || '';
            } else {
                description = product.description as string || '';
            }
            
            return {
                ...product,
                description
            };
        });

        return res.json(transformedProducts);
    } catch (err) {
        res.status(400).json({ error: errorHandler(err as MongoError) });
    }
};

export const decreaseQuantity = async (req: Request, res: Response, next: NextFunction) => {
    const bulkOps = req.body.order.products.map(
        (item: { _id: string; count: number }) => ({
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: item.count } }
            }
        })
    );

    try {
        await Product.bulkWrite(bulkOps);
        next();
    } catch (error) {
        return res.status(400).json({ error: "Could not update product" });
    }
};

export const listBySearch = async (req: Request, res: Response) => {
    const order = req.body.order ? req.body.order : "desc";
    const sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    const limit = req.body.limit ? Number(req.body.limit) : 100;
    const skip = req.body.skip ? Number(req.body.skip) : 0;
    const { lang = 'en' } = req.query;
    
    const findArgs: Record<string, any> = {};
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = { $gte: req.body.filters[key][0], $lte: req.body.filters[key][1] };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    } 
    
    try {
        const data = await Product.find(findArgs)
            .select("-photo")
            .populate("category")
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit)
            .lean();
            
        // Transform each product with safe type checking
        const transformedData = data.map(product => {
            let description = '';
            if (product.description && typeof product.description === 'object') {
                const desc = product.description as any;
                description = desc[lang as string] || desc.en || '';
            } else {
                description = product.description as string || '';
            }
            
            return {
                ...product,
                description
            };
        });
        
        return res.json({ size: transformedData.length, data: transformedData });
    } catch (err) {
        return res.status(400).json({ error: "Products not found" });
    }
};