import { Url } from './urls.entity';
import { URL_ERRORS } from './urls.errors';
import { UrlRepository } from './urls.repository';
import { Statistic } from '../statistics/statistic.entity';
import { StatisticRepository } from '../statistics/statistic.repository';
import { IPLocation } from '../statistics/statistic.type';
import axios from 'axios';

export class UrlServices {
	static async getUrl(urlId: string): Promise<Url> {
		await this.checkUrlExists(urlId);
		return await UrlRepository.getUrl(urlId);
	}
	static async getUrls(userId: string): Promise<Url[]> {
		return await UrlRepository.getUrls(userId);
	}
	static async addUrl(url: Partial<Url>) {
		return await UrlRepository.addUrl(url);
	}
	static async deleteUrl(urlId: string) {
		await this.checkUrlExists(urlId);
		return await UrlRepository.deleteUrl(urlId);
	}

	private static async checkUrlExists(urlId: string) {
		const exists = await UrlRepository.exists({ where: { id: urlId } });

		if (!exists) {
			throw URL_ERRORS['URL_NOT_FOUND'];
		}
	}

	static async checkUrlValidOwner(userId: string, urlId: string) {
		const url = await UrlRepository.createQueryBuilder('url')
			.leftJoinAndSelect('url.user', 'user')
			.getOne();
		if (url.user.id != userId) {
			throw URL_ERRORS['NO_PERMISSION'];
		}
	}

	static async acessUrl(urlId: string, statistic: Partial<Statistic>) {
		await this.checkUrlExists(urlId);
		const url = await UrlRepository.getUrl(urlId, false);

		try {
			const response = await axios.get(
				`http://ip-api.com/json/${statistic.ipAddress}`,
			);

			if (response.status == 200) {
				const location: IPLocation = response.data;

				await StatisticRepository.createStatistic({
					...statistic,
					url,
					country: location.country,
					countryCode: location.countryCode,
					region: location.region,
					lat: location.lat,
					lon: location.lon,
					city: location.city,
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
}
