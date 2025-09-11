import express from 'express'
import { verifyToken } from '~/middlewares/auth.middleware.js'
import { serviceController } from '~/controllers/service.controller'
import { serviceValidation } from '~/validations/service.validation'

const Router = express.Router()

// CRUD + xem chi tiết
Router.post('/', verifyToken, serviceValidation.createService, serviceController.createService)
Router.get('/', verifyToken, serviceController.getAllServices)
Router.get('/:id', verifyToken, serviceController.getServiceById)
Router.put('/:id', verifyToken, serviceValidation.updateService, serviceController.updateService)
Router.patch('/:id/hide', verifyToken, serviceController.hideService)
Router.delete('/:id', verifyToken, serviceController.deleteService)

export const serviceRoute = Router
