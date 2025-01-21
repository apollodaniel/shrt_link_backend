import { Request, Response } from 'express';
import { UrlServices } from './urls.services';
import { sendErrorResponse } from '../common/common.utils';
import { Url } from './urls.entity';

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
}
