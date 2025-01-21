import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	PrimaryColumn,
	BeforeInsert,
	ManyToOne,
} from 'typeorm';
import { generateUrlId } from './urls.utils';
import { User } from '../users/users.entity';

@Entity()
export class Url {
	@PrimaryColumn({ default: generateUrlId(7) })
	id: string;

	@Column()
	originalUrl: string;

	@Column()
	@ManyToOne((type) => User, (user: User) => user.id, { onDelete: 'CASCADE' })
	userId: string;

	@Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
	creationDate: Date;
}
