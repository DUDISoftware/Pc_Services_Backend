import express from 'express';
import { statsController } from '~/controllers/stats.controller.js';
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js';
import { statsValidation } from '~/validations/stats.validation.js';

const Router = express.Router();

Router.get('/month/:month/:year', statsValidation.getMonth, verifyToken, verifyAdmin, statsController.getByMonth);
Router.get('/:date', verifyToken, verifyAdmin, statsController.getStats);
Router.get('/', verifyToken, verifyAdmin, statsController.getAll);

Router.post('/', verifyToken, verifyAdmin, statsController.createStats);
Router.put('/', verifyToken, verifyAdmin, statsValidation.updateStats, statsController.updateStats);
Router.patch('/visit', statsValidation.countVisit, statsController.countVisit);

export const statsRoute = Router;