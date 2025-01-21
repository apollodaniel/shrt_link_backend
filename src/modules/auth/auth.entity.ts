import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Auth {
	@PrimaryColumn({ unique: true })
	token: string;
	@Column({ unique: true })
	@OneToOne((type) => User, (user) => user.id, { onDelete: 'CASCADE' })
	userId: string;
}
