import { getMockReq, getMockRes } from '@jest-mock/express';
import { AppDataSource } from '../src/data-source';
import { AuthRepository } from '../src/modules/auth/auth.repository';
import { AuthServices } from '../src/modules/auth/auth.services';
import { UrlRepository } from '../src/modules/urls/urls.repository';
import { User } from '../src/modules/users/users.entity';
import { UserRepository } from '../src/modules/users/users.repository';
import { ValidationController } from '../src/modules/validation/validation.controller';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

describe('ValidationController', () => {
	let user: User;
	let tokens;
	beforeAll(async () => {
		await AppDataSource.initialize().then(() =>
			console.log('AppDataSource inicializado'),
		);

		const userRegister = {
			email: 'apollodaniel@gmail.com',
			password: 'apollodaniel123',
			firstName: 'Apollo',
			lastName: 'Daniel',
		};

		tokens = await AuthServices.registerUser(userRegister);

		user = await UserRepository.findOne({
			where: { email: userRegister.email },
		});
		dotenv.config();
	});

	afterAll(async () => {
		await UrlRepository.createQueryBuilder().delete().execute();
		await AuthRepository.createQueryBuilder().delete().execute();
		await UserRepository.createQueryBuilder().delete().execute();
		await AppDataSource.destroy();
	});

	test('Verifica validation auth', async () => {
		expect(tokens).toBeDefined();
		expect(tokens).toHaveProperty('refreshToken');
		expect(tokens).toHaveProperty('authToken');

		const req = getMockReq({ cookies: tokens });
		const { res } = getMockRes();
		const next = jest.fn();

		expect(req.cookies).toBeDefined();
		expect(req.cookies).toHaveProperty('refreshToken');
		expect(req.cookies).toHaveProperty('authToken');

		await ValidationController.validateWithAuth(req, res, next);

		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
		expect(res.send).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});

	test('Verifica expiração do auth token', async () => {
		const _tokens = {
			...tokens,
			authToken: jwt.sign(
				{ refreshToken: tokens.refreshToken },
				process.env.JWT_AUTHT_KEY,
				{
					expiresIn: '0s',
				},
			),
		};

		expect(_tokens).toBeDefined();
		expect(_tokens).toHaveProperty('refreshToken');
		expect(_tokens).toHaveProperty('authToken');

		const req = getMockReq({ cookies: _tokens });
		const { res } = getMockRes();
		const next = jest.fn();

		expect(req.cookies).toBeDefined();
		expect(req.cookies).toHaveProperty('refreshToken');
		expect(req.cookies).toHaveProperty('authToken');

		await ValidationController.validateWithAuth(req, res, next);

		expect(res.cookie).toHaveBeenCalled();
		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
		expect(res.send).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});

	test('Verifica refreshToken invalido', async () => {
		const _tokens = {
			...tokens,
			refreshToken: 'apollo',
		};

		await AuthRepository.createQueryBuilder()
			.where({
				token: tokens.refreshToken,
			})
			.update({
				token: _tokens.refreshToken,
			})
			.execute();

		expect(_tokens).toBeDefined();
		expect(_tokens).toHaveProperty('refreshToken');
		expect(_tokens).toHaveProperty('authToken');

		const req = getMockReq({ cookies: _tokens });
		const { res } = getMockRes();
		const next = jest.fn();

		expect(req.cookies).toBeDefined();
		expect(req.cookies).toHaveProperty('refreshToken');
		expect(req.cookies).toHaveProperty('authToken');

		await ValidationController.validateWithAuth(req, res, next);

		expect(res.clearCookie).toHaveBeenCalledTimes(2);
		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalled();

		const isSessionExists = await AuthRepository.checkSessionLogged(
			user.id,
		);

		expect(isSessionExists).toEqual(false);
	});
});
