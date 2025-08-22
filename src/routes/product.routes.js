import express from 'express'

import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'

import { uploadImage } from '~/middlewares/upload.middleware.js'

import { productController } from '~/controllers/product.controller.js'
import { productValidation } from '~/validations/product.validation.js'
const Router = express.Router()

Router.post('/', verifyToken, verifyAdmin, uploadImage.array('images'), productValidation.createProduct, productController.createProduct)
Router.put('/:id', verifyToken, verifyAdmin, uploadImage.array('images'), productValidation.updateProduct, productController.updateProduct)
Router.delete('/:id', verifyToken, verifyAdmin, productValidation.deleteProduct, productController.deleteProduct)

export const productRoute = Router
