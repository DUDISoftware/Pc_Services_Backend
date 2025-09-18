// src/routes/serviceCategory.routes.js
import express from 'express';
import { verifyToken } from '~/middlewares/auth.middleware.js';
import { serviceCategoryController } from '~/controllers/serviceCategory.controller.js'

const Router = express.Router();

// Public
Router.get('/', serviceCategoryController.getAllCategories);
Router.get('/search', serviceCategoryController.searchCategories);
Router.get('/:id', serviceCategoryController.getCategoryById);

// Admin
Router.post('/', verifyToken, serviceCategoryController.createCategory);
Router.put('/:id', verifyToken, serviceCategoryController.updateCategory);
Router.delete('/:id', verifyToken, serviceCategoryController.deleteCategory);

export const serviceCategoryRoute = Router;
