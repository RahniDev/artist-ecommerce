import { Router } from "express";

import { requireSignin, isAuth, isAdmin } from '../auth/auth.controller.js'
import {
    create,
    productById,
    read,
    deleteProduct,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo,
    listSearch
} from './product.controller.js';
import { userById } from '../user/user.controller.js'

const router: Router = Router();

router.get('/product/photo/:productId', photo)
router.get('/product/:productId', read)
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct)
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, update)

router.get('/products', list)
router.get('/products/search', listSearch)
router.get('/products/related/:productId', listRelated)
router.get('/products/categories', listCategories)
router.post('/products/by/search', listBySearch)

router.param('userId', userById)
router.param('productId', productById)

export default router