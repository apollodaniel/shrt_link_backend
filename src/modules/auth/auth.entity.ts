import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Auth {
	@PrimaryColumn({ unique: true })
	token: string;
	@ManyToOne((type) => User, (user) => user.id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	userId: string;
}
