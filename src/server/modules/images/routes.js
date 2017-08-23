import { Router } from 'express';

import { all, one, create, change, remove, info, pull, loadImage, refresh, prune, download } from './controllers';
import { authJwt } from '../../services/auth.service';
import { upload } from '../../utils';

const uploadFile = (req, res, next) => {
  upload(req, res, (e) => {
    if (e) {
      res.status(400).json(e.toString());
    }
    next();
  });
};

const router = new Router();

router.get('/', authJwt, all);
router.post('/', authJwt, create);
router.get('/refresh', authJwt, refresh);
router.get('/prune', authJwt, prune);
router.post('/upload', authJwt, uploadFile, loadImage);
router.get('/:id', authJwt, one);
router.put('/:id', authJwt, change);
router.delete('/:id', authJwt, remove);
router.get('/:id/info', authJwt, info);
router.get('/:id/pull', authJwt, pull);
router.get('/:id/download', authJwt, download);

export default router;
