import { Router } from 'express';
import { signup, signin, signout } from './auth.controller.js';
import { userSignupValidator } from '../../validator/index.js';
const router = Router();
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);
export default router;
