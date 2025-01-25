import { ErrorEntry } from '../common/common.types';

export const STATISTIC_ERRORS: Record<string, ErrorEntry> = {
	STATISTIC_NOT_FOUND: {
		code: 'STATISTIC_NOT_FOUND',
		message: 'Statistic not found',
		statusCode: 404,
	},
	NO_PERMISSION: {
		code: 'NO_PERMISSION',
		message: 'You have no permission to execute this action',
		statusCode: 401,
	},
};
