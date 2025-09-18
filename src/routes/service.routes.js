import express from 'express'
import { verifyToken } from '~/middlewares/auth.middleware.js'
import { serviceController } from '~/controllers/service.controller'
import { serviceValidation } from '~/validations/service.validation.js'

const Router = express.Router()

// Public routes (không cần token)
Router.get('/', serviceController.getAllServices)
Router.get('/search', serviceController.searchServices)
Router.get('/:id', serviceController.getServiceById)

// Admin routes (cần token)
Router.post('/', verifyToken, serviceValidation.createService, serviceController.createService)
Router.put('/:id', verifyToken, serviceValidation.updateService, serviceController.updateService)
Router.patch('/:id/hide', verifyToken, serviceController.hideService)
Router.delete('/:id', verifyToken, serviceController.deleteService)

export const serviceRoute = Router
