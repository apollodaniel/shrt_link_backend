import { Url } from './urls.entity';
import { URL_ERRORS } from './urls.errors';
import { UrlRepository } from './urls.repository';
import { Statistic } from '../statistics/statistic.entity';
import { StatisticRepository } from '../statistics/statistic.repository';
import { IPLocation } from '../statistics/statistic.type';
import axios from 'axios';
import UAParser from 'ua-parser-js';
import { UserRepository } from '../users/users.repository';

export class UrlServices {
	static async getUrl(urlId: string): Promise<Url> {
		await UrlServices.checkUrlExists(urlId);
		return await UrlRepository.getUrl(urlId);
	}
	static async getUrls(userId: string): Promise<Url[]> {
		return await UrlRepository.getUrls(userId);
	}
	static async addUrl(url: Partial<Url>, userId: string) {
		const user = await UserRepository.findOne({ where: { id: userId } });
		return await UrlRepository.addUrl({
			...url,
			user,
		});
	}
	static async deleteUrl(urlId: string) {
		await UrlServices.checkUrlExists(urlId);
		return await UrlRepository.deleteUrl(urlId);
	}

	private static async checkUrlExists(urlId: string) {
		const exists = await UrlRepository.exists({ where: { id: urlId } });

		if (!exists) {
			throw URL_ERRORS['URL_NOT_FOUND'];
		}
	}

	static async checkUrlValidOwner(userId: string, urlId: string) {
		const url = await UrlRepository.findOne({
			where: { id: urlId },
			relations: ['user'],
		});
		if (url.user.id != userId) {
			throw URL_ERRORS['NO_PERMISSION'];
		}
	}

	static async acessUrl(urlId: string, statistic: Partial<Statistic>) {
		await UrlServices.checkUrlExists(urlId);
		const url = await UrlRepository.getUrl(urlId, false);

		try {
			let ipAddress = '';
			const privateIpMatch = statistic.ipAddress.match(
				/(^::ffff:127\.)|(^::ffff:10\.)|(^::ffff:172\.1[6-9]\.)|(^::ffff:172\.2[0-9]\.)|(^::ffff:172\.3[0-1]\.)|(^::ffff:192\.168\.)|(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.)|(::[0-9])/,
			);
			if (!privateIpMatch) {
				ipAddress = statistic.ipAddress;
			}
			const response = await axios.get(
				`http://ip-api.com/json/${ipAddress}`,
			);

			if (response.status == 200) {
				const location: IPLocation = response.data;
				const parsedUa = UAParser.UAParser(statistic.userAgent);
				const device = parsedUa.os.name;
				const browser = parsedUa.browser.name;

				await StatisticRepository.createStatistic({
					...statistic,
					url,
					country: location.country,
					countryCode: location.countryCode,
					region: location.region,
					lat: location.lat,
					lon: location.lon,
					city: location.city,
					device,
					browser,
				});
			}
		} catch (err: any) {
			console.debug(
				'Error while trying to get location for statistic',
				err.message,
			);
		}
		return url;
	}

	static async getUrlSummary(urlId: string) {
		await UrlServices.checkUrlExists(urlId);

		return await StatisticRepository.getStatisticSummary(urlId);
	}
	static async getGeneralSummary(userId: string) {
		return await StatisticRepository.getGeneralStatisticSummary(userId);
	}
}
