
import express from 'express'
import { customerController } from '~/controllers/customer.controller.js'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'

const Router = express.Router()

Router.post('/', customerController.createCustomer)
Router.get('/', verifyToken, customerController.getAllCustomers)
Router.get('/:id', verifyToken, customerController.getCustomerById)
Router.put('/:id', verifyToken, customerController.updateCustomer)
Router.delete('/:id', verifyToken, customerController.deleteCustomer)

export const customerRoute = Router

