import { Router } from 'express';
import { signup, signin, signout, forgotPassword, resetPassword } from './auth.controller.js';
import { userSignupValidator } from '../../validator/index.js';
import { signinLimiter, signupLimiter, forgotPasswordLimiter } from "../../middleware/rateLimiter.js";

const router = Router();

router.post('/forgotPassword', forgotPasswordLimiter, forgotPassword);
router.post('/resetPassword', resetPassword);
router.post('/signup', userSignupValidator, signupLimiter, signup);
router.post('/signin', signinLimiter, signin);
router.get('/signout', signout);

export default router;