import { Router } from 'express';
import { requireSignin, isAuth, isAdmin } from '../auth/auth.controller.js';
import { userById } from '../user/user.controller.js';
import { brainTreeToken, processPayment } from './braintree.controller.js';
const router = Router();
router.get('/braintree/getToken/:userId', requireSignin, isAuth, isAdmin, brainTreeToken);
router.post('/braintree/payment/:userId', requireSignin, isAuth, isAdmin, processPayment);
router.param('userId', userById);
export default router;
