import { User } from '../src/modules/users/users.entity';
import { AppDataSource } from '../src/data-source';
import { UserRepository } from '../src/modules/users/users.repository';
import { Url } from '../src/modules/urls/urls.entity';
import { cleanTestEnvironment } from '../src/modules/common/common.utils';
import { UrlRepository } from '../src/modules/urls/urls.repository';
import { Statistic } from '../src/modules/statistics/statistic.entity';
import { StatisticRepository } from '../src/modules/statistics/statistic.repository';
import {UrlController} from "../src/modules/urls/urls.controller"
import {getMockReq, getMockRes} from "@jest-mock/express"
import dotenv from "dotenv";

dotenv.config();

/*
casos:
- [x] usuario sem url e sem estatistica criado a mais de 10 minutos -> delete
- [x] usuario sem url e sem estatistica criado a menos de 10 minutos -> nao delete
- [x] usuario com url criado a mais de 15 minutos -> deleta
- [x] usuario com url criado a menos de 15 minutos -> nao deleta
- [x] usuario com statistic criado a mais de 5 minutos -> deleta
- [x] usuario com statistic criado a menos de 5 minutos -> nao deleta
*/

async function getOldDate(minutes: number): Promise<Date> {
	let date = new Date(Date.now());
	date.setMinutes(date.getMinutes() - minutes - 1);

	return date;
}

describe('Test environment clean endpoint check', () => {
	const userTemplate: Partial<User> = {
		email: 'apollodaniel@gmail.com',
		password: 'apollodaniel123',
		firstName: 'Apollo',
		lastName: 'Daniel',
	};
	const urlTemplate: Partial<Url> = {
		originalUrl: "https://google.com",
	};
	const statisticTemplate: Partial<Statistic> = {
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
	};

	beforeAll(async () => {
		await AppDataSource.initialize().then(() =>
			console.log('AppDataSource inicializado'),
		);
		await UserRepository().createQueryBuilder().delete().execute();
	});

	beforeEach(async () => {
		await UserRepository().createQueryBuilder().where('users.email = :email', {email: userTemplate.email!}).delete().execute();
	});
	afterEach(async () => {
		await UserRepository().createQueryBuilder().where('users.email = :email', {email: userTemplate.email!}).delete().execute();
	});

	afterAll(async ()=>{
		await AppDataSource.destroy();
	})

	test('usuario sem url e sem estatistica criado a menos de 10 minutos', async () => {
		await UserRepository().save({
			...userTemplate,
			creationDate: new Date(Date.now())
		})

		const isUserCreated = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		})

		expect(isUserCreated).toBeTruthy();

		await cleanTestEnvironment();

		const isUserExist = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		})

		expect(isUserExist).toBeTruthy();
	});

	test('usuario sem url e sem estatistica criado a mais de 10 minutos', async () => {
		await UserRepository().addUser({
			...userTemplate,
			creationDate: await getOldDate(10)
		})

		const isUserCreated = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		expect(isUserCreated).toBeTruthy();

		await cleanTestEnvironment();

		const isUserExist = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		// user must be deleted
		expect(isUserExist).toBeFalsy();
	});


	test('usuario com url criado a menos de 15 minutos', async () => {
		await UserRepository().addUser({
			...userTemplate,
			creationDate: new Date(Date.now()),
		})

		const createdUser = await UserRepository().findOne({
			where: {
				email: userTemplate.email
			}
		});

		expect(createdUser).toBeDefined();
		expect(createdUser).not.toBeNull();

		await UrlRepository().addUrl({
			...urlTemplate,
			user: createdUser!
		});

		const isUrlCreated = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		expect(isUrlCreated).toBeTruthy();

		await cleanTestEnvironment();

		const isUserExist = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		expect(isUserExist).toBeTruthy();
	});

	test('usuario com url criado a mais de 15 minutos', async () => {
		// check if it deletes with 10 minutes -> to be false
		await UserRepository().addUser({
			...userTemplate,
			creationDate: await getOldDate(10),
		})

		const createdUser = await UserRepository().findOne({
			where: {
				email: userTemplate.email
			}
		});

		expect(createdUser).toBeDefined();
		expect(createdUser).not.toBeNull();

		await UrlRepository().addUrl({
			...urlTemplate,
			user: createdUser!
		});

		const isUrlCreated = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		expect(isUrlCreated).toBeTruthy();

		await cleanTestEnvironment();

		const isUserExist = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		expect(isUserExist).toBeTruthy();  // user with 10 minutes must still exists, because the active user has 15 minutes of test

		const newDate = await getOldDate(15);
		await UserRepository().updateUser(createdUser!.id, {
			creationDate: newDate
		})

		const updatedUser = await UserRepository().findOneBy({
			email: userTemplate.email
		});

		expect(updatedUser).toBeDefined();
		expect(updatedUser).not.toBeNull();
		expect(updatedUser!.creationDate.getTime()).toBe(newDate.getTime());

		await cleanTestEnvironment();

		const isUpdatedUserExist = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		expect(isUpdatedUserExist).toBeFalsy();  // user with 15 minutes must not exist
	});

	test('usuario com statistic criado a menos de 5 minutos', async () => {
		await UserRepository().addUser({
			...userTemplate,
			creationDate: new Date(Date.now()),
		})

		const createdUser = await UserRepository().findOne({
			where: {
				email: userTemplate.email
			}
		});

		// verifica se usuario existe sendo criado agora
		expect(createdUser).toBeDefined();
		expect(createdUser).not.toBeNull();

		await UrlRepository().addUrl({
			...urlTemplate,
			user: createdUser!
		});

		const createdUrl = await UrlRepository().findOne({
			where: {
				user: {
					id: createdUser!.id
				}
			}
		});

		// verifica se a url foi criada com sucesso
		expect(createdUrl).toBeDefined();
		expect(createdUrl).not.toBeNull();

		// verify statistic
		const createdStatistic = await StatisticRepository().save(StatisticRepository().create({
			...statisticTemplate,
			url: createdUrl!
		}));

		const isStatisticExists = await StatisticRepository().exists({
			where: {
				id: createdStatistic.id
			}
		});

		// verifica se statistica foi criada com sucesso
		expect(isStatisticExists).toBeTruthy();

		await cleanTestEnvironment();

		const isUserExist = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		// verifica se o usuario ainda existe
		expect(isUserExist).toBeTruthy();

	});

	test('usuario com statistic criado a mais de 5 minutos', async () => {
		// check if it deletes with 10 minutes -> to be false
		await UserRepository().addUser({
			...userTemplate,
			creationDate: new Date(Date.now()),
		})

		const createdUser = await UserRepository().findOne({
			where: {
				email: userTemplate.email
			}
		});

		expect(createdUser).toBeDefined();
		expect(createdUser).not.toBeNull();

		await UrlRepository().addUrl({
			...urlTemplate,
			user: createdUser!
		});

		const createdUrl = await UrlRepository().findOne({
			where: {
				user: {
					id: createdUser!.id
				}
			}
		});

		// verifica se a url foi criada com sucesso
		expect(createdUrl).toBeDefined();
		expect(createdUrl).not.toBeNull();

		// verify statistic
		const createdStatistic = await StatisticRepository().save(StatisticRepository().create({
			...statisticTemplate,
			url: createdUrl!,
			accessTime: await getOldDate(5)
		}));

		const isStatisticExists = await StatisticRepository().exists({
			where: {
				id: createdStatistic.id
			}
		});

		// verifica se statistica foi criada com sucesso
		expect(isStatisticExists).toBeTruthy();

		await cleanTestEnvironment();

		const isUserExist = await UserRepository().exists({
			where: {
				email: userTemplate.email
			}
		});

		// verifica se o usuario ainda existe
		expect(isUserExist).toBeFalsy();
	});

	test('check test environment ip', async()=>{
		if ( process.env.TEST_ENVIRONMENT ){
			if (process.env.TEST_IP) {
				expect(typeof process.env.TEST_IP).toBe("string")
			}

			await UserRepository().addUser({
				...userTemplate,
				creationDate: new Date(Date.now()),
			})

			const createdUser = await UserRepository().findOne({
				where: {
					email: userTemplate.email
				}
			});

			expect(createdUser).toBeDefined();
			expect(createdUser).not.toBeNull();

			await UrlRepository().addUrl({
				...urlTemplate,
				user: createdUser!
			});

			const createdUrl = await UrlRepository().findOne({
				where: {
					user: {
						id: createdUser!.id
					}
				}
			});

			// verifica se a url foi criada com sucesso
			expect(createdUrl).toBeDefined();
			expect(createdUrl).not.toBeNull();

			const req = getMockReq({
				params: {
					id: createdUrl!.id
				},
				headers: {
				'user-agent': 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
			}});
			const {res} = getMockRes();
			await UrlController.acessUrl(req,res);

			expect(res.redirect).toHaveBeenCalledWith(createdUrl!.originalUrl);

			const statistic = await StatisticRepository().createQueryBuilder().getOne();

			expect(statistic).toBeDefined()
			if (process.env.TEST_IP)
				expect(statistic!.ipAddress).toBe(process.env.TEST_IP)
			else
				expect(statistic!.ipAddress).toBe('')

			console.log(statistic)
		}
	})
});
