import { getMockReq, getMockRes } from '@jest-mock/express';
import { User } from '../src/modules/users/users.entity';
import { AppDataSource } from '../src/data-source';
import { AuthServices } from '../src/modules/auth/auth.services';
import { UserRepository } from '../src/modules/users/users.repository';
import { UrlRepository } from '../src/modules/urls/urls.repository';
import { AuthRepository } from '../src/modules/auth/auth.repository';
import { Url } from '../src/modules/urls/urls.entity';
import { UrlController } from '../src/modules/urls/urls.controller';
import { UrlServices } from '../src/modules/urls/urls.services';
import { Any, Not } from 'typeorm';
import { allowedNodeEnvironmentFlags } from 'process';
import { StatisticRepository } from '../src/modules/statistics/statistic.repository';

describe('UrlController', () => {
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

		createdUrl = await UrlRepository.findOne({
			where: {
				originalUrl: url.originalUrl,
			},
			relations: ['statistics'],
		});

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
			where: { originalUrl: Not(createdUrl.originalUrl) },
			relations: ['statistics'],
		});

		// pega todas as urls
		await UrlController.getUrls(req, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(
			expect.arrayContaining([createdUrl, otherCreatedUrl]),
		);
	});

	test('Deleta uma url', async () => {
		const urlId = createdUrl.id;

		const req = getMockReq({ userId: user.id, params: { id: urlId } });
		const { res } = getMockRes();

		await UrlController.deleteUrl(req, res);

		expect(res.sendStatus).toHaveBeenCalledWith(200);
		expect(res.send).toHaveReturnedTimes(0);
		expect(res.status).toHaveReturnedTimes(0);

		const urls = await UrlRepository.createQueryBuilder().getMany();
		expect(urls).toHaveLength(1);
		expect(urls[0].id).not.toBe(urlId);
	});

	test('acessa uma url', async () => {
		let url = await UrlRepository.findOne({
			where: {},
		});

		const ip = '168.90.79.94';
		const userAgent =
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240 Safari/537.36';
		const req = getMockReq({
			params: { id: url.id },
			connection: {
				remoteAddress: ip,
			},
			headers: {
				'User-Agent': userAgent,
			},
		});
		const { res } = getMockRes();

		await UrlController.acessUrl(req, res);

		expect(res.redirect).toHaveBeenCalledWith(url.originalUrl);
		expect(res.sendStatus).not.toHaveBeenCalled();

		const statistic = await StatisticRepository.findOne({
			where: {
				url: {
					id: url.id,
				},
			},
			relations: ['url'],
		});

		// expect(statistic).toEqual(
		// 	expect.objectContaining({
		// 		url,
		// 		ipAddress: ip,
		// 		userAgent,
		// 	}),
		// );

		console.log(statistic);

		const urlWithStatistic = await UrlRepository.findOne({
			where: {
				id: url.id,
			},
			relations: ['statistics'],
		});

		// expect(urlWithStatistic).toEqual(
		// 	expect.objectContaining({
		// 		...url,
		// 		statistics: expect.arrayContaining([
		// 			expect.objectContaining({
		// 				ipAddress: ip,
		// 				userAgent,
		// 			}),
		// 		]),
		// 	}),
		// );

		console.log(urlWithStatistic);
	});

	test('acessa uma url sem ip e sem useragent', async () => {
		let url = await UrlRepository.findOne({
			where: {},
		});

		const req = getMockReq({
			params: { id: url.id },
		});
		const { res } = getMockRes();

		await UrlController.acessUrl(req, res);

		expect(res.redirect).toHaveBeenCalledWith(url.originalUrl);
		expect(res.sendStatus).not.toHaveBeenCalled();

		const statistic = await StatisticRepository.findOne({
			where: {
				url: {
					id: url.id,
				},
			},
			relations: ['url'],
		});

		console.log(statistic);

		const urlWithStatistic = await UrlRepository.findOne({
			where: {
				id: url.id,
			},
			relations: ['statistics'],
		});

		console.log(urlWithStatistic);
	});

	test('pega url summary', async () => {
		let url = await UrlRepository.findOne({
			where: {},
		});

		const req = getMockReq({
			params: { id: url.id },
		});
		const { res } = getMockRes();

		await UrlController.urlSummary(req, res);
		const summary = await UrlServices.getUrlSummary(url.id);
		expect(res.json).toHaveBeenCalledWith(summary);
		expect(res.sendStatus).not.toHaveBeenCalled();

		console.log(summary);
	});
});
