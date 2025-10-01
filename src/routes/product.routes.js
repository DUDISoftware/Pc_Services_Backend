import express from 'express'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { uploadImage } from '~/middlewares/upload.middleware.js'
import { productController } from '~/controllers/product.controller.js'
import { productValidation } from '~/validations/product.validation.js'

const Router = express.Router()

// CRUD
Router.post('/', verifyToken, verifyAdmin, uploadImage.array('images'), productValidation.createProduct, productController.createProduct)
Router.put('/:id', verifyToken, verifyAdmin, uploadImage.array('images'), productValidation.updateProduct, productController.updateProduct)
Router.delete('/:id', verifyToken, verifyAdmin, productValidation.deleteProduct, productController.deleteProduct)
Router.patch('/:id/quantity', verifyToken, verifyAdmin, productValidation.updateQuantity, productController.updateQuantity);

// ✅ GET APIs
Router.get('/', productController.getAllProducts) // ?page=1&limit=10
// product.route.js
Router.get('/featured', productController.getFeaturedProducts);
Router.get('/search', productController.searchProducts) // ?query=abc&page=1&limit=10
Router.get('/slug/:slug', productValidation.getProductBySlug, productController.getProductBySlug);
Router.get('/category/:categoryId', productController.getProductsByCategory);
Router.get('/:id', productController.getProductById)
// product.route.js
Router.get('/:id/related', productController.getRelatedProducts);

// Store in Redis
Router.get('/:id/views', productValidation.getProductById, productController.getProductViews);
Router.post('/:id/views', productValidation.getProductById, productController.countViewRedis);


export const productRoute = Router
