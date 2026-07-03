import { Router } from 'express';
import { requireSignin, isAuth, isAdmin } from '../auth/auth.controller.js';
import {
  create,
  categoryById,
  getCategory,
  getFeaturedCategory,
  update,
  remove,
  list,
} from './category.controller.js';
import { userById } from '../user/user.controller.js';

const router = Router();

// Public routes
router.get('/categories/featured', getFeaturedCategory)
router.get('/categories/:categoryId', getCategory);
router.get('/categories', list);

// Admin routes
router.post('/categories/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/categories/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/categories/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('categoryId', categoryById);
router.param('userId', userById);

export default router;
