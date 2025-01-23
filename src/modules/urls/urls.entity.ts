import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	PrimaryColumn,
	BeforeInsert,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { generateUrlId } from './urls.utils';
import { User } from '../users/users.entity';

@Entity()
export class Url {
	@PrimaryColumn()
	id: string;

	@Column()
	originalUrl: string;

	@ManyToOne(() => User, (user: User) => user.urls, {
		onDelete: 'CASCADE',
	})
	user: User;

	@Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
	creationDate: Date;

	@BeforeInsert()
	private beforeInsert() {
		this.id = generateUrlId(7);
	}
}
