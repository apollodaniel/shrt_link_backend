import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { JwtHelper } from './common.jwt';

export class Middlewares {
	static validationMiddleware(
		req: Request,
		resp: Response,
		next: NextFunction,
	): void {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			resp.status(400).json({ fieldErrors: result.array() });
			return;
		}

		next();
	}

	static authValidationMiddleware(
		req: Request,
		resp: Response,
		next: NextFunction,
	): void {
		const tokens = {
			refreshToken: req.cookies.refreshToken,
			authToken: req.cookies.authToken,
		};
		try {
			const authPayload = JwtHelper.verifyToken(tokens.authToken, 'Auth');

			if (authPayload != tokens.refreshToken) {
			}
		} catch (err: any) {
			resp.status(400);
		}
	}
}
