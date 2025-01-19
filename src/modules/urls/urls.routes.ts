import { Router } from 'express';
import { checkSchema } from 'express-validator';
import {
	URL_DELETE_VALIDATION,
	URL_GET_VALIDATION,
	URL_POST_VALIDATION,
} from './urls.validation';
import { ValidationController } from '../validation/validation.controller';
import { UrlController } from './urls.controller';

const router = Router();

router.get(
	'/urls/:id',
	checkSchema(URL_GET_VALIDATION),
	ValidationController.validateWithAuth,
	UrlController.getUrl,
);
router.delete(
	'/urls/:id',
	checkSchema(URL_DELETE_VALIDATION),
	ValidationController.validateWithAuth,
	UrlController.deleteUrl,
);
router.get(
	'/urls/',
	checkSchema(URL_POST_VALIDATION),
	ValidationController.validateWithAuth,
	UrlController.addUrl,
);

export default router;
