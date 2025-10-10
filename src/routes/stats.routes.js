import express from 'express'
import { statsController } from '~/controllers/stats.controller.js'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { statsValidation } from '~/validations/stats.validation.js'

const Router = express.Router()

// Validation first, then authentication, then controller
Router.get('/', verifyToken, verifyAdmin, statsController.getAllStats)
Router.get('/current', statsController.getCurrentStats)
Router.get('/:date', verifyToken, verifyAdmin, statsController.getStatsByDate)
Router.get('/month/:month/:year', statsValidation.getMonth, statsController.getStatsByMonth)

Router.post('/', verifyToken, verifyAdmin, statsController.createStats)
Router.put('/', statsValidation.updateStats, verifyToken, verifyAdmin, statsController.updateStats)

Router.patch('/visit', statsValidation.countVisit, statsController.countVisit)

export const statsRoute = Router