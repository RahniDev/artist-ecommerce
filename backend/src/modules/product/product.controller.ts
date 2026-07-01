import formidable, { Fields, Files } from 'formidable'
import { Product } from './product.model.js'
import { errorHandler, MongoError } from '../../helpers/errorHandler.js'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { translateToAll } from './translate.js'
import { deleteProductPhoto, uploadProductPhoto } from "./r2.service.js";

declare global {
    namespace Express {
        interface Request {
            product?: import('./product.model.js').IProductDocument
        }
    }
}

export const applyLang = (product: any, lang: string) => {
    const name = typeof product.name === 'object'
        ? product.name[lang] || product.name.en || ''
        : product.name || '';

    const nameEn = typeof product.name === 'object'
        ? product.name.en || ''
        : product.name || '';

    return { ...product, name, nameEn };
};

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
            .select("name price category quantity sold weight width height length photos.url photos.key photos.contentType material medium createdAt")


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

export const read = async (req: Request, res: Response): Promise<Response> => {
    if (!req.product) {
        return res.status(404).json({ error: "Product not loaded" })
    }

    const { lang = 'en' } = req.query;

    // Re-fetch with photos (but strip binary data manually)
    const fullProduct = await Product.findById(req.product._id)
        .populate("category")
        .lean();

    if (!fullProduct) {
        return res.status(404).json({ error: "Product not found" });
    }
    // Strip binary data but keep rest of each photo object
    const photos = (fullProduct.photos ?? []).map(({ data, ...rest }: any) => rest);

    return res.json({
        ...applyLang(fullProduct, lang as string),
        photos,
        photoCount: photos.length
    });
}

export const list = async (req: Request, res: Response) => {
    try {
        const { lang = 'en' } = req.query;

        const products = await Product.find({
            quantity: { $gt: 0 }
        })
            .select("name price category quantity sold weight width height length photos.url photos.key photos.contentType material medium createdAt")
            .sort({ createdAt: -1 })
            .limit(12)
            .lean();

        const transformedProducts = products.map(p => applyLang(p, lang as string));

        return res.status(200).json({ data: transformedProducts });
    } catch (err) {
        return res.status(400).json({ error: "Products not found" });
    }
};

// returns products in same category 
export const listRelated = async (req: Request, res: Response) => {
    let limit = req.query.limit ? Number(req.query.limit) : 6
    try {
        const { lang = 'en' } = req.query;

        const products = await Product.find({
            _id: { $ne: req.product?._id },
            category: req.product?.category,
            quantity: { $gt: 0 }
        })
            .limit(limit)
            .populate('category', '_id name')
            .lean()
        const transformedProducts = products.map(p => applyLang(p, lang as string));
        return res.json({ data: transformedProducts });
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
        const product = await Product.findById(req.params.productId).select("photos");

        console.log("Requested:", req.params.productId);
        console.log("Found product:", !!product);
        console.log("Photos:", product?.photos);
        const index = Number(req.query.index) || 0;
        const img = product?.photos?.[index];

        if (!product || !img?.url) {
            return res.status(404).send("No image");
        }

        return res.redirect(302, img.url);
    } catch (err) {
        return res.status(500).send("Image error");
    }
};

export const create = async (req: Request, res: Response) => {
    const form = formidable({ multiples: true });

    try {
        const { fields, files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        let { name, price, category, weight, width, height, length, framing, material, medium, additionalDetails, quality, colors } = fields;
        // normalize fields to ensure expected type
        const normalize = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] : v;
        const normalizeArray = (v: string | string[] | undefined) => {
            if (!v) return [];
            return Array.isArray(v) ? v : [v];
        };

        const nameValue = normalize(name);
        const priceValue = Number(normalize(price));
        const categoryValue = normalize(category);
        const weightValue = Number(normalize(weight));
        const widthValue = normalize(width) ? Number(normalize(width)) : undefined;
        const heightValue = normalize(height) ? Number(normalize(height)) : undefined;
        const lengthValue = normalize(length) ? Number(normalize(length)) : undefined;
        const framingValue = normalize(framing);
        const additionalDetailsValue = normalize(additionalDetails);
        const qualityValue = normalize(quality);
        const materialValue = normalize(material);
        const mediumValue = normalize(medium);
        const quantityValue = 1;
        const colorsValue = normalizeArray(colors);

        if (
            nameValue == null ||
            isNaN(priceValue) ||
            categoryValue == null
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const [nameTranslations] = await Promise.all([
            translateToAll(nameValue),]);

        const product = new Product({
            name: { en: nameValue, ...nameTranslations },
            price: priceValue,
            category: categoryValue,
            quantity: quantityValue,
            weight: weightValue,
            width: widthValue,
            height: heightValue,
            length: lengthValue,
            framing: framingValue,
            material: materialValue,
            medium: mediumValue,
            additionalDetails: additionalDetailsValue,
            quality: qualityValue,
            colors: colorsValue
        });

        const uploadedPhotos = Array.isArray(files.photos)
            ? files.photos
            : files.photos
                ? [files.photos]
                : [];

        if (uploadedPhotos.length > 0) {
            for (const photo of uploadedPhotos) {
                if (photo.size > 1_000_000) {
                    return res.status(400).json({ error: "Each image must be less than 1MB" });
                }
            }
            product.photos = await Promise.all(
                uploadedPhotos.map(uploadProductPhoto)
            );

        }
        const result = await product.save();
        return res.status(201).json({ data: result });

    } catch (err: any) {
        return res.status(400).json({
            error: err.message,
            details: err.errors
        });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        await Promise.all(
            product.photos.map(photo => deleteProductPhoto(photo.key))
        );

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
    const form = formidable({ multiples: true });
    try {
        const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>
            ((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    console.log(files)
                    if (err) return reject(err);
                    resolve({ fields, files });
                });
            });

        let product = req.product;
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        if (fields.name) {
            const nameValue = Array.isArray(fields.name) ? fields.name[0] : fields.name;
            if (nameValue) {
                const translations = await translateToAll(nameValue);
                product.name = {
                    en: nameValue,
                    de: translations.de ?? '',
                    es: translations.es ?? '',
                    it: translations.it ?? '',
                    fr: translations.fr ?? ''
                };
            }
        }

        const otherFields = Object.entries(fields)
            .filter(([key]) => key !== 'name')
            .reduce((acc, [key, value]) => {
                acc[key] = Array.isArray(value) ? value[0] : value;
                return acc;
            }, {} as Record<string, any>);

        Object.assign(product, otherFields);


        // Keep a copy of the existing photos
        const oldPhotos = [...product.photos];

        const uploadedPhotos = Array.isArray(files.photos)
            ? files.photos
            : files.photos
                ? [files.photos]
                : [];

        if (uploadedPhotos.length > 0) {
            // Validate size
            for (const photo of uploadedPhotos) {
                if (photo.size > 1_000_000) {
                    return res.status(400).json({
                        error: "Each image must be less than 1MB"
                    });
                }
            }

            // Upload new photos to R2
            product.photos = await Promise.all(
                uploadedPhotos.map(uploadProductPhoto)
            );
        }

        const result = await product.save();

        // Delete old photos from R2 only after successful save
        if (uploadedPhotos.length > 0) {
            await Promise.all(
                oldPhotos.map(photo => deleteProductPhoto(photo.key))
            );
        }

        return res.json(result);

    } catch (err) {
        console.log(err)
        return res.status(400).json({ error: errorHandler(err as MongoError) });
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
        'name.en': { $regex: search, $options: "i" },
        quantity: { $gt: 0 }
    };

    if (category && category !== "All") {
        query.category = category;
    }

    try {
        const products = await Product.find(query)
            .select("name price category quantity sold weight width height length photos.url photos.key photos.contentType createdAt")
            .lean();

        const transformedProducts = products.map(p => applyLang(p, lang as string));

        return res.json(transformedProducts);
    } catch (err) {
        res.status(400).json({ error: errorHandler(err as MongoError) });
    }
};

export const decreaseQuantity = async (req: Request, res: Response, next: NextFunction) => {
    const bulkOps = req.body.order.products.map(
        (item: { product: string; count: number }) => ({
            updateOne: {
                filter: { _id: item.product },
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

const sizeFilter = (sizes: string[]) => {
    const conditions: any[] = [];

    for (const size of sizes) {
        switch (size) {
            case "Small":
                conditions.push({
                    $and: [
                        { $or: [{ width: { $lt: 30 } }, { height: { $lt: 30 } }] }
                    ]
                });
                break;

            case "Medium":
                conditions.push({
                    $and: [
                        {
                            $or: [
                                { width: { $gte: 30, $lte: 50 } },
                                { height: { $gte: 30, $lte: 50 } }
                            ]
                        }
                    ]
                });
                break;

            case "Large":
                conditions.push({
                    $and: [
                        {
                            $or: [
                                { width: { $gte: 50, $lte: 70 } },
                                { height: { $gte: 50, $lte: 70 } }
                            ]
                        }
                    ]
                });
                break;

            case "Oversized":
                conditions.push({
                    $or: [
                        { width: { $gt: 70 } },
                        { height: { $gt: 70 } }
                    ]
                });
                break;
        }
    }

    return conditions.length ? { $or: conditions } : {};
};

export const listByFilters = async (req: Request, res: Response) => {
    const order = req.body.order || "desc";
    const sortBy = req.body.sortBy || "_id";
    const limit = req.body.limit ? Number(req.body.limit) : 100;
    const skip = req.body.skip ? Number(req.body.skip) : 0;
    const { lang = "en" } = req.query;

    const filters = req.body.filters || {};
    const findArgs: Record<string, any> = {
        quantity: { $gt: 0 }
    };

    for (const key in filters) {
        const value = filters[key];

        if (!value || value.length === 0) continue;

        if (key === "price") {
            findArgs.price = {
                $gte: value[0],
                $lte: value[1],
            };
        } else if (key === "size") {
            Object.assign(findArgs, sizeFilter(value));
        } else if (key === "colors") {
            findArgs.colors = { $in: value };
        } else {
            findArgs[key] = { $in: value };
        }
    }

    try {
        const data = await Product.find(findArgs)
            .select(`
        name
        price
        category
        quantity
        sold
        material
        medium
        colors
        framing
        weight
        width
        height
        length
        photos.url
        photos.key
        photos.contentType
        createdAt
      `)
            .populate("category")
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit)
            .lean();

        const transformedData = data.map(p => applyLang(p, lang as string));

        return res.json({
            size: transformedData.length,
            data: transformedData
        });
    } catch (err) {
        return res.status(400).json({ error: "Products not found" });
    }
};