import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { Url } from '../urls/urls.entity';

@Entity()
export class Statistic {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Url, (url) => url.statistics)
	@JoinColumn()
	url: Url;

	@Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
	acessTime: Date;

	@Column('string')
	ipAddress: string;

	@Column('string')
	userAgent: string;
}
