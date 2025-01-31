import { In, Repository } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { Statistic } from './statistic.entity';
import { UrlServices } from '../urls/urls.services';
import { UrlRepository } from '../urls/urls.repository';
import { UrlGeneralSummary, UrlSummary } from './statistic.type';

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

	async getStatisticSummary(
		this: Repository<Statistic>,
		urlId: string,
	): Promise<UrlSummary> {
		const url = await UrlRepository.getUrl(urlId, false);
		const [
			countByCountry,
			countByDevice,
			countByBrowser,
			countByDay,
			countByTimeOfDay,
			totalClicks,
		] = await Promise.all([
			this.createQueryBuilder('statistic')
				.select('statistic.country', 'country')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.where({ url: { id: urlId } })
				.groupBy('statistic.country')
				.getRawMany(),
			this.createQueryBuilder('statistic')
				.select('statistic.device', 'device')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.where({ url: { id: urlId } })
				.groupBy('statistic.device')
				.getRawMany(),
			this.createQueryBuilder('statistic')
				.select('statistic.browser', 'browser')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.where({ url: { id: urlId } })
				.groupBy('statistic.browser')
				.getRawMany(),
			this.createQueryBuilder('statistic')
				.select('DATE(statistic.accessTime)', 'day') // Extract the date from accessTime
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.where({ url: { id: urlId } }) // Filter by URL ID (if applicable)
				.groupBy('day') // Group by the extracted date
				.orderBy('day', 'ASC') // Optionally, order by day in ascending order
				.getRawMany(),
			this.createQueryBuilder('statistic')
				.select('EXTRACT(HOUR FROM statistic.accessTime)', 'hour') // Use EXTRACT to get the hour
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.where({ url: { id: urlId } }) // Optional filter
				.groupBy('hour') // Group by the extracted hour
				.orderBy('hour', 'ASC') // Order by hour in ascending order
				.getRawMany(),
			this.count({
				where: {
					url: {
						id: urlId,
					},
				},
			}),
		]);
		return {
			url,
			countByCountry,
			countByDevice,
			countByBrowser,
			countByDay,
			countByTimeOfDay,
			totalClicks,
		};
	},
	async getGeneralStatisticSummary(
		this: Repository<Statistic>,
		userId: string,
	): Promise<UrlGeneralSummary> {
		const [
			countByCountry,
			countByDevice,
			countByBrowser,
			countByDay,
			countByTimeOfDay,
			totalClicks,
			countByUrlId,
		] = await Promise.all([
			// Count by country
			this.createQueryBuilder('statistic')
				.select('statistic.country', 'country')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.leftJoin('statistic.url', 'url')
				.leftJoin('url.user', 'user')
				.where('user.id = :userId', { userId })
				.groupBy('statistic.country')
				.getRawMany(),
			// Count by device
			this.createQueryBuilder('statistic')
				.select('statistic.device', 'device')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.leftJoin('statistic.url', 'url')
				.leftJoin('url.user', 'user')
				.where('user.id = :userId', { userId })
				.groupBy('statistic.device')
				.getRawMany(),
			// Count by browser
			this.createQueryBuilder('statistic')
				.select('statistic.browser', 'browser')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.leftJoin('statistic.url', 'url')
				.leftJoin('url.user', 'user')
				.where('user.id = :userId', { userId })
				.groupBy('statistic.browser')
				.getRawMany(),
			// Count by day
			this.createQueryBuilder('statistic')
				.select('DATE(statistic.accessTime)', 'day')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.leftJoin('statistic.url', 'url')
				.leftJoin('url.user', 'user')
				.where('user.id = :userId', { userId })
				.groupBy('day')
				.orderBy('day', 'ASC')
				.getRawMany(),
			// Count by time of day
			this.createQueryBuilder('statistic')
				.select('EXTRACT(HOUR FROM statistic.accessTime)', 'hour')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.leftJoin('statistic.url', 'url')
				.leftJoin('url.user', 'user')
				.where('user.id = :userId', { userId })
				.groupBy('hour')
				.orderBy('hour', 'ASC')
				.getRawMany(),
			// Total clicks
			this.count({
				where: {
					url: {
						user: {
							id: userId,
						},
					},
				},
			}),
			// Count by URL ID
			this.createQueryBuilder('statistic')
				.select('statistic.urlId', 'urlId')
				.addSelect('COUNT(statistic.id)::int', 'count') // Cast to int
				.leftJoin('statistic.url', 'url')
				.leftJoin('url.user', 'user')
				.where('user.id = :userId', { userId })
				.groupBy('statistic.urlId')
				.getRawMany(),
		]);
		return {
			countByCountry,
			countByDevice,
			countByBrowser,
			countByDay,
			countByTimeOfDay,
			totalClicks,
			countByUrlId,
		};
	},
});
