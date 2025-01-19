import { Schema } from 'express-validator';

export const USER_GET_VALIDATION: Schema = {
	id: {
		in: ['params'],
		isString: {
			errorMessage: 'id must be a string',
		},
		notEmpty: {
			errorMessage: 'id must not be empty',
		},
	},
};
