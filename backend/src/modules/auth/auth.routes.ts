import express from 'express';
import { signup, signin, signout } from '../auth/auth.controller';
import { userSignupValidator } from '../../validator/index';

const router = express.Router();

// Routes
router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

export default router;
