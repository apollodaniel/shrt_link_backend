import { getMockReq, getMockRes } from '@jest-mock/express';
import { AppDataSource } from '../../data-source';
import { AuthRepository } from '../auth/auth.repository';
import { UserRepository } from './users.repository';
import { User } from './users.entity';
import { AuthServices } from '../auth/auth.services';
import { COOKIE_CONFIG } from '../auth/auth.cookies';
import { AuthController } from '../auth/auth.controller';
import { UserController } from './users.controller';
import { JwtHelper } from '../common/common.jwt';

describe('user', () => {
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

	test('testa UserController.deleteUser', async () => {
		const user: Partial<User> = {
			email: 'apollodaniel@gmail.com',
			password: 'apollodaniel123',
			firstName: 'Apollo',
			lastName: 'Daniel',
		};
		const req = getMockReq({ body: user });
		const { res } = getMockRes();

		const tokens = await AuthServices.registerUser(user);

		expect(tokens).toBeDefined();
		expect(tokens).toHaveProperty('refreshToken');
		expect(tokens).toHaveProperty('authToken');

		req.userId = (
			await AuthRepository.findOne({
				where: { token: tokens.refreshToken },
				relations: ['user'],
			})
		).user.id;

		req.cookies = {
			...req.cookies,
			...tokens,
		};

		expect(
			await UserRepository.createQueryBuilder().getMany(),
		).toHaveLength(1);
		expect(
			await AuthRepository.createQueryBuilder().getMany(),
		).toHaveLength(1);

		await UserController.deleteUser(req, res);

		expect(res.status).toHaveBeenCalledTimes(0);
		expect(res.clearCookie).toHaveBeenCalledTimes(2);
		expect(res.sendStatus).toHaveBeenCalled();

		expect(
			await UserRepository.createQueryBuilder().getMany(),
		).toHaveLength(0);
		expect(
			await AuthRepository.createQueryBuilder().getMany(),
		).toHaveLength(0);

		console.log('Logged out and deleted user');
	});

	test('testa UserController.getCurrentUser', async () => {
		const user: Partial<User> = {
			email: 'apollodaniel@gmail.com',
			password: 'apollodaniel123',
			firstName: 'Apollo',
			lastName: 'Daniel',
		};
		const req = getMockReq({ body: user });
		const { res } = getMockRes();

		const tokens = await AuthServices.registerUser(user);

		expect(tokens).toBeDefined();
		expect(tokens).toHaveProperty('refreshToken');
		expect(tokens).toHaveProperty('authToken');

		req.userId = (
			await AuthRepository.findOne({
				where: { token: tokens.refreshToken },
				relations: ['user'],
			})
		).user.id;

		req.cookies = {
			...req.cookies,
			...tokens,
		};

		expect(
			await UserRepository.createQueryBuilder().getMany(),
		).toHaveLength(1);
		expect(
			await AuthRepository.createQueryBuilder().getMany(),
		).toHaveLength(1);

		await UserController.getCurrentUser(req, res);

		const createdUser = await UserRepository.findOne({
			where: { email: user.email },
		});

		expect(res.status).toHaveBeenCalled();
		expect(res.json).toHaveBeenCalledWith({
			id: req.userId,
			email: user.email,
			lastName: user.lastName,
			firstName: user.firstName,
			creationDate: createdUser.creationDate,
		});
		expect(res.send).toHaveBeenCalledTimes(0);

		console.log('Logged out and deleted user');
	});

	test('testa UserController.getUser ', async () => {
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

		const req = getMockReq({
			params: {
				id: (
					await AuthRepository.findOne({
						where: { token: tokens.refreshToken },
						relations: ['user'],
					})
				).user.id,
			},
		});
		const { res } = getMockRes();

		console.log(req.params.id);

		req.cookies = {
			...req.cookies,
			...tokens,
		};

		expect(
			await UserRepository.createQueryBuilder().getMany(),
		).toHaveLength(1);
		expect(
			await AuthRepository.createQueryBuilder().getMany(),
		).toHaveLength(1);

		await UserController.getUser(req, res);

		const createdUser = await UserRepository.findOne({
			where: { email: user.email },
		});

		expect(res.status).toHaveBeenCalled();
		expect(res.json).toHaveBeenCalledWith({
			id: req.params.id,
			email: user.email,
			lastName: user.lastName,
			firstName: user.firstName,
			creationDate: createdUser.creationDate,
		});
		expect(res.send).toHaveBeenCalledTimes(0);

		console.log('Logged out and deleted user');
	});
});
