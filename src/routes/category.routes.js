import express from 'express'
import { categoryController } from '~/controllers/category.controller'
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { categoryValidation } from '~/validations/category.validation'

const Router = express.Router()

// CRUD
Router.post('/', verifyToken, verifyAdmin, categoryValidation.createCategory, categoryController.createCategory)
Router.get('/', categoryController.getCategories)
Router.get('/search', categoryController.searchCategories)
Router.get('/:id', categoryValidation.getCategoryById, categoryController.getCategoryById)
Router.put('/:id', verifyToken, verifyAdmin, categoryValidation.updateCategory, categoryController.updateCategory)
Router.delete('/:id', verifyToken, verifyAdmin, categoryValidation.deleteCategory, categoryController.deleteCategory)

export const categoryRoute = Router
