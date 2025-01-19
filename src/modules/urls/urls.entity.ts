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
	@PrimaryColumn()
	id: string;

	@Column()
	originalUrl: string;

	@Column()
	@ManyToOne((type) => User, (user: User) => user.id, { onDelete: 'CASCADE' })
	userId: string;

	@Column('bigint')
	creationDate: number;

	@BeforeInsert()
	generateUrlId() {
		this.id = generateUrlId(7);
	}

	@BeforeInsert()
	generateCreationDate() {
		this.creationDate = Date.now();
	}
}
