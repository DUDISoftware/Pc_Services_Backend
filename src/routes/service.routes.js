import express from 'express'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { uploadImage } from '~/middlewares/upload.middleware.js'
import { serviceController } from '~/controllers/service.controller'
import { serviceValidation } from '~/validations/service.validation.js'

const Router = express.Router()

// Public routes (no token required)
Router.get('/', serviceController.getAllServices)
Router.get('/search', serviceController.searchServices)
Router.get('/featured', serviceController.getFeaturedServices)
Router.get('/slug/:slug', serviceValidation.getServiceBySlug, serviceController.getServiceBySlug)
Router.get('/:id', serviceValidation.getServiceById, serviceController.getServiceById)
Router.get('/:id/views', serviceController.getServiceViews)

// Admin routes (token required)
Router.post('/', verifyToken, verifyAdmin, uploadImage.array('images'), serviceValidation.createService, serviceController.createService)
Router.put('/:id', verifyToken, uploadImage.array('images'), serviceValidation.updateService, serviceController.updateService)
Router.patch('/:id/hide', verifyToken, serviceController.hideService)
Router.delete('/:id', verifyToken, serviceController.deleteService)
Router.post('/:id/views', serviceController.countViewRedis)

export const serviceRoute = Router
