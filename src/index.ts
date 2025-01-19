import { AppDataSource } from './data-source';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mainRouter from './modules/main';

dotenv.config();

const APP_PORT = process.env.EXPRESS_PORT || 7125;

const app = express();
app.use(cors({ origin: '*' }));
app.use(cookieParser(process.env.COOKIE_ENCRIPTION_KEY));
app.use(express.json());
app.use('/api/v1/', mainRouter);

AppDataSource.initialize()
	.then(async () => {
		console.log('Initialized AppDataSource');
		app.listen(APP_PORT, () => {
			console.log(`Listening on port ${APP_PORT}`);
		});
	})
	.catch((error) => console.log(error));
