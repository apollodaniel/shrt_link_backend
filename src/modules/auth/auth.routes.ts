import { Router } from 'express';
import { AuthController } from './auth.controller';
import { checkSchema } from 'express-validator';
import { REGISTER_POST_VALIDATION } from './auth.validation.register';
import { LOGIN_POST_VALIDATION } from './auth.validation.login';
import { ValidationController } from '../validation/validation.controller';

const router = Router();

router.post(
	'/auth/register',
	checkSchema(REGISTER_POST_VALIDATION),
	ValidationController.validate,
	AuthController.registerUser,
);
router.post(
	'/auth/login',
	checkSchema(LOGIN_POST_VALIDATION),
	ValidationController.validate,
	AuthController.loginUser,
);

router.post('/auth/logout', AuthController.logoutUser);

router.get('/auth/check-session', AuthController.checkSession);

router.get('/auth/refresh', AuthController.refreshAuth);

export default router;
