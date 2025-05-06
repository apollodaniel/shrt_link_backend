import { Router } from 'express';
import { cleanTestEnvironment } from './common.utils';
import { getClientIp } from 'request-ip';

const router = Router();

// clean test environment
router.get('/test/clean', (req,resp)=>{
	const clientIp = getClientIp(req);
	console.log(clientIp);
	const CRON_HOST = process.env.HOST_IP || "127.0.0.1";

	if (clientIp.includes("127.0.0.1") || clientIp.includes("::1") || clientIp.includes(CRON_HOST)) {
		cleanTestEnvironment();
		return resp.sendStatus(200);
	}
	return resp.sendStatus(401);
})

export default router;
