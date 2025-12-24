import formidable, { Fields, Files } from 'formidable'
import * as fs from 'fs'
import { Product } from './product.model.js'
import { errorHandler } from '../../helpers/errorHandler.js'
import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            product?: import('../product/product.model').IProductDocument
        }
    }
}

export const productById = async (req: Request, res: Response, next: NextFunction, id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID' })
    } try {
        const product = await Product.findById(id)
            .populate('category')
            .select("-photo")
        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }
        req.product = product
        next()
    } catch (err) { return res.status(400).json({ error: errorHandler(err) }) }
}

export const read = (req: Request, res: Response): Response => {
    if (!req.product) {
        return res.status(404).json({ error: "Product not loaded" })
    }
    return res.json(req.product)
}

export const list = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .select("-photo")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return res.status(200).json({ data: products });
  } catch (err) {
    return res.status(400).json({ error: "Products not found" });
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

export const photo = (req: Request, res: Response, next: NextFunction): Response => {
    const photo = req.product?.photo
    if (photo?.data) {
        res.set('Content-Type', photo.contentType)
        return res.send(photo.data)
    }
    next()
}

export const create = async (req: Request, res: Response) => {
    let parsed; const form = formidable()
    try {
        parsed = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });
    } catch {
        return res.status(400).json({ error: "Image could not be uploaded" });
    }
    const { fields, files } = parsed;
    const { name, description, price, category, quantity, shipping } = fields;
    if (!name || !description || !price || !category || !quantity || !shipping) {
        return res.status(400).json({ error: "All fields are required" });
    }
    let product = new Product(fields);
    const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;
    if (photo) {
        if (photo.size > 1000000) {
            return res.status(400).json({ error: "Image should be less than 1MB" });
        }
        const photoData = await fs.promises.readFile(photo.filepath)
        product.photo = { data: photoData, contentType: photo.type };
    }
    try {
        const result = await product.save(); return res.json(result);
    }
    catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const product = req.product
    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    try {
        await product.deleteOne()
        return res.json({ message: "Product deleted successfully", productId: product._id });
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
}


export const update = async (req: Request, res: Response) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
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
        product = Object.assign(product, fields);
        const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

        if (photo) {
            if (photo.size > 1_000_000) {
                return res.status(400).json({ error: "Image should be less than 1MB" });
            }
            const photoBuffer = await fs.promises.readFile(photo.filepath);
            product.photo = { data: photoBuffer, contentType: photo.mimetype };
        }
        const result = await product.save();
        return res.json(result);
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};


export const listSearch = async (req: Request, res: Response) => {
    const search = typeof req.query.search === "string" ? req.query.search : "";
    const category = typeof req.query.category === "string" ? req.query.category : "";

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

        return res.json({ data: products });
    } catch (err) {
        res.status(400).json({ error: errorHandler(err) });
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
    const findArgs: Record<string, any> = {};
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte - greater than price [0-10]
                // lte - less than
                findArgs[key] = { $gte: req.body.filters[key][0], $lte: req.body.filters[key][1] };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    } try {
        const data = await Product.find(findArgs)
            .select("-photo")
            .populate("category")
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(limit)
            .lean()
        return res.json({ size: data.length, data });
    } catch (err) {
        return res.status(400).json({ error: "Products not found" });
    }
};
