import { AppDataSource } from '../../data-source';
import { Url } from './urls.entity';
import { In, Repository } from 'typeorm';

export const UrlRepository = AppDataSource.getRepository(Url).extend({
	async getUrl(this: Repository<Url>, urlId: string, isJoin?: boolean) {
		if (typeof isJoin == 'undefined') isJoin = true;
		return await this.findOne({
			where: { id: urlId },
			relations: isJoin ? ['statistics'] : [],
		});
	},
	async getUrls(
		this: Repository<Url>,
		query: string[] | string,
		isJoin?: boolean,
	) {
		if (typeof isJoin == 'undefined') isJoin = true;
		if (!Array.isArray(query)) {
			// by user id

			return await this.find({
				where: {
					user: {
						id: query,
					},
				},
				relations: isJoin ? ['statistics'] : [],
			});
		}
		// by urls ids
		return await this.find({
			where: {
				id: In(query),
			},
			relations: isJoin ? ['statistics'] : [],
		});
	},
	async addUrl(this: Repository<Url>, url: Partial<Url>) {
		await this.save(url);
	},
	async deleteUrl(this: Repository<Url>, urlId: string) {
		await this.delete(urlId);
	},
});
