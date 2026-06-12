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

const applyLang = (product: any, lang: string) => {
    const description = typeof product.description === 'object'
        ? product.description[lang] || product.description.en || ''
        : product.description || '';


    const name = typeof product.name === 'object'
        ? product.name[lang] || product.name.en || ''
        : product.name || '';

    const nameEn = typeof product.name === 'object'
        ? product.name.en || ''
        : product.name || '';

    return { ...product, name, nameEn, description };
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
            .select("name description price category quantity sold shipping weight width height length photos.url photos.key photos.contentType createdAt")


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

        const products = await Product.find()
            .select("name description price category quantity sold shipping weight width height length photos.url photos.key photos.contentType createdAt")
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

        const products = await Product.find(
            {
                _id: { $ne: req.product?._id },
                category: req.product?.category
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

        const [nameTranslations, descTranslations] = await Promise.all([
            translateToAll(nameValue),
            translateToAll(descriptionValue)
        ]);

        const product = new Product({
            name: { en: nameValue, ...nameTranslations },
            description: { en: descriptionValue, ...descTranslations },
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

        console.log("Product before save:", product);

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
        console.log("Product saved with ID:", result._id);

        return res.json({ data: result });

    } catch (err) {
        console.error("ERROR in create:", err);
        return res.status(400).json({ error: "Product creation failed" });
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
        if (fields.description) {

            const descriptionField = fields.description;
            const descriptionValue = Array.isArray(descriptionField)
                ? descriptionField[0]
                : descriptionField;

            if (descriptionValue && typeof descriptionValue === 'string') {
                const translations = await translateToAll(descriptionValue);
                product.description = {
                    en: descriptionValue,
                    de: translations.de ?? '',
                    es: translations.es ?? '',
                    it: translations.it ?? '',
                    fr: translations.fr ?? ''
                };
            }

            // You can't delete from fields, so skip it in the Object.assign
            // by creating a new object without description
            const otherFields = Object.entries(fields)
                .filter(([key]) => key !== 'description' && key !== 'name')
                .reduce((acc, [key, value]) => {
                    acc[key] = Array.isArray(value) ? value[0] : value;
                    return acc;
                }, {} as Record<string, any>);

            Object.assign(product, otherFields);
        } else {
            const otherFields = Object.entries(fields)
                .filter(([key]) => key !== 'name')
                .reduce((acc, [key, value]) => {
                    acc[key] = Array.isArray(value) ? value[0] : value;
                    return acc;
                }, {} as Record<string, any>);
            Object.assign(product, otherFields);
        }

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

export const listBySubcategory = async (req: Request, res: Response) => {
    try {
        const { lang = 'en' } = req.query;

        const products = await Product.find({ subcategory: req.params.subcategoryId })
            .select("name description price category quantity sold shipping weight width height length photos.url photos.key photos.contentType createdAt")
            .lean();

        const transformedProducts = products.map(p => applyLang(p, lang as string));

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
        'name.en': { $regex: search, $options: "i" }
    };

    if (category && category !== "All") {
        query.category = category;
    }

    try {
        const products = await Product.find(query)
            .select("name description price category quantity sold shipping weight width height length photos.url photos.key photos.contentType createdAt")
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
            .select("name description price category quantity sold shipping weight width height length photos.url photos.key photos.contentType createdAt")
            .populate("category")
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit)
            .lean();

        const transformedData = data.map(p => applyLang(p, lang as string));

        return res.json({ size: transformedData.length, data: transformedData });

    } catch (err) {
        return res.status(400).json({ error: "Products not found" });
    }
};