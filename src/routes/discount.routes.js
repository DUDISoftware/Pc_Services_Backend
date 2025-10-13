import express from 'express'
import { discountController } from '~/controllers/discount.controller.js'

const Router = express.Router()

Router.put('/:productId', discountController.updateDiscount)

Router.get('/:productId', discountController.getDiscountById)

    
export const discountRoute = Router
