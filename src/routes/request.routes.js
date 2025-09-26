import express from 'express'
import { orderController } from '~/controllers/orderRequest.controller';
import { orderValidation } from '~/validations/order.validation';
import { repairController } from '~/controllers/repairRequest.controller';
import { repairValidation } from '~/validations/repair.validation';
import { verifyToken, verifyAdmin } from '~/middlewares/auth.middleware.js'
import { searchService } from '~/services/search.service';
import { uploadImage } from '~/middlewares/upload.middleware.js'


const Router = express.Router()
// Order Requests
Router.post('/orders', orderValidation.createOrder, orderController.createRequest)
Router.put('/orders/:id', verifyToken, verifyAdmin, orderValidation.updateOrder, orderController.updateRequest)
Router.patch('/orders/:id', verifyToken, verifyAdmin, orderValidation.hideOrder, orderController.hideRequest)

Router.get('/orders', verifyToken, verifyAdmin, orderController.getAllRequests) // ?page=1&limit=10
Router.get('/orders/:id', verifyToken, verifyAdmin, orderValidation.getOrderById, orderController.getRequestById)
Router.get('/orders/status/:status', verifyToken, verifyAdmin, orderValidation.getOrdersByStatus, orderController.getRequestsByStatus)
Router.get('/orders/search', verifyToken, verifyAdmin, orderController.searchRequests) // ?query=abc&page=1&limit=10

// Repair Requests
Router.post('/repairs', uploadImage.array('images'), repairValidation.createRepair, repairController.createRequest)
Router.put('/repairs/:id', verifyToken, verifyAdmin, uploadImage.array('images'), repairValidation.updateRepair, repairController.updateRequest)
Router.patch('/repairs/:id', verifyToken, verifyAdmin, repairValidation.hideRepair, repairController.hideRequest)
Router.delete('/repairs/:id', verifyToken, verifyAdmin, repairValidation.deleteRepair, repairController.deleteRequest)

Router.get('/repairs', verifyToken, verifyAdmin, repairController.getAllRequests) // ?page=1&limit=10
Router.get('/repairs/:id', verifyToken, verifyAdmin, repairValidation.getRepairById, repairController.getRequestById)
Router.get('/repairs/service/:serviceId', verifyToken, verifyAdmin, repairValidation.getRepairsByService, repairController.getRequestsByService)
Router.get('/repairs/status/:status', verifyToken, verifyAdmin, repairValidation.getRepairsByStatus, repairController.getRequestsByStatus)
Router.get('/repairs/search', verifyToken, verifyAdmin, repairController.searchRequests) // ?query=abc&page=1&limit=10

Router.get('/search', async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;
  try {
    const results = await searchService.searchRequests(query, { page, limit });
    res.json(results);
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm:', error);
    res.status(500).json({ error: 'Lỗi khi tìm kiếm' });
  }
});

export const requestRoute = Router