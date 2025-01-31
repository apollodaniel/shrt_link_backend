import { Request, Response } from 'express';
import { UrlServices } from './urls.services';
import { isErrorEntry, sendErrorResponse } from '../common/common.utils';
import { Url } from './urls.entity';
import { URL_ERRORS } from './urls.errors';
import { Statistic } from '../statistics/statistic.entity';
import { getClientIp } from 'request-ip';
import { UrlRepository } from './urls.repository';

export class UrlController {
	private static ERROR_KIND = 'Url';

	static async getUrl(req: Request, resp: Response) {
		const urlId = req.params.id;

		try {
			await UrlServices.checkUrlValidOwner(req.userId, urlId);
			const url = await UrlServices.getUrl(urlId);
			resp.status(200).json(url);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
		}
	}

	static async getUrls(req: Request, resp: Response) {
		const userId = req.userId;

		try {
			const urls = await UrlServices.getUrls(userId);
			resp.status(200).json(urls);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
		}
	}
	static async addUrl(req: Request, resp: Response) {
		const url: Partial<Url> = req.body;

		try {
			await UrlServices.addUrl(url);
			resp.sendStatus(200);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
		}
	}
	static async deleteUrl(req: Request, resp: Response) {
		const urlId = req.params.id;

		try {
			await UrlServices.checkUrlValidOwner(req.userId, urlId);
			await UrlServices.deleteUrl(urlId);
			resp.sendStatus(200);
			return;
		} catch (err: any) {
			sendErrorResponse(resp, err, this.ERROR_KIND);
		}
	}
	static async acessUrl(req: Request, resp: Response) {
		const urlId = req.params.id;
		const clientIp = getClientIp(req);
		try {
			console.log(clientIp);
			const statistic: Partial<Statistic> = {
				ipAddress: clientIp,
				userAgent: Array.isArray(req.headers['User-Agent'])
					? req.headers['User-Agent'][0]
					: req.headers['User-Agent'],
			};
			const url = await UrlServices.acessUrl(urlId, statistic);

			resp.redirect(url.originalUrl);
			return;
		} catch (err: any) {
			console.debug('Error while trying to acess url: ', err.message);
			if (err == URL_ERRORS['URL_NOT_FOUND']) {
				resp.sendStatus(404);
				return;
			}
			resp.sendStatus(500);
			return;
		}
	}

	static async urlSummary(req: Request, resp: Response) {
		const urlId = req.params.id;
		try {
			const summary = await UrlServices.getUrlSummary(urlId);
			console.log(summary);

			resp.json(summary);
			return;
		} catch (err: any) {
			console.log('Could not get url summary: ' + err.message);
			if (isErrorEntry(err)) {
				sendErrorResponse(resp, err, this.ERROR_KIND);
				return;
			}
			sendErrorResponse(
				resp,
				URL_ERRORS['UNKNOWN_ERROR'],
				this.ERROR_KIND,
			);
			return;
		}
	}
	static async generalUrlSummary(req: Request, resp: Response) {
		try {
			const summary = await UrlServices.getGeneralSummary(req.userId);
			console.log(summary);

			resp.json(summary);
			return;
		} catch (err: any) {
			console.log('Could not get url summary: ' + err);
			if (isErrorEntry(err)) {
				sendErrorResponse(resp, err, this.ERROR_KIND);
				return;
			}
			sendErrorResponse(
				resp,
				URL_ERRORS['UNKNOWN_ERROR'],
				this.ERROR_KIND,
			);
			return;
		}
	}
}
