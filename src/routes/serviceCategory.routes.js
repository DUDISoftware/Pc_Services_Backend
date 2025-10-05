// src/routes/serviceCategory.routes.js
import express from 'express'
import { verifyToken } from '~/middlewares/auth.middleware.js'
import { serviceCategoryController } from '~/controllers/serviceCategory.controller.js'

const router = express.Router()

// Public routes
router.get('/', serviceCategoryController.getAllCategories)
router.get('/search', serviceCategoryController.searchCategories)
router.get('/slug/:slug', serviceCategoryController.getCategoryBySlug)
router.get('/:id', serviceCategoryController.getCategoryById)

// Protected admin routes
router.post('/', verifyToken, serviceCategoryController.createCategory)
router.put('/:id', verifyToken, serviceCategoryController.updateCategory)
router.delete('/:id', verifyToken, serviceCategoryController.deleteCategory)

export const serviceCategoryRoute = router
