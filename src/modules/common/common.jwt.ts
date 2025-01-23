import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class JwtHelper {
	static generateAuthToken(refreshToken: string) {
		return jwt.sign({ refreshToken }, process.env.JWT_AUTHT_KEY, {
			expiresIn: process.env.JWT_AUTHT_EXPIRESIN,
		});
	}
	static generateRefreshToken(email: string) {
		return jwt.sign({ email }, process.env.JWT_AUTHT_KEY, {});
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
				).email;
		}
	}
}
