import { AuthRepository } from '../auth/auth.repository';
import { JwtHelper } from '../common/common.jwt';

export class ValidationServices {
	static async checkSessionMatch(userId: string, token: string) {
		return await AuthRepository.exists({
			where: {
				token,
				user: {
					id: userId,
				},
			},
		});
	}
}
