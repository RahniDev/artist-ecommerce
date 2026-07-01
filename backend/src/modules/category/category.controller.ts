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
    res.status(201).json(savedCategory);
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

export const getFeaturedCategory = async (req: Request, res: Response) => {
  try {
    const lang = typeof req.query.lang === "string" ? req.query.lang : "en";

    const topCategory = await Product.aggregate([
      {
        $match: {
          quality: "High quality",
          quantity: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: "$category",
          highQualityCount: { $sum: 1 }
        }
      },
      {
        $sort: { highQualityCount: -1 }
      },
      {
        $limit: 1
      }
    ]);

    if (!topCategory.length) {
      return res.json({
        category: null,
        products: []
      });
    }

    const categoryId = topCategory[0]._id;


    const category = await Category.findById(categoryId).lean();

    if (!category) {
      return res.status(404).json({ error: "Featured category not found" });
    }

    const products = await Product.find({
      category: categoryId,
      quantity: { $gt: 0 }
    })
      .select("-photo")
      .lean();

    const transformedProducts = products.map((p) => applyLang(p, lang));

    return res.json({
      ...category,
      products: transformedProducts,
      highQualityCount: topCategory[0].highQualityCount
    });
  } catch (err) {
    return res.status(400).json({ error: "Failed to load featured category" });
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