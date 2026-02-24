import { Router } from 'express';
import { brainTreeToken, processPayment } from './braintree.controller.js';
import { optionalSignin } from '../auth/auth.controller.js';
const router = Router();

router.get('/braintree/getToken', optionalSignin, brainTreeToken);

router.post('/braintree/payment', optionalSignin, processPayment);

export default router;
