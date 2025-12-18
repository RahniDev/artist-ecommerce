import { Request, Response, NextFunction } from 'express';
import { Category, ICategory } from '../category/category.model.js';
import { Product } from '../product/product.model.js';
import { errorHandler } from '../../helpers/errorHandler.js';

interface CustomRequest extends Request {
    category?: ICategory;
}

export const categoryById = async (req: CustomRequest, res: Response, next: NextFunction, id: string) => {
    try {
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category does not exist' });
        }
        req.category = category;
        next();
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const category = new Category(req.body);
        const savedCategory = await category.save();
        res.json(savedCategory);
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};

export const read = (req: CustomRequest, res: Response) => {
    res.json(req.category);
};

export const update = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        req.category.name = req.body.name || req.category.name;
        const updatedCategory = await req.category.save();
        res.json(updatedCategory);
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};

export const remove = async (req: CustomRequest, res: Response) => {
    try {
        if (!req.category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const products = await Product.find({ category: req.category._id }).exec();
        if (products.length > 0) {
            return res.status(400).json({
                message: `Sorry. You can't delete ${req.category.name}. It has ${products.length} associated products.`
            });
        }
        await req.category.deleteOne();
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        return res.status(400).json({ error: errorHandler(err) });
    }
};

// export const list = async (req: Request, res: Response) => {
//     try {
//         const categories = await Category.find().sort('name').exec();
//         res.json(categories);
//     } catch (err) {
//         return res.status(400).json({ error: errorHandler(err) });
//     }
// };
export const list = async (req: Request, res: Response) => {
  console.log("🔥 list categories hit");
  return res.json({ ok: true });
}