import { Request, Response } from 'express';
import Order, { OrderStatus } from '../models/order';

class OrdersController {
  public async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const orders = await Order.find();

      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
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
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create a new order
  public async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const newOrder = new Order(req.body);
      const savedOrder = await newOrder.save();
      res.status(201).json(savedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update an order by ID
  public async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (updatedOrder) {
        res.status(200).json(updatedOrder);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
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
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update order by PaymentIntent ID
  public async updateOrderByPaymentIntent(req: Request, res: Response) {
    console.log('Hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Payment Intent ID is required',
        });
      }

      const order = await Order.findOneAndUpdate(
        { stripePaymentIntentId: id },
        {
          $set: {
            status: OrderStatus.PAID,
            ...updateData,
            updatedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ).populate([
        {
          path: 'user',
          select: 'email name',
        },
      ]);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }
      // TODO Send email to the user

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({
        success: false,
        message: 'Error updating order',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export default new OrdersController();
