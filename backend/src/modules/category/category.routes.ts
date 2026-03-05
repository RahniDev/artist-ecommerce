import { Router } from 'express';
import { requireSignin, isAuth, isAdmin } from '../auth/auth.controller.js';
import {
  create,
  categoryById,
  getCategory,
  update,
  remove,
  list,
  listNested,
} from './category.controller.js';
import { userById } from '../user/user.controller.js';
import { listBySubcategory } from '../product/product.controller.js';

const router = Router();

// Public routes
router.get('/category/:categoryId', getCategory);
router.get('/products/subcategory/:subcategoryId', listBySubcategory);
router.get('/categories', list);
router.get('/categories/nested', listNested);

// Admin routes
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('categoryId', categoryById);
router.param('userId', userById);

export default router;
