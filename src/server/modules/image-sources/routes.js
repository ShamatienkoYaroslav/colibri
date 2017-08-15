import { Router } from 'express';

import { all, one, create, change, remove } from './controllers';
import { authJwt } from '../../services/auth.service';

const router = new Router();

router.get('/', authJwt, all);
router.post('/', authJwt, create);
router.get('/:id', authJwt, one);
router.put('/:id', authJwt, change);
router.delete('/:id', authJwt, remove);

export default router;
