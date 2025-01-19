import { Router } from 'express';
import { AuthController } from './auth.controller';
import { checkSchema } from 'express-validator';
import { REGISTER_POST_VALIDATION } from './auth.validation.register';
import { LOGIN_POST_VALIDATION } from './auth.validation.login';

const router = Router();

router.post(
	'/auth/register',
	checkSchema(REGISTER_POST_VALIDATION),
	AuthController.registerUser,
);
router.post(
	'/auth/login',
	checkSchema(LOGIN_POST_VALIDATION),
	AuthController.loginUser,
);
router.post('/auth/logout', AuthController.logoutUser);

export default router;
