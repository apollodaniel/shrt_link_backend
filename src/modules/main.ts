import { Router } from 'express';
import auth from './auth/auth.routes';
import user from './users/users.routes';

const router = Router();

router.use(auth);
router.use(user);

export default router;
