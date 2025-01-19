import { ErrorEntry } from './common.types';

export const COMMON_ERRORS: Record<string, ErrorEntry> = {
	NO_PERMISSION: {
		code: 'NO_PERMISSION',
		message: 'You have no permission to execute this action',
		statusCode: 401,
	},
	UNKNOWN_ERROR: {
		code: 'UNKNOWN_ERROR',
		message: 'AN UNKNOWN ERROR OCCURRED',
		statusCode: 500,
	},
};
