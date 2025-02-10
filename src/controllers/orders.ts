import { Request, Response } from "express";
import Order from "../models/order";

class OrdersController {
  public async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await Order.find();

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get a single order by ID
  public async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Create a new order
  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Update a order by ID
  public async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (updatedOrder) {
        res.status(200).json(updatedOrder);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Delete a order by ID
  public async deleteOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (deletedOrder) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new OrdersController();
