import express from 'express'

import { userValidation } from '~/validations/user.validation.js'
import { userController } from '~/controllers/user.controller.js'

import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'

const Router = express.Router()

Router.get('/', verifyToken, verifyAdmin, userController.getAllUsers)
Router.put('/:id', verifyToken, verifyAdmin, userValidation.updateUser, userController.updateUser)
Router.get('/:id', verifyToken, verifyAdmin, userValidation.deleteUser, userController.getUserById)
Router.delete('/:id', verifyToken, verifyAdmin, userValidation.deleteUser, userController.deleteUser)

export const userRoute = Router