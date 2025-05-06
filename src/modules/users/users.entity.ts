import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	OneToOne,
} from 'typeorm';
import { Url } from '../urls/urls.entity';
import { Auth } from '../auth/auth.entity';

@Entity("users")
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

	@Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP'})
	creationDate: Date;

	@OneToMany((type) => Url, (url) => url.user)
	urls: Url[];

	@OneToOne(() => Auth, (auth) => auth.user)
	auth: Auth;
}
