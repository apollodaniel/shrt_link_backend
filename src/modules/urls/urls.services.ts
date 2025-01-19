import { Url } from './urls.entity';
import { URL_ERRORS } from './urls.errors';
import { UrlRepository } from './urls.repository';

export class UrlServices {
	static async getUrl(urlId: string): Promise<Url> {
		await this.checkUrlExists(urlId);
		return await UrlRepository.getUrl(urlId);
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
		const isValidOwner = await UrlRepository.exists({
			where: {
				id: urlId,
				userId,
			},
		});
		if (!isValidOwner) {
			throw URL_ERRORS['NO_PERMISSION'];
		}
	}
}
