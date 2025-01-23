import { NextFunction, Request, Response } from 'express';
import { AuthServices } from './auth.services';
import { User } from '../users/users.entity';
import { sendErrorResponse } from '../common/common.utils';
import { COOKIE_CONFIG } from './auth.cookies';
import { AuthCredentials } from './auth.types';

export class AuthController {
	private static ERROR_KIND = 'Auth';
	static async registerUser(
		req: Request<unknown>,
		resp: Response,
	): Promise<void> {
		const user: Partial<User> = req.body;
		try {
			const tokens = await AuthServices.registerUser(user);

			resp.cookie(
				COOKIE_CONFIG['refreshToken'].name,
				tokens.refreshToken,
				COOKIE_CONFIG['refreshToken'].config,
			);
			resp.cookie(
				COOKIE_CONFIG['authToken'].name,
				tokens.authToken,
				COOKIE_CONFIG['authToken'].config,
			);
			resp.sendStatus(200);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
			return;
		}
	}

	static async loginUser(
		req: Request<unknown>,
		resp: Response,
	): Promise<void> {
		const credentials: AuthCredentials = req.body;
		try {
			const tokens = await AuthServices.loginUser(credentials);

			resp.cookie(
				COOKIE_CONFIG['refreshToken'].name,
				tokens.refreshToken,
				COOKIE_CONFIG['refreshToken'].config,
			);
			resp.cookie(
				COOKIE_CONFIG['authToken'].name,
				tokens.authToken,
				COOKIE_CONFIG['authToken'].config,
			);

			resp.sendStatus(200);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
			return;
		}
	}

	static async logoutUser(
		req: Request<unknown>,
		resp: Response,
	): Promise<void> {
		const refreshToken = req.cookies.refreshToken;

		try {
			await AuthServices.logoutUser(refreshToken);

			resp.clearCookie(
				COOKIE_CONFIG['refreshToken'].name,
				COOKIE_CONFIG['refreshToken'].config,
			);
			resp.clearCookie(
				COOKIE_CONFIG['authToken'].name,
				COOKIE_CONFIG['authToken'].config,
			);

			resp.sendStatus(200);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
			return;
		}
	}
}
