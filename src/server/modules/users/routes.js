import { Router } from 'express';

import { all, login, create, change, remove } from './controllers';
import { authLocal, authJwt } from '../../services/auth.service';

const router = new Router();

router.get('/', all);
router.post('/', authJwt, create);
router.put('/:id', authJwt, change);
router.delete('/:id', authJwt, remove);
router.post('/login', authLocal, login);

export default router;
