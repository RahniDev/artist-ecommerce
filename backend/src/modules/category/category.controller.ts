import { Request, Response, NextFunction } from 'express';
import { Category, ICategory } from '../category/category.model.js';
import { Product } from '../product/product.model.js';
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
    const category = await Category.findById(id).populate('parent', '_id name');
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
    // If parent is empty string, treat as null (top-level category)
    if (req.body.parent === '') {
      req.body.parent = null;
    }

    // Validate parent exists if provided
    if (req.body.parent) {
      const parentExists = await Category.findById(req.body.parent);
      if (!parentExists) {
        return res.status(400).json({ error: 'Parent category does not exist' });
      }
      // Prevent deeply nested categories (max 1 level of nesting)
      if (parentExists.parent) {
        return res.status(400).json({
          error: 'Cannot create subcategory of a subcategory. Max one level of nesting allowed.',
        });
      }
    }

    const category = new Category(req.body);
    const savedCategory = await category.save();
    const populated = await savedCategory.populate('parent', '_id name');
    res.json(populated);
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err as MongoError) });
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

    // Handle parent update
    if (req.body.parent !== undefined) {
      const newParent = req.body.parent === '' ? null : req.body.parent;

      if (newParent) {
        const parentExists = await Category.findById(newParent);
        if (!parentExists) {
          return res.status(400).json({ error: 'Parent category does not exist' });
        }
        if (parentExists.parent) {
          return res.status(400).json({
            error: 'Cannot nest subcategory under another subcategory.',
          });
        }
        // Prevent setting own child as parent (circular reference)
        const hasChildren = await Category.exists({ parent: req.category._id });
        if (hasChildren) {
          return res.status(400).json({
            error: 'Cannot set a parent on a category that already has subcategories.',
          });
        }
      }

      req.category.parent = newParent;
    }

    const updatedCategory = await req.category.save();
    const populated = await updatedCategory.populate('parent', '_id name');
    res.json(populated);
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
    const products = await Product.find({ category: req.category._id }).exec();
    if (products.length > 0) {
      return res.status(400).json({
        message: `Sorry. You can't delete ${req.category.name}. It has ${products.length} associated products.`,
      });
    }

    // Check for subcategories
    const subcategories = await Category.find({ parent: req.category._id }).exec();
    if (subcategories.length > 0) {
      return res.status(400).json({
        message: `Sorry. You can't delete ${req.category.name}. It has ${subcategories.length} subcategories. Delete or reassign them first.`,
      });
    }

    await req.category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: errorHandler(err as MongoError) });
  }
};

/**
 * Flat list — returns all categories with their parent field populated.
 * Useful for dropdowns and admin tables.
 */
export const list = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find()
      .select('_id name parent')
      .populate('parent', '_id name')
      .lean();
    return res.json(categories);
  } catch (err) {
    return res.status(400).json({ error: 'Categories not found' });
  }
};

/**
 * Nested/tree list — returns top-level categories each with a
 * `subcategories` array. Useful for navigation menus.
 */
export const listNested = async (req: Request, res: Response) => {
  try {
    const all = await Category.find().select('_id name parent').lean();

    const topLevel = all.filter((c) => !c.parent);
    const tree = topLevel.map((parent) => ({
      ...parent,
      subcategories: all.filter(
        (c) => c.parent && c.parent.toString() === parent._id.toString()
      ),
    }));

    return res.json(tree);
  } catch (err) {
    return res.status(400).json({ error: 'Categories not found' });
  }
};
