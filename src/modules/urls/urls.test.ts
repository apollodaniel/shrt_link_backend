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
import { create } from 'domain';
import { UrlServices } from './urls.services';

// jest.mock('./auth.services'); // Mocka AuthServices

describe('AuthController', () => {
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
	});

	afterAll(async () => {
		await UrlRepository.createQueryBuilder().delete().execute();
		await AuthRepository.createQueryBuilder().delete().execute();
		await UserRepository.createQueryBuilder().delete().execute();
		await AppDataSource.destroy();
	});

	let createdUrl: Url;
	test('Verifica tokens', () => {
		expect(tokens).toBeDefined();
		expect(tokens).toHaveProperty('refreshToken');
		expect(tokens).toHaveProperty('authToken');
	});

	test('Cria uma url', async () => {
		const url = UrlRepository.create({
			originalUrl: 'https://google.com',
			user: user,
		});

		const req = getMockReq({ body: url });
		const { res } = getMockRes();
		await UrlController.addUrl(req, res);

		expect(res.sendStatus).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledTimes(0);

		createdUrl = await UrlRepository.createQueryBuilder().getOne();

		expect(createdUrl).toBeDefined();
		expect(createdUrl).toHaveProperty('originalUrl');
		expect(createdUrl).toHaveProperty('id');
		expect(createdUrl).toHaveProperty('creationDate');

		console.log(createdUrl);
	});

	test('Pega os dados de uma url', async () => {
		const urlId = createdUrl.id;

		const req = getMockReq({ params: { id: urlId } });
		const { res } = getMockRes();

		console.log(req.params);
		req.userId = user.id;

		await UrlController.getUrl(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(createdUrl);
	});

	test('Pega todas as urls de um usuario', async () => {
		const req = getMockReq();
		const { res } = getMockRes();

		req.userId = user.id;

		// cria nova url
		const url: Partial<Url> = UrlRepository.create({
			originalUrl: 'https://facebook.com',
			user: user,
		});

		await UrlServices.addUrl(url);

		const otherCreatedUrl = await UrlRepository.findOne({
			where: { originalUrl: url.originalUrl },
		});

		// pega todas as urls
		await UrlController.getUrls(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith([createdUrl, otherCreatedUrl]);
	});
});
