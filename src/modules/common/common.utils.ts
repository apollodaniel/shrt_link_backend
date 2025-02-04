import { Response } from 'express';
import { ErrorEntry } from './common.types';
import { COMMON_ERRORS } from './common.errors';

export function isErrorEntry(err: any): err is ErrorEntry {
	return (
		err &&
		typeof err === 'object' &&
		typeof err.code === 'string' &&
		typeof err.message === 'string' &&
		!(err.field && typeof err.field !== 'string') &&
		typeof err.statusCode === 'number'
	);
}

export function sendErrorResponse(resp: Response, err: any, kind: string) {
	console.log(err);
	const errorEntry = isErrorEntry(err) ? err : COMMON_ERRORS['UNKNOWN_ERROR'];

	return resp.status(errorEntry.statusCode).json({
		...errorEntry,
		kind,
	});
}
