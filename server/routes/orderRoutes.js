import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);
router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/admin', orderController.getPaginatedOrders);
router.get('/:orderId', orderController.getOrderDetails);
router.get('/checkstok/:orderId', orderController.checkStock)
router.patch('/:orderId', orderController.updateOrder);
router.patch('/', orderController.cancelOrder)

export default router;