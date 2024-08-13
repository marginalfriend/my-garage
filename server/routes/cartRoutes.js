import { Router } from 'express';
const router = Router();
import * as cartController from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

// POST route to add a product to the cart
router.post('/', authenticateToken, cartController.addToCart);
router.get('/', authenticateToken, cartController.getUserCart);
router.get('/:productId', authenticateToken, cartController.getCartItemByProductId);
router.put('/', authenticateToken, cartController.updateCartItem);
router.delete('/', authenticateToken, cartController.deleteCartItem);

export default router;
