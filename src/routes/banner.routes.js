import express from 'express'
import { bannerController } from '~/controllers/banner.controller.js'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { uploadImage } from '~/middlewares/upload.middleware.js'
import { bannerValidation } from '~/validations/banner.validation.js'

const Router = express.Router()

Router.get('/', bannerController.getAllBanners)
Router.post('/',
  // verifyToken, verifyAdmin,
  uploadImage.single('image'),
  bannerValidation.createBanner,
  bannerController.createBanner
)
Router.put('/:id',
  // verifyToken, verifyAdmin,
  uploadImage.single('image'),
  bannerValidation.updateBanner,
  bannerController.updateBanner
)
Router.delete('/:id',
  verifyToken, verifyAdmin,
  bannerValidation.deleteBanner,
  bannerController.deleteBanner
)

export const bannerRoute = Router