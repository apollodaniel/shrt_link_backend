import { getMockReq, getMockRes } from '@jest-mock/express';
import { User } from '../users/users.entity';
import { AuthController } from './auth.controller';
import { Request, Response } from 'express';
import { AuthServices } from './auth.services';
import { AppDataSource } from '../../data-source';
import { UserRepository } from '../users/users.repository';
import { AuthRepository } from './auth.repository';
import { UrlRepository } from '../urls/urls.repository';
import { COOKIE_CONFIG } from './auth.cookies';

// jest.mock('./auth.services'); // Mocka AuthServices

describe('AuthController', () => {
	beforeAll(async () => {
		await AppDataSource.initialize().then(() =>
			console.log('AppDataSource inicializado'),
		);
	});

	afterEach(async () => {
		await UserRepository.createQueryBuilder().delete().execute();
		await AuthRepository.createQueryBuilder().delete().execute();
	});
	afterAll(async () => {
		await AppDataSource.destroy();
	});

	test.skip('deve registrar o usuario e retornar os tokens', async () => {
		const user: Partial<User> = {
			email: 'apollodaniel@gmail.com',
			password: 'apollodaniel123',
			firstName: 'Apollo',
			lastName: 'Daniel',
		};

		const tokens = await AuthServices.registerUser(user);

		expect(tokens).toBeDefined();
		expect(tokens).toHaveProperty('refreshToken');
		expect(tokens).toHaveProperty('authToken');
	});

	test('Deve registrar o usuário e configurar cookies', async () => {
		const user: Partial<User> = {
			email: 'apollodaniel@gmail.com',
			password: 'apollodaniel123',
			firstName: 'Apollo',
			lastName: 'Daniel',
		};
		const req = getMockReq({ body: user });
		const { res } = getMockRes();

		await AuthController.registerUser(req, res);

		// check if it's working and not returning any error
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledTimes(0);
		expect(res.cookie).toHaveBeenCalledTimes(2);

		// check if cookies are being sent correctly
		expect(res.cookie).toHaveBeenCalledWith(
			COOKIE_CONFIG['refreshToken'].name,
			expect.anything(),
			expect.objectContaining(COOKIE_CONFIG['refreshToken'].config),
		);
		expect(res.cookie).toHaveBeenCalledWith(
			COOKIE_CONFIG['authToken'].name,
			expect.anything(),
			expect.objectContaining(COOKIE_CONFIG['authToken'].config),
		);
	});

	test('Deve registrar o usuário, deslogar, e logar novamente', async () => {
		const user: Partial<User> = {
			email: 'apollodaniel@gmail.com',
			password: 'apollodaniel123',
			firstName: 'Apollo',
			lastName: 'Daniel',
		};
		let req = getMockReq({ body: user });
		const { res } = getMockRes();

		await AuthController.registerUser(req, res);
		await AuthController.logoutUser(req, res);

		req = getMockReq({
			body: {
				email: 'apollodaniel@gmail.com',
				password: 'apollodaniel123',
			},
		});

		await AuthController.loginUser(req, res);

		// check if it's working and not returning any error
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledTimes(0);
		expect(res.clearCookie).toHaveBeenCalledTimes(2);
		expect(res.cookie).toHaveBeenCalledTimes(2);

		// check if cookies are being sent correctly
		expect(res.cookie).toHaveBeenCalledWith(
			COOKIE_CONFIG['refreshToken'].name,
			expect.anything(),
			expect.objectContaining(COOKIE_CONFIG['refreshToken'].config),
		);
		expect(res.cookie).toHaveBeenCalledWith(
			COOKIE_CONFIG['authToken'].name,
			expect.anything(),
			expect.objectContaining(COOKIE_CONFIG['authToken'].config),
		);
	});
});
