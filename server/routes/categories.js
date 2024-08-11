import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import * as categoryController from '../controllers/categoryController.js';

const router = express.Router();

router.post('/', authenticateToken, categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', authenticateToken, categoryController.updateCategory);
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

export default router;