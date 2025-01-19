import { ErrorEntry } from '../common/common.types';

export const AuthErrors: Record<string, ErrorEntry> = {
	AUTH_NOT_FOUND: {
		code: 'AUTH_NOT_FOUND',
		message: 'Auth not found',
		statusCode: 404,
	},
	NO_SESSION: {
		code: 'NO_SESSION',
		message: 'No session for this user',
		statusCode: 401,
	},
	EXPIRED_SESSION: {
		code: 'EXPIRED_SESSION',
		message:
			'This session is expired, please refresh the authorization token',
		statusCode: 401,
	},
	NO_PERMISSION: {
		code: 'NO_PERMISSION',
		message: 'You have no permission to execute this action',
		statusCode: 401,
	},
	INVALID_TOKEN: {
		code: 'INVALID_TOKEN',
		message: 'Invalid refresh token, leaving session.',
		statusCode: 400,
	},
	REGISTER_FAIL: {
		code: 'REGISTER_FAIL',
		message: 'Could not register user',
		statusCode: 500,
	},
	UNKNOWN_EMAIL: {
		code: 'UNKNOWN_EMAIL',
		message: 'Unknown email',
		field: 'email',
		statusCode: 404,
	},
	INCORRECT_PASSWORD: {
		code: 'INCORRECT_PASSWORD',
		message: 'Incorrect password',
		field: 'password',
		statusCode: 401,
	},
	PASSWORD_ENCRYPTION: {
		code: 'PASSWORD_ENCRYPTION',
		message: 'Unable to encrypt password',
		field: 'password',
		statusCode: 401,
	},
	EMAIL_ALREADY_EXISTS: {
		code: 'EMAIL_ALREADY_EXISTS',
		message: 'Email already exists',
		field: 'email',
		statusCode: 400,
	},
};
