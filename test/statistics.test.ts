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
import { StatisticRepository } from '../src/modules/statistics/statistic.repository';

describe('Statistics', () => {
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

	let createdUrls: Url[] = [];

	test('Cria múltiplas URLs e estatísticas', async () => {
		// Create multiple URLs for the user
		const urlsToCreate = [
			{ originalUrl: 'https://google.com' },
			{ originalUrl: 'https://facebook.com' },
			{ originalUrl: 'https://youtube.com' },
			{ originalUrl: 'https://github.com' },
			{ originalUrl: 'https://twitter.com' },
		];

		for (const urlData of urlsToCreate) {
			const url = UrlRepository.create({
				originalUrl: urlData.originalUrl,
				user: user,
			});

			const req = getMockReq({ body: url });
			const { res } = getMockRes();
			await UrlController.addUrl(req, res);

			expect(res.sendStatus).toHaveBeenCalledWith(200);

			const createdUrl = await UrlRepository.findOne({
				where: { originalUrl: url.originalUrl },
				relations: ['statistics'],
			});

			expect(createdUrl).toBeDefined();
			createdUrls.push(createdUrl);
		}

		// Add statistics (access logs) for each URL
		const statisticsData = [
			{
				ipAddress: '192.168.1.1',
				userAgent:
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				country: 'United States',
				countryCode: 'US',
				region: 'California',
				city: 'Los Angeles',
				lat: 34.0522,
				lon: -118.2437,
				device: 'Desktop',
				browser: 'Chrome',
			},
			{
				ipAddress: '192.168.1.2',
				userAgent:
					'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
				country: 'Canada',
				countryCode: 'CA',
				region: 'Ontario',
				city: 'Toronto',
				lat: 43.6532,
				lon: -79.3832,
				device: 'Mobile',
				browser: 'Safari',
			},
			{
				ipAddress: '192.168.1.3',
				userAgent:
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
				country: 'Germany',
				countryCode: 'DE',
				region: 'Berlin',
				city: 'Berlin',
				lat: 52.52,
				lon: 13.405,
				device: 'Desktop',
				browser: 'Firefox',
			},
			{
				ipAddress: '192.168.1.4',
				userAgent:
					'Mozilla/5.0 (Linux; Android 11; SM-A515F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
				country: 'Brazil',
				countryCode: 'BR',
				region: 'São Paulo',
				city: 'São Paulo',
				lat: -23.5505,
				lon: -46.6333,
				device: 'Mobile',
				browser: 'Chrome',
			},
			{
				ipAddress: '192.168.1.5',
				userAgent:
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
				country: 'Australia',
				countryCode: 'AU',
				region: 'New South Wales',
				city: 'Sydney',
				lat: -33.8688,
				lon: 151.2093,
				device: 'Desktop',
				browser: 'Safari',
			},
			{
				ipAddress: '192.168.1.6',
				userAgent:
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
				country: 'United Kingdom',
				countryCode: 'GB',
				region: 'England',
				city: 'London',
				lat: 51.5074,
				lon: -0.1278,
				device: 'Desktop',
				browser: 'Edge',
			},
			{
				ipAddress: '192.168.1.7',
				userAgent:
					'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
				country: 'France',
				countryCode: 'FR',
				region: 'Île-de-France',
				city: 'Paris',
				lat: 48.8566,
				lon: 2.3522,
				device: 'Mobile',
				browser: 'Chrome',
			},
			{
				ipAddress: '192.168.1.8',
				userAgent:
					'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
				country: 'Japan',
				countryCode: 'JP',
				region: 'Tokyo',
				city: 'Tokyo',
				lat: 35.6895,
				lon: 139.6917,
				device: 'Tablet',
				browser: 'Safari',
			},
			{
				ipAddress: '192.168.1.9',
				userAgent:
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
				country: 'India',
				countryCode: 'IN',
				region: 'Maharashtra',
				city: 'Mumbai',
				lat: 19.076,
				lon: 72.8777,
				device: 'Desktop',
				browser: 'Chrome',
			},
			{
				ipAddress: '192.168.1.10',
				userAgent:
					'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
				country: 'South Africa',
				countryCode: 'ZA',
				region: 'Gauteng',
				city: 'Johannesburg',
				lat: -26.2041,
				lon: 28.0473,
				device: 'Mobile',
				browser: 'Chrome',
			},
		];
		for (const statData of statisticsData) {
			const statistic = StatisticRepository.create({
				...statData,
				url: createdUrls[
					Math.floor(Math.random() * createdUrls.length)
				], // Randomly assign to a URL
			});
			await StatisticRepository.save(statistic);
		}
	});

	test('Pega o resumo geral das URLs', async () => {
		const req = getMockReq({ userId: user.id });
		const { res } = getMockRes();

		await UrlController.generalUrlSummary(req, res);
		const summary = await UrlServices.getGeneralSummary(user.id);

		expect(res.json).toHaveBeenCalledWith(summary);
		expect(res.sendStatus).not.toHaveBeenCalled();

		console.log(summary);

		// Validate the summary
		expect(summary).toHaveProperty('countByCountry');
		expect(summary).toHaveProperty('countByDevice');
		expect(summary).toHaveProperty('countByBrowser');
		expect(summary).toHaveProperty('countByDay');
		expect(summary).toHaveProperty('countByTimeOfDay');
		expect(summary).toHaveProperty('totalClicks');
		expect(summary).toHaveProperty('countByUrlId');

		// Example assertions for countByCountry
		expect(summary.countByCountry).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					country: 'United States',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'Canada',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'Germany',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'Brazil',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'Australia',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'United Kingdom',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'France',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'Japan',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'India',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					country: 'South Africa',
					count: expect.any(Number),
				}),
			]),
		);

		// Example assertions for countByDevice
		expect(summary.countByDevice).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					device: 'Desktop',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					device: 'Mobile',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					device: 'Tablet',
					count: expect.any(Number),
				}),
			]),
		);

		// Example assertions for countByBrowser
		expect(summary.countByBrowser).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					browser: 'Chrome',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					browser: 'Safari',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					browser: 'Firefox',
					count: expect.any(Number),
				}),
				expect.objectContaining({
					browser: 'Edge',
					count: expect.any(Number),
				}),
			]),
		);
	});
});
