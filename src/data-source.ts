import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './modules/users/users.entity';
import { Auth } from './modules/auth/auth.entity';
import { Url } from './modules/urls/urls.entity';

dotenv.config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT || 5432),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	synchronize: true,
	logging: false,
	entities: [User, Auth, Url],
	migrations: [],
	subscribers: [],
});
