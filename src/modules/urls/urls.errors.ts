import { ErrorEntry } from '../common/common.types';

export const URL_ERRORS: Record<string, ErrorEntry> = {
	URL_NOT_FOUND: {
		code: 'URL_NOT_FOUND',
		message: 'Url not found',
		statusCode: 404,
	},
	NO_PERMISSION: {
		code: 'NO_PERMISSION',
		message: 'You have no permission to execute this action',
		statusCode: 401,
	},
};
