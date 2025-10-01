import express from 'express'

import { userValidation } from '~/validations/user.validation.js'
import { userController } from '~/controllers/user.controller.js'

const Router = express.Router()

Router.post('/login', userValidation.login, userController.login)
Router.post('/register', userValidation.register, userController.register)
Router.get('/send-email', userValidation.sendEmail, userController.sendEmail)
Router.post('/send-otp', userValidation.sendOTP, userController.sendOTP)
Router.post('/verify-email', userValidation.verifyEmail, userController.verifyEmail)

export const authRoute = Router