import { User } from './users.entity';
import { AppDataSource } from '../../data-source';
import { In, Repository } from 'typeorm';
import { USER_ERRORS } from './users.errors';

export const UserRepository = () => AppDataSource.getRepository(User).extend({
	async getUser(this: Repository<User>, id: string): Promise<User> {
		return await this.findOneBy({
			id: id
		});
	},
	async getUsers(this: Repository<User>, id: string[]): Promise<User[]> {
		return await this.findBy({
			id: In(id)
		});
	},
	async addUser(this: Repository<User>, user: Partial<User>): Promise<void> {
		await this.save(user);
	},
	async updateUser(this: Repository<User>, id: string, user: Partial<User>) {
		await this.createQueryBuilder("users").whereInIds(id).update(user).execute();
	},
	async deleteUser(this: Repository<User>, id: string) {
		const exists = await this.exists({
			where: {
				id,
			},
		});
		if (!exists) {
			throw USER_ERRORS['USER_NOT_FOUND'];
		}
		await this.delete({ id });
	},
});
