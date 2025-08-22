import express from 'express'

import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'

import { serviceController } from '~/controllers/service.controller'
import { serviceValidation } from '~/validations/service.validation'

const Router = express.Router()

Router.post('/', verifyToken, serviceValidation.createService, serviceController.createService)
Router.put('/:id', verifyToken, serviceValidation.updateService, serviceController.updateService)
Router.patch('/:id', verifyToken, serviceValidation.hideService, serviceController.hideService)

export const serviceRoute = Router
