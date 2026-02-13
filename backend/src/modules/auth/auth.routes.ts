import {Router} from 'express';
import { signup, signin, signout } from './auth.controller';
import { userSignupValidator } from '../../validator/index';

const router = Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

export default router;
