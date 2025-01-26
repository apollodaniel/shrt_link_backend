import { Router } from 'express';
import auth from './auth/auth.routes';
import user from './users/users.routes';
import url from './urls/urls.routes';

const router = Router();

router.use(auth);
router.use(user);
router.use(url);

export default router;
