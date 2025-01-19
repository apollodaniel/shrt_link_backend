import { Schema } from 'express-validator';

export const LOGIN_POST_VALIDATION: Schema = {
	email: {
		isString: {
			errorMessage: 'email must be a valid string',
		},
		isEmail: {
			errorMessage: 'must be a valid email adress',
		},
		isEmpty: {
			errorMessage: 'email must not be empty',
		},
	},
	password: {
		isString: {
			errorMessage: 'password must be a valid string',
		},
		isEmpty: {
			errorMessage: 'password must not be empty',
		},
		isLength: {
			options: {
				min: 8,
				max: 30,
			},
			errorMessage: 'password must be between 8-30 char long',
		},
	},
};
