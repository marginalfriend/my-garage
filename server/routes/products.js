import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as productController from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', authenticateToken, upload, productController.createProduct);
router.put('/:id', authenticateToken, upload, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

export default router;