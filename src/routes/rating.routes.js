import express from 'express'
import { ratingController } from '~/controllers/rating.controller.js'
import { ratingValidation } from '~/validations/rating.validation.js'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'

const Router = express.Router()

// Create a rating
Router.post(
  '/',
  ratingValidation.createRating,
  ratingController.createRating
)

// Get ratings by product
Router.get(
  '/product/:id',
  ratingValidation.getRatingByProduct,
  ratingController.getRatingByProduct
)

// Get ratings by service
Router.get(
  '/service/:id',
  ratingValidation.getRatingByService,
  ratingController.getRatingByService
)

// Delete a rating (admin only)
Router.delete(
  '/:id',
  verifyToken,
  verifyAdmin,
  ratingValidation.deleteRating,
  ratingController.deleteRating
)

export const ratingRoute = Router