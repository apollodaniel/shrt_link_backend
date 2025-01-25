import { In, Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Statistic } from './statistic.entity';

export const StatisticRepository = AppDataSource.getRepository(
	Statistic,
).extend({
	async createStatistic(
		this: Repository<Statistic>,
		statistic: Partial<Statistic>,
	) {
		await this.save(this.create(statistic));
	},
	async getStatistic(
		this: Repository<Statistic>,
		statistic: string | Statistic,
	) {
		const id = typeof statistic == 'string' ? statistic : statistic.id;

		await this.findOne({
			where: {
				id,
			},
			relations: ['url'],
		});
	},
	async getStatistics(this: Repository<Statistic>, query: string | string[]) {
		if (Array.isArray(query)) {
			return await this.find({
				where: {
					id: In(query),
				},
				relations: ['url'],
			});
		}

		return await this.find({
			where: {
				url: {
					id: query,
				},
			},
			relations: ['url'],
		});
	},

	async deleteStatistic(
		this: Repository<Statistic>,
		statistic: string | Statistic,
	) {
		const id = typeof statistic == 'string' ? statistic : statistic.id;

		await this.delete({ id });
	},
});
