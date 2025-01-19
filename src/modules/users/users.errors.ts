import { ErrorEntry } from '../common/common.types';

export const USER_ERRORS: Record<string, ErrorEntry> = {
	USER_NOT_FOUND: {
		code: 'USER_NOT_FOUND',
		message: 'User not found',
		statusCode: 404,
	},
};
