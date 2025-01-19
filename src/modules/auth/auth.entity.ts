import { Column, Entity, OneToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Auth {
	@Column({ unique: true })
	token: string;
	@Column({ unique: true })
	@OneToOne((type) => User, (user) => user.id, { onDelete: 'CASCADE' })
	userId: string;
}
