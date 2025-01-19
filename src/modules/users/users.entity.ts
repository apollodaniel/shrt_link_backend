import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	BeforeInsert,
} from 'typeorm';
import { Url } from '../urls/urls.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ unique: true })
	email: string;

	@Column({
		select: false,
	})
	password: string;

	@Column('bigint')
	creationDate: number;

	@OneToMany((type) => Url, (url) => url)
	urls: Url[];

	@BeforeInsert()
	generateCreationDate() {
		this.creationDate = Date.now();
	}
}
