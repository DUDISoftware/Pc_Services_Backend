import express from 'express'
import { infoController } from '~/controllers/info.controller.js'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { uploadFile } from '~/middlewares/upload.middleware'

const Router = express.Router()

Router.get('/', infoController.getAll)

Router.post(
  '/',
  verifyToken,
  verifyAdmin,
  uploadFile.fields([
    { name: 'terms', maxCount: 1 },
    { name: 'policy', maxCount: 1 }
  ]),
  infoController.create
)

Router.put(
  '/',
  verifyToken,
  verifyAdmin,
  uploadFile.fields([
    { name: 'terms', maxCount: 1 },
    { name: 'policy', maxCount: 1 }
  ]),
  infoController.update
)

Router.post('/contact', infoController.sendEmail)

export const infoRoute = Router