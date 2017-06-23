import { Router } from 'express';

import { login, create, change } from './controllers';
import { authLocal } from '../../services/auth.service';

const router = new Router();

router.post('/', create);
router.put('/:id', change);
router.post('/login', authLocal, login);

export default router;
