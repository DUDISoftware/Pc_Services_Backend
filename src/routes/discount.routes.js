import express from 'express'
import { discountController } from '~/controllers/discount.controller.js'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { discountValidation } from '~/validations/discount.validation.js'

const Router = express.Router()

// Create
Router.post(
  '/',
  verifyToken,
  verifyAdmin,
  discountValidation.createDiscount,
  discountController.createDiscount
)

// Read
Router.get('/:type', discountController.getAllDiscounts)
Router.get('/:type/all', discountController.getDiscountforAll)
Router.get(
  '/:type/:id',
  discountValidation.getDiscountById,
  discountController.getDiscountById
)

// Update
Router.put(
  '/:type/all',
  verifyToken,
  verifyAdmin,
  discountController.updateDiscountforAll
)
Router.put(
  '/:type/:id',
  verifyToken,
  verifyAdmin,
  discountValidation.updateDiscount,
  discountController.updateDiscount
)

// Delete
Router.delete(
  '/:type/:id',
  verifyToken,
  verifyAdmin,
  discountValidation.deleteDiscount,
  discountController.deleteDiscount
)

export const discountRoute = Router