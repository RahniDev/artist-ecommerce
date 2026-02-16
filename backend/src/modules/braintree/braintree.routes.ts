import { Router } from 'express';
import { requireSignin, isAuth } from '../auth/auth.controller.js';
import { userById } from '../user/user.controller.js';
import { brainTreeToken, processPayment } from './braintree.controller.js';

const router = Router();

router.get('/braintree/getToken/:userId', requireSignin, isAuth, brainTreeToken);

router.post('/braintree/payment/:userId', requireSignin, isAuth, processPayment);

router.param('userId', userById);

export default router;
