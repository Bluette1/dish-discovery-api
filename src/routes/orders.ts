import { Router } from "express";
import OrdersController from "../controllers/orders";
import { authenticateToken, authorizeAdmin } from "../authmiddleware";

const router = Router();

router.post("/order", OrdersController.createOrder);

router.get("/orders/:id", authenticateToken, OrdersController.getOrderById);

router.get(
  "/orders",
  authenticateToken,
  authorizeAdmin,
  OrdersController.getAllOrders
);

router.put(
  "/orders/:id",
  authenticateToken,
  authorizeAdmin,
  OrdersController.updateOrder
);

router.delete(
  "/orders/:id",
  authenticateToken,
  authorizeAdmin,
  OrdersController.deleteOrder
);

export default router;
