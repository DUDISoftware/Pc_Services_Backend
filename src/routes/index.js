import express from 'express'
import { authRoute } from './auth.routes.js'
import { bannerRoute } from './banner.routes.js'
import { productRoute } from './product.routes.js'
import { categoryRoute } from './category.routes.js'
import { userRoute } from './user.routes.js'
import { serviceRoute } from './service.routes.js'
import { serviceCategoryRoute } from './serviceCategory.routes.js'
import { requestRoute } from './request.routes.js'
import { ratingRoute } from './rating.routes.js'
import { statsRoute } from './stats.routes.js'
import { infoRoute } from './info.routes.js'
import { customerRoute } from './customer.routes.js'

import { discountRoute } from './discount.routes.js'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(200).json({ message: 'API is running' })
})

Router.use('/auth', authRoute)
Router.use('/users', userRoute)
Router.use('/banners', bannerRoute)
Router.use('/products', productRoute)
Router.use('/categories', categoryRoute)
Router.use('/services', serviceRoute)
Router.use('/service-categories', serviceCategoryRoute)
Router.use('/requests', requestRoute)
Router.use('/ratings', ratingRoute)
Router.use('/stats', statsRoute)
Router.use('/info', infoRoute)
Router.use('/customers', customerRoute)

Router.use('/discounts', discountRoute)

export const APIs = Router
