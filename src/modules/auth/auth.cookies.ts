import { CookieOptions } from 'express';

export const COOKIE_CONFIG: Record<
	string,
	{ name: string; config: CookieOptions }
> = {
	refreshToken: {
		name: 'refreshToken',
		config: {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
		},
	},
	authToken: {
		name: 'authToken',
		config: {
			maxAge: 30 * 60 * 1000, // 30 days
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
		},
	},
};
