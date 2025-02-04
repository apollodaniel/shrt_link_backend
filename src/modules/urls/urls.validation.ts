import { Schema } from 'express-validator';

export const URL_GET_VALIDATION: Schema = {
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

export const URL_SUMMARY_GET_VALIDATION: Schema = {
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
export const URL_DELETE_VALIDATION: Schema = {
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

export const URL_POST_VALIDATION: Schema = {
	id: {
		customSanitizer: {
			options: () => undefined,
		},
	},
	originalUrl: {
		isString: {
			errorMessage: 'originalUrl must be a valid string',
		},
		notEmpty: {
			errorMessage: 'originalUrl must not be empty',
		},
	},
	userId: {
		customSanitizer: {
			options: () => undefined,
		},
	},
	creationDate: {
		customSanitizer: {
			options: () => undefined,
		},
	},
};
