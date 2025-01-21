import { User } from './users.entity';
import { UserRepository } from './users.repository';

export class UserServices {
	static async updateUser(
		user: string | User,
		updatedFields: { firstName?: string; lastName?: string },
	) {
		const userId = typeof user == 'string' ? user : user.id;
		if (updatedFields.lastName || updatedFields.firstName) {
			await UserRepository.updateUser(userId, updatedFields);
		}
	}
	static async getUser(user: string | User) {
		const userId = typeof user == 'string' ? user : user.id;
		return await UserRepository.getUser(userId);
	}
	static async deleteUser(user: string | User) {
		const userId = typeof user == 'string' ? user : user.id;
		await UserRepository.deleteUser(userId);
	}
}
