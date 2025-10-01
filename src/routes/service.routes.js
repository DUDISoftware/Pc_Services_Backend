import express from 'express'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { serviceController } from '~/controllers/service.controller'
import { serviceValidation } from '~/validations/service.validation.js'

const Router = express.Router()

// Public routes (không cần token)
Router.get('/', serviceController.getAllServices)
Router.get('/search', serviceController.searchServices)
Router.get('/:id', serviceController.getServiceById)
Router.get('/slug/:slug', serviceValidation.getServiceBySlug, serviceController.getServiceBySlug)

// Admin routes (cần token)
Router.post('/', verifyToken, verifyAdmin, serviceValidation.createService, serviceController.createService)
Router.put('/:id', verifyToken, serviceValidation.updateService, serviceController.updateService)
Router.patch('/:id/hide', verifyToken, serviceController.hideService)
Router.delete('/:id', verifyToken, serviceController.deleteService)
Router.get('/:id/views', serviceController.getServiceViews)
Router.post('/:id/views', serviceController.countViewRedis)
Router.get('/featured', serviceController.getFeaturedServices)

export const serviceRoute = Router
