import { Schema } from 'express-validator';

export const REGISTER_POST_VALIDATION: Schema = {
	id: {
		customSanitizer: {
			options: () => undefined,
		},
	},
	firstName: {
		isString: {
			errorMessage: 'firstName must be a valid string',
		},
		isEmpty: {
			errorMessage: 'firstName must not be empty',
		},
		isLength: {
			options: {
				min: 3,
				max: 30,
			},
			errorMessage: 'firstName must be between 3-30 char long',
		},
	},
	lastName: {
		isString: {
			errorMessage: 'lastName must be a valid string',
		},
		isEmpty: {
			errorMessage: 'lastName must not be empty',
		},
		isLength: {
			options: {
				min: 3,
				max: 30,
			},
			errorMessage: 'lastName must be between 3-30 char long',
		},
	},
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
	creationDate: {
		customSanitizer: {
			options: () => undefined,
		},
	},
};
