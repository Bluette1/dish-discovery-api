import OrdersController from '../../controllers/orders';
import router from '../orders';

router.get('/track/orders', OrdersController.getAllOrders);

export default router
