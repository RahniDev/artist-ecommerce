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
listSearch,
listByFilters
} from './product.controller.js';
import { userById } from '../user/user.controller.js'

const router: Router = Router();
// ← static/non-param routes first
router.get('/products/search', listSearch);
router.get('/products/categories', listCategories);
router.get('/products', list);
router.post('/products/filter', listByFilters);


// param declarations
router.param('userId', userById);
router.param('productId', productById);

// routes that use params
router.get('/products/:productId', read);
router.post('/products/create/:userId', requireSignin, isAuth, isAdmin, create);
router.delete('/products/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct);
router.put('/products/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/products/related/:productId', listRelated);

export default router;