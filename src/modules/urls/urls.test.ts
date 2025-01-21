import { getMockReq, getMockRes } from '@jest-mock/express';
import { User } from '../users/users.entity';
import { Request, Response } from 'express';
import { AppDataSource } from '../../data-source';
import { UserRepository } from '../users/users.repository';
import { UrlRepository } from '../urls/urls.repository';
import { AuthServices } from '../auth/auth.services';
import { AuthController } from '../auth/auth.controller';
import { COOKIE_CONFIG } from '../auth/auth.cookies';
import { AuthRepository } from '../auth/auth.repository';
import { UrlController } from './urls.controller';
import { Url } from './urls.entity';

// jest.mock('./auth.services'); // Mocka AuthServices

describe('AuthController', () => {
	let user: Partial<User>;
	let tokens;
	beforeAll(async () => {
		await AppDataSource.initialize().then(() =>
			console.log('AppDataSource inicializado'),
		);

		user = {
			email: 'apollodaniel@gmail.com',
			password: 'apollodaniel123',
			firstName: 'Apollo',
			lastName: 'Daniel',
		};

		tokens = await AuthServices.registerUser(user);

		user = await UserRepository.findOne({ where: { email: user.email } });
	});

	afterEach(async () => {
		// await UrlRepository.createQueryBuilder().delete().execute();
	});

	afterAll(async () => {
		// await AuthRepository.createQueryBuilder().delete().execute();
		// await UserRepository.createQueryBuilder().delete().execute();
		await AppDataSource.destroy();
	});

	test('Verifica tokens', () => {
		expect(tokens).toBeDefined();
		expect(tokens).toHaveProperty('refreshToken');
		expect(tokens).toHaveProperty('authToken');
	});

	test('Cria uma url', async () => {
		const url: Partial<Url> = {
			originalUrl: 'https://google.com',
			userId: user.id,
		};

		const req = getMockReq({ body: url });
		const { res } = getMockRes();
		await UrlController.addUrl(req, res);

		expect(res.sendStatus).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledTimes(0);

		const createdUrl = await UrlRepository.createQueryBuilder().getOne();

		expect(createdUrl).toBeDefined();
		expect(createdUrl).toHaveProperty('originalUrl');
		expect(createdUrl).toHaveProperty('userId');
		expect(createdUrl).toHaveProperty('id');
		expect(createdUrl).toHaveProperty('creationDate');

		console.log(createdUrl);
	});
});
