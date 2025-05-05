import { Request, Response, Router } from 'express';
import auth from './auth/auth.routes';
import user from './users/users.routes';
import url from './urls/urls.routes';
import common from './common/common.routes';

const router = Router();
router.get('/ping', (req: Request, resp: Response) => {
	resp.status(200).send('pong!');
});
router.use(auth);
router.use(user);
router.use(url);
router.use(common);

export default router;
