import { AppDataSource } from './data-source';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mainRouter from './modules/main';
import { UrlController } from './modules/urls/urls.controller';
import { Middlewares } from './modules/common/common.middlewares';

dotenv.config();

const APP_PORT = process.env.EXPRESS_PORT || 7125;

const app = express();
app.use(
	cors({
		origin: process.env.FRONTEND_ORIGIN,
		credentials: true,
	}),
);
app.use(cookieParser(process.env.COOKIE_ENCRIPTION_KEY));
app.use(express.json());
app.use(Middlewares.logginMiddleware);

app.use('/api/v1/', mainRouter);
app.get('/:id', UrlController.acessUrl);

AppDataSource.initialize()
	.then(async () => {
		console.log('Initialized AppDataSource');
		app.listen(APP_PORT, () => {
			console.log(`Listening on port ${APP_PORT}`);
		});
	})
	.catch((error) => console.log(error));
