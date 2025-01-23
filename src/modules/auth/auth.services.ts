import { COMMON_ERRORS } from '../common/common.errors';
import { isErrorEntry } from '../common/common.utils';
import { User } from '../users/users.entity';
import { AuthRepository } from './auth.repository';
import { AuthCredentials } from './auth.types';

export class AuthServices {
	static async loginUser(credentials: AuthCredentials): Promise<{
		refreshToken: string;
		authToken: string;
	}> {
		try {
			return await AuthRepository.loginUser(credentials);
		} catch (err) {
			if (isErrorEntry(err)) {
				throw err;
			}

			throw COMMON_ERRORS['UNKNOWN_ERROR'];
		}
	}

	static async registerUser(user: Partial<User>): Promise<{
		refreshToken: string;
		authToken: string;
	}> {
		try {
			await AuthRepository.registerUser(user);
			const tokens = await AuthRepository.loginUser({
				email: user.email!,
				password: user.password!,
			});
			return tokens;
		} catch (err) {
			if (isErrorEntry(err)) {
				throw err;
			}

			throw COMMON_ERRORS['UNKNOWN_ERROR'];
		}
	}
	static async checkSessionLogged(user: string | User) {
		try {
			return await AuthRepository.checkSessionLogged(user);
		} catch (err) {
			if (isErrorEntry(err)) {
				throw err;
			}

			throw COMMON_ERRORS['UNKNOWN_ERROR'];
		}
	}

	static async logoutUser(token: string) {
		try {
			const exists = await AuthRepository.logoutUser(token);
			if (exists) {
				throw COMMON_ERRORS['UNKNOWN_ERROR'];
			}
		} catch (err) {
			if (isErrorEntry(err)) {
				throw err;
			}

			throw COMMON_ERRORS['UNKNOWN_ERROR'];
		}
	}
}
