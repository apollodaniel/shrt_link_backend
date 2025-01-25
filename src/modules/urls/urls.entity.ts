import {
	Entity,
	Column,
	PrimaryColumn,
	BeforeInsert,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { generateUrlId } from './urls.utils';
import { User } from '../users/users.entity';
import { Statistic } from '../statistics/statistic.entity';

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

	@OneToMany(() => Statistic, (statistic) => statistic.url, {
		onDelete: 'CASCADE',
	})
	statistics: Statistic[];

	@Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
	creationDate: Date;

	@BeforeInsert()
	private beforeInsert() {
		this.id = generateUrlId(7);
	}
}
