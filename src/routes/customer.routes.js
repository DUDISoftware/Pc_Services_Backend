import express from 'express'
import { customerController } from '~/controllers/customer.controller.js'

const Router = express.Router()

Router.get('/', customerController.getAll)

Router.post('/', customerController.create)

export const customerRoute = Router
