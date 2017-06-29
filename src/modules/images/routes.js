import { Router } from 'express';

import { all, create, change, remove, info, pull, refresh } from './controllers';
import { authJwt } from '../../services/auth.service';

const router = new Router();

router.get('/', authJwt, all);
router.post('/', authJwt, create);
router.get('/refresh', authJwt, refresh);
router.put('/:id', authJwt, change);
router.delete('/:id', authJwt, remove);
router.get('/:id', authJwt, info);
router.get('/:id/pull', authJwt, pull);

export default router;
