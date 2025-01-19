import { Request, Response } from 'express';
import { UserServices } from './users.services';
import { isErrorEntry, sendErrorResponse } from '../common/common.utils';
import { AuthServices } from '../auth/auth.services';
import { COOKIE_CONFIG } from '../auth/auth.cookies';

export class UserController {
	private static ERROR_KIND = 'User';
	static async updateUser(req: Request, resp: Response): Promise<void> {}

	static async getCurrentUser(req: Request, resp: Response): Promise<void> {
		const userId = req.userId;
		try {
			const user = await UserServices.getUser(userId);
			resp.status(200).json(user);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
			return;
		}
	}
	static async getUser(req: Request, resp: Response): Promise<void> {
		const userId = req.params.id;
		try {
			const user = await UserServices.getUser(userId);
			resp.status(200).json(user);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
			return;
		}
	}

	static async deleteUser(req: Request, resp: Response): Promise<void> {
		const userId = req.userId;

		try {
			// logout account
			await AuthServices.logoutUser(req.cookies.refreshToken);

			resp.clearCookie(
				COOKIE_CONFIG['authToken'].name,
				COOKIE_CONFIG['authToken'].config,
			);
			resp.clearCookie(
				COOKIE_CONFIG['refreshToken'].name,
				COOKIE_CONFIG['refreshToken'].config,
			);

			// delete user
			await UserServices.deleteUser(userId);

			resp.sendStatus(200);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
		}
	}
}
