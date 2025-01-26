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

export const AuthRepository = AppDataSource.getRepository(Auth).extend({
	async loginUser(
		this: Repository<Auth>,
		user: AuthCredentials,
	): Promise<{ refreshToken: string; authToken: string }> {
		const result = await UserRepository.createQueryBuilder('user')
			.addSelect('user.password') // This includes the password in the result
			.where({
				email: user.email,
			})
			.getOne();

		if (!result) {
			// email does'nt exists
			throw AuthErrors['UNKNOWN_EMAIL'];
		}

		// email exists
		let isPasswordMatch;
		try {
			isPasswordMatch = await compare(user.password, result.password);
		} catch (e) {
			// ignore catch statement to match all two cases of being an error either a false
			console.log(
				'Unable to compare encrypted and decrypted passwords, error: ' +
					e.message,
			);
		}
		if (isPasswordMatch) {
			// credentials correct
			const refreshToken = JwtHelper.generateRefreshToken(result.id);
			const authToken = JwtHelper.generateAuthToken(refreshToken);

			const auth = this.create({ user: result, token: refreshToken });
			await this.save(auth);

			return { refreshToken, authToken };
		}

		throw AuthErrors['INCORRECT_PASSWORD'];
	},
	async registerUser(this: Repository<Auth>, user: Partial<User>) {
		const emailExists = await UserRepository.exists({
			where: {
				email: user.email,
			},
		});

		if (emailExists) {
			throw AuthErrors['EMAIL_ALREADY_EXISTS'];
		}
		let userPassword;
		try {
			userPassword = await hash(user.password, SALT_ROUNDS);
		} catch (e) {
			console.log('Unable to encrypt password, error: ' + e.message);
			throw AuthErrors['PASSWORD_ENCRYPTION'];
		}

		const parsedUser = {
			...user,
			password: userPassword,
		};

		await UserRepository.save(parsedUser);
	},
	async checkSessionLogged(
		this: Repository<Auth>,
		user: string | User,
	): Promise<boolean> {
		const userId = typeof user == 'string' ? user : user.id;

		return await this.exists({
			where: {
				user: {
					id: userId,
				},
			},
		});
	},
	async logoutUser(this: Repository<Auth>, token: string) {
		await this.createQueryBuilder().where({ token }).delete().execute();

		return await this.exists({ where: { token } });
	},
});
