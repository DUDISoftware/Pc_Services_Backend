import express from 'express'

import { userValidation } from '~/validations/user.validation.js'
import { userController } from '~/controllers/user.controller.js'

const Router = express.Router()

Router.post('/login', userValidation.login, userController.login)
Router.post('/register', userValidation.register, userController.register)

export const authRoute = Router