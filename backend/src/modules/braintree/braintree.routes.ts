import { Router } from 'express';
import { requireSignin, isAuth } from '../auth/auth.controller';
import { userById } from '../user/user.controller';
import { brainTreeToken, processPayment } from './braintree.controller';

const router = Router();

router.get('/braintree/getToken/:userId', requireSignin, isAuth, brainTreeToken);

router.post('/braintree/payment/:userId', requireSignin, isAuth, processPayment);

router.param('userId', userById);

export default router;
