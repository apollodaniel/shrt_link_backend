import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { USER_GET_VALIDATION } from './users.validation';
import { ValidationController } from '../validation/validation.controller';
import { UserController } from './users.controller';

const router = Router();

router.get(
	'/users/:id',
	checkSchema(USER_GET_VALIDATION),
	ValidationController.validateWithAuth,
	UserController.getUser,
);
router.get(
	'/users/current',
	ValidationController.validateWithAuth,
	UserController.getCurrentUser,
);
router.delete(
	'/users/current',
	ValidationController.validateWithAuth,
	UserController.deleteUser,
);

export default router;
