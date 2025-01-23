import { AnyCnameRecord } from 'node:dns';
import { AppDataSource } from '../../data-source';
import { Url } from './urls.entity';
import { Repository } from 'typeorm';
import { isArray } from 'node:util';

export const UrlRepository = AppDataSource.getRepository(Url).extend({
	async getUrl(this: Repository<Url>, urlId: string) {
		return await this.createQueryBuilder().whereInIds(urlId).getOne();
	},
	async getUrls(this: Repository<Url>, query: string[] | string) {
		if (!isArray(query)) {
			// by user id

			return await this.find({
				where: {
					user: {
						id: query,
					},
				},
			});
		}
		// by urls ids
		return await this.createQueryBuilder().whereInIds(query).getMany();
	},
	async addUrl(this: Repository<Url>, url: Partial<Url>) {
		await this.save(url);
	},
	async deleteUrl(this: Repository<Url>, urlId: string) {
		await this.delete(urlId);
	},
});
