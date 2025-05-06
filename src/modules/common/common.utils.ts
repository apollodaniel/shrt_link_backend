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
	const deletedUsers = await UserRepository()
	  .createQueryBuilder("users")
	  .leftJoin('users.urls', "url")
	  .leftJoin('url.statistics', "statistic")
	  .where(new Brackets(qb => { qb.where("url.id IS NULL")
		  .andWhere('users."creationDate" < NOW() - INTERVAL \'10 minutes\'');
	  }))
	  .orWhere(new Brackets(qb => {
		qb.where("url.id IS NOT NULL")
		  .andWhere(new Brackets(subQb => {
			subQb.where('users."creationDate" < NOW() - INTERVAL \'15 minutes\'')
				 .orWhere('statistic."accessTime" < NOW() - INTERVAL \'5 minutes\'');
		  }));
	  }))
	  .distinct(true)
	  .getMany();
	if(deletedUsers.length>0)
		await UserRepository().delete(deletedUsers.map(u=>u.id));

	return deletedUsers;
}
