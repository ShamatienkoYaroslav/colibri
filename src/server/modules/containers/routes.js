import { Router } from 'express';

import { all, create, change, start, stop, remove, refresh, prune } from './controllers';
import { authJwt } from '../../services/auth.service';

const router = new Router();

router.get('/', authJwt, all);
router.post('/', authJwt, create);
router.get('/refresh', authJwt, refresh);
router.get('/prune', authJwt, prune);
router.put('/:id', authJwt, change);
router.get('/:id/start', authJwt, start);
router.get('/:id/stop', authJwt, stop);
router.delete('/:id', authJwt, remove);

export default router;
