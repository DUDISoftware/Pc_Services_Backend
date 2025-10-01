import express from 'express'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { infoController } from '~/controllers/info.controller.js'
import { uploadFile } from '~/middlewares/upload.middleware'

const Router = express.Router()

Router.get('/', infoController.getAll)
Router.post('/', verifyToken, verifyAdmin, uploadFile.fields([
    { name: 'terms', maxCount: 1 },
    { name: 'policy', maxCount: 1 },
  ]),
  infoController.create
);
Router.put('/', verifyToken, verifyAdmin, uploadFile.fields([
  { name: 'terms', maxCount: 1 },
  { name: 'policy', maxCount: 1 },
]), infoController.update);

export const infoRoute = Router