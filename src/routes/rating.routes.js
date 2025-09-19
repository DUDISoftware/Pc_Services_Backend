import express from 'express'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { ratingController } from '~/controllers/rating.controller.js'
import { ratingValidation } from '~/validations/rating.validation.js'

const Router = express.Router()

Router.post('/', ratingValidation.createRating, ratingController.createRating)
Router.get('/product/:productId', ratingValidation.getRatingByProduct, ratingController.getRatingByProduct)
Router.get('/service/:id', ratingValidation.getRatingByService, ratingController.getRatingByService)
Router.delete('/:id', verifyToken, verifyAdmin, ratingValidation.deleteRating, ratingController.deleteRating)

export const ratingRoute = Router