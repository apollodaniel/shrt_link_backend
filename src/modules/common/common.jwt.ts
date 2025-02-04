import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class JwtHelper {
	static generateAuthToken(refreshToken: string) {
		return jwt.sign({ refreshToken }, process.env.JWT_AUTHT_KEY, {
			expiresIn: Number(process.env.JWT_AUTHT_EXPIRESIN || 1800),
		});
	}
	static generateRefreshToken(userId: string) {
		return jwt.sign({ userId }, process.env.JWT_REFRESHT_KEY, {});
	}
	static verifyToken(token: string, type: 'Auth' | 'Refresh'): any {
		switch (type) {
			case 'Auth':
				return (
					jwt.verify(
						token,
						process.env.JWT_AUTHT_KEY,
						{},
					) as JwtPayload
				).refreshToken;
			case 'Refresh':
				return (
					jwt.verify(
						token,
						process.env.JWT_REFRESHT_KEY,
						{},
					) as JwtPayload
				).userId;
		}
	}
	static isValidAuthToken(token: string, refreshToken?: string): boolean {
		try {
			const authTokenResult = (
				jwt.verify(token, process.env.JWT_AUTHT_KEY, {}) as JwtPayload
			).refreshToken;

			if (refreshToken) {
				return authTokenResult == refreshToken;
			}
			return true;
		} catch (err: any) {
			return false;
		}
	}

	static isValidRefreshToken(token: string, userId?: string): boolean {
		try {
			const refreshTokenResult = (
				jwt.verify(
					token,
					process.env.JWT_REFRESHT_KEY,
					{},
				) as JwtPayload
			).userId;

			if (userId) {
				return refreshTokenResult == userId;
			}
			return true;
		} catch (err: any) {
			return false;
		}
	}
}
