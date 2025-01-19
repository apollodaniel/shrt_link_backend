import { Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { AuthCredentials } from './auth.types';
import { AppDataSource } from '../../data-source';
import { UserRepository } from '../users/users.repository';
import { AuthErrors } from './auth.errors';
import { JwtHelper } from '../common/common.jwt';
import { User } from '../users/users.entity';
import { compare, hash } from 'bcrypt';
import { SALT_ROUNDS } from '../common/common.constants';
import { IRouterHandler } from 'express';

export const AuthRepository = AppDataSource.getRepository(Auth).extend({
	async loginUser(
		this: Repository<Auth>,
		user: AuthCredentials,
	): Promise<{ refreshToken: string; authToken: string }> {
		const result = await UserRepository.createQueryBuilder()
			.where({
				email: user.email,
			})
			.getOne();

		if (!result) {
			// email does'nt exists
			throw AuthErrors['UNKNOWN_EMAIL'];
		}

		// email exists
		try {
			if (await compare(user.password, result.password)) {
				// credentials correct
				const refreshToken = JwtHelper.generateRefreshToken(user.email);
				const authToken = JwtHelper.generateAuthToken(refreshToken);

				return { refreshToken, authToken };
			}
		} catch (e) {
			// ignore catch statement to match all two cases of being an error either a false
			console.log(
				'Unable to compare encrypted and decrypted passwords, error: ' +
					e.message,
			);
		}

		throw AuthErrors['INCORRECT_PASSWORD'];
	},
	async registerUser(
		this: Repository<Auth>,
		user: Partial<User>,
	): IRouterHandler {
		const emailExists = await UserRepository.exists({
			where: {
				email: user.email,
			},
		});

		if (emailExists) {
			throw AuthErrors['EMAIL_ALREADY_EXISTS'];
		}

		try {
			const userPassword = await hash(user.password, SALT_ROUNDS);
			const parsedUser = {
				...user,
				password: userPassword,
			};

			await UserRepository.save(parsedUser);
		} catch (e) {
			console.log('Unable to encrypt password, error: ' + e.message);
			throw AuthErrors['PASSWORD_ENCRYPTION'];
		}
	},
	async checkSessionLogged(
		this: Repository<Auth>,
		user: string | User,
	): Promise<boolean> {
		const userId = typeof user == 'string' ? user : user.id;

		return await this.exists({
			where: {
				userId,
			},
		});
	},
	async logoutUser(this: Repository<Auth>, token: string) {
		await this.createQueryBuilder().where({ token }).delete().execute();

		return await this.exists({ where: { token } });
	},
});
