import { Response } from 'express';
import { ErrorEntry } from './common.types';
import { COMMON_ERRORS } from './common.errors';
import { UserRepository } from '../users/users.repository';
import { Brackets } from 'typeorm';

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

export async function cleanTestEnvironment() {
	await UserRepository
	  .createQueryBuilder("user")
	  .leftJoin("user.urls", "url")
	  .leftJoin("url.statistics", "statistic")
	  .select("user.id") // Only select IDs for deletion
	  .where(new Brackets(qb => {
		// Group 1: Very inactive users (no URLs or no stats)
		qb.where("user.creationDate < NOW() - INTERVAL '10 minutes'")
		  .andWhere(new Brackets(subQb => {
			subQb.where("url.id IS NULL").orWhere("statistic.id IS NULL");
		  }));
	  }))
	  .orWhere(new Brackets(qb => {
		// Group 2: Users meeting other inactivity criteria
		qb.where("user.creationDate < NOW() - INTERVAL '15 minutes'")
		  .orWhere("statistic.accessTime < NOW() - INTERVAL '5 minutes'")
		  .orWhere("url.creationDate < NOW() - INTERVAL '10 minutes'");
	  }))
	  .distinct(true) // Ensure unique IDs
	  .delete()
	  .execute();
}
