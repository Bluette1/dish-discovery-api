import { Router } from 'express';
import OrdersController from '../controllers/orders';
import { authenticateToken, authorizeAdmin } from '../middleware/authmiddleware';
import validatePaymentIntentId from '../middleware/validatePaymentIntentId';
import validateApiKey from '../middleware/apikeymiddleware';

const router = Router();

router.post('/orders', OrdersController.createOrder);

router.get('/orders/:id', authenticateToken, OrdersController.getOrderById);

router.get(
  '/orders',
  // authenticateToken,
  // authorizeAdmin,
  OrdersController.getAllOrders,
);

router.put(
  '/orders/:id',
  authenticateToken,
  authorizeAdmin,
  OrdersController.updateOrder,
);

router.delete(
  '/orders/:id',
  authenticateToken,
  authorizeAdmin,
  OrdersController.deleteOrder,
);

router.put(
  '/orders/payment-intent/:id',
  validateApiKey,
  validatePaymentIntentId,
  OrdersController.updateOrderByPaymentIntent,
);

export default router;
