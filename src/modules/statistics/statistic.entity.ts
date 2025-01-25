import {
	BeforeInsert,
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

	@ManyToOne(() => Url, (url) => url.statistics, { onDelete: 'CASCADE' })
	@JoinColumn()
	url: Url;

	@Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
	acessTime: Date;

	@Column()
	ipAddress: string;

	@Column()
	userAgent: string;

	// location things
	@Column()
	country: string;

	@Column()
	countryCode: string;

	@Column()
	region: string;

	@Column()
	city: string;

	@Column('double precision')
	lat: number;

	@Column('double precision')
	lon: number;
}
