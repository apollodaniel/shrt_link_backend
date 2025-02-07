import { getMockReq, getMockRes } from '@jest-mock/express';
import { AppDataSource } from '../src/data-source';
import { UserRepository } from '../src/modules/users/users.repository';
import { AuthRepository } from '../src/modules/auth/auth.repository';
import { User } from '../src/modules/users/users.entity';
import { AuthServices } from '../src/modules/auth/auth.services';
import { AuthController } from '../src/modules/auth/auth.controller';
import { COOKIE_CONFIG } from '../src/modules/auth/auth.cookies';

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

	test('deve registrar o usuario e retornar os tokens', async () => {
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
		expect(res.sendStatus).toHaveBeenCalledWith(200);
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
		const tokens = await AuthServices.registerUser(user);
		expect(tokens).toBeDefined();
		expect(tokens).toHaveProperty('refreshToken');
		expect(tokens).toHaveProperty('authToken');

		let logoutReq = getMockReq({ cookies: tokens });
		let loginReq = getMockReq({
			body: {
				email: 'apollodaniel@gmail.com',
				password: 'apollodaniel123',
			},
		});

		const { res: loginRes } = getMockRes();
		const { res: logoutRes } = getMockRes();

		await AuthController.logoutUser(logoutReq, logoutRes);
		expect(logoutRes.sendStatus).toHaveBeenCalledWith(200);
		expect(logoutRes.clearCookie).toHaveBeenCalledTimes(2);
		expect(logoutRes.send).toHaveBeenCalledTimes(0);

		await AuthController.loginUser(loginReq, loginRes);
		expect(loginRes.sendStatus).toHaveBeenCalledWith(200);
		expect(loginRes.cookie).toHaveBeenCalledTimes(2);
		expect(loginRes.send).toHaveBeenCalledTimes(0);

		// check if cookies are being sent correctly
		expect(loginRes.cookie).toHaveBeenCalledWith(
			COOKIE_CONFIG['refreshToken'].name,
			expect.anything(),
			expect.objectContaining(COOKIE_CONFIG['refreshToken'].config),
		);
		expect(loginRes.cookie).toHaveBeenCalledWith(
			COOKIE_CONFIG['authToken'].name,
			expect.anything(),
			expect.objectContaining(COOKIE_CONFIG['authToken'].config),
		);
	});
});
