import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { JwtHelper } from '../common/common.jwt';
import { isErrorEntry, sendErrorResponse } from '../common/common.utils';
import { COMMON_ERRORS } from '../common/common.errors';
import { COOKIE_CONFIG } from '../auth/auth.cookies';
import { AuthServices } from '../auth/auth.services';
import { ValidationServices } from './validation.services';
import { AuthErrors } from '../auth/auth.errors';

export class ValidationController {
	private static ERROR_KIND = 'Validation';
	static validate(req: Request, resp: Response, next: NextFunction): void {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			resp.status(400).json({ fieldErrors: result.array() });
			return;
		}

		next();
	}

	static async validateWithAuth(
		req: Request,
		resp: Response,
		next: NextFunction,
	): Promise<void> {
		await new Promise<void>((res) =>
			ValidationController.validate(req, resp, () => res()),
		);

		const tokens = {
			refreshToken: req.cookies.refreshToken,
			authToken: req.cookies.authToken,
		};
		try {
			// verify refresh token
			if (!JwtHelper.isValidRefreshToken(tokens.refreshToken)) {
				// logout user in case it's not valid
				console.log(
					`Invalid refresh token ${tokens.refreshToken}, removing user auth`,
				);
				await AuthServices.logoutUser(tokens.refreshToken);

				resp.clearCookie(
					COOKIE_CONFIG['authToken'].name,
					COOKIE_CONFIG['authToken'].config,
				);
				resp.clearCookie(
					COOKIE_CONFIG['refreshToken'].name,
					COOKIE_CONFIG['refreshToken'].config,
				);
				sendErrorResponse(
					resp,
					AuthErrors['NO_SESSION'],
					ValidationController.ERROR_KIND,
				);
				return;
			}

			const userId = JwtHelper.verifyToken(
				tokens.refreshToken,
				'Refresh',
			);
			req.userId = userId;

			// refresh auth token
			if (!JwtHelper.isValidAuthToken(tokens.authToken)) {
				resp.clearCookie(
					COOKIE_CONFIG['authToken'].name,
					COOKIE_CONFIG['authToken'].config,
				);

				const authToken = JwtHelper.generateAuthToken(
					tokens.refreshToken,
				);
				resp.cookie(
					COOKIE_CONFIG['authToken'].name,
					authToken,
					COOKIE_CONFIG['authToken'].config,
				);
			}

			next();
			return;
		} catch (err: any) {
			console.log('Auth Validation error: ' + err.message);
			sendErrorResponse(resp, err, ValidationController.ERROR_KIND);
			return;
		}
	}
}
