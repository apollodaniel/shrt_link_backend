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

	@OneToOne(() => User, (user) => user.auth, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' }) // This sets the foreign key column
	user: User;
}
