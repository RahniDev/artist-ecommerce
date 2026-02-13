import { Router } from 'express';
import { requireSignin, isAuth, isAdmin } from '../auth/auth.controller';
import { create, categoryById, read, update, remove, list } from './category.controller';
import { userById } from '../user/user.controller';

const router = Router();

router.get('/category/:categoryId', read);

router.post(
    '/category/create/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    create
);

router.put(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    update
);

router.delete(
    '/category/:categoryId/:userId',
    requireSignin,
    isAuth,
    isAdmin,
    remove
);

router.get('/categories', list);

router.param('categoryId', categoryById);
router.param('userId', userById);

export default router;
