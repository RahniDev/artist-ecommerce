import { Request, Response, NextFunction } from 'express';
import { Category, ICategory } from '../category/category.model.js';
import { Product } from '../product/product.model.js';
import { applyLang } from '../product/product.controller.js'
import { errorHandler, MongoError } from '../../helpers/errorHandler.js';

interface CustomRequest extends Request {
  category?: ICategory;
}

export const categoryById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
  id: string
) => {
  try {
    const category = await Category.findById(id)
    if (!category) {
      return res.status(404).json({ error: 'Category does not exist' });
    }
    req.category = category;
    next();
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err as MongoError) });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.json(savedCategory);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err as MongoError) });
  }
};

export const getCategory = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const lang = typeof req.query.lang === 'string' ? req.query.lang : "en";
    const products = await Product.find({
      category: req.category!._id
    })
      .select("-photo")
      .lean();
    const transformed = products.map(p => applyLang(p, lang));
    res.json({
      ...req.category!.toObject(),
      products: transformed
    });
  } catch (err) {
    res.status(400).json({
      error: "Failed to load category"
    });
  }
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
    return res.status(400).json({ error: errorHandler(err as MongoError) });
  }
};

export const remove = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check for associated products
    const productCount = await Product.countDocuments({
      category: req.category._id
    })
    if (productCount > 0) {
      return res.status(400).json({
        message: `Sorry. You can't delete ${req.category.name}. It has ${productCount} associated products.`,
      });
    }
    await req.category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err as MongoError) });
  }
};

export const list = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find()
      .select('_id name')
      .lean();
    return res.json(categories);
  } catch (err) {
    return res.status(400).json({ error: 'Categories not found' });
  }
};