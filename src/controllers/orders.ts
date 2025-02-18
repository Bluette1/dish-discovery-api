import { Request, Response } from 'express';
import { IMeal } from '../models/meal';
import Order, { OrderStatus } from '../models/order';
import { IUser } from '../models/user';
import { sendEmail } from '../utils/email';
import { canViewOrder, scopedOrders } from '../auth/order';
import normalizeEmail from 'normalize-email';

export interface OrderItem {
  meal: IMeal;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  stripePaymentIntentId: string;
  amount: number;
  status: OrderStatus;
  user: IUser;
  items: OrderItem[];
}

class OrdersController {
  public async getAllOrders(req: Request, res: Response): Promise<void> {
    try {
      const { email, orderNumber } = req.query;
      let orders;

      if (email && typeof email == 'string' && orderNumber) {
        orders = (await Order.find({ orderNumber }).populate(
          'user'
        )) as unknown as [IOrder];
        const order = orders[0];
        if (normalizeEmail(email) !== order.user.email) {
          res.status(401).json({ message: 'Not allowed' });
          return;
        }
        res.status(200).json(order);
      } else {
        orders = await Order.find().populate([
          {
            path: 'items.meal',
            select: 'name price description imageUrl',
          },
          {
            path: 'items.quantity',
          },
        ]);

        res.status(200).json(scopedOrders(req.user, orders));
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get a single order by ID
  public async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await Order.findById(id).populate(['items.meal']);
      if (order) {
        if (!canViewOrder(req.user, order)) {
          res.status(401).json({ message: 'Not allowed' });
          return;
        }
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
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Payment Intent ID is required',
        });
      }

      const order = (await Order.findOneAndUpdate(
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
        }
      ).populate([
        {
          path: 'items.meal',
          select: 'name price imageUrl',
        },
        {
          path: 'user',
          select: 'email name',
        },
      ])) as unknown as IOrder;
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      // Send email to the user
      const { email } = order.user;
      const nameToDisplay = order.user.name || order.user.email; // Use name or email if name is not available
      const greeting = `Hi ${nameToDisplay}, thank you for your order at DishCovery!`;

      // Construct order items HTML
      const orderItemsHtml = order.items
        .map(
          (item: OrderItem) => `
    <div class="order-item">
        <div class="item-name col">${item.meal.name}</div>
        <div class="item-quantity col">Quantity: ${item.quantity}</div>
        <div class="item-price col">$${(
          item.quantity * item.meal.price
        ).toFixed(2)}</div>
    </div>
`
        )
        .join('');

      const total = order.items
        .reduce((sum, item) => sum + item.quantity * item.meal.price, 0)
        .toFixed(2);

      const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Items Display</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
            h1 { text-align: center; color: #fff; background-color: #007BFF; padding: 10px; border-radius: 5px; }
            .order-item { display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #ddd; }
            .order-item:last-child { border-bottom: none; }
            .item-name { font-weight: bold; color: #333; }
            .item-quantity, .item-price { color: #666; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; text-align: right; color: #007BFF; }
            .greeting { margin-bottom: 20px; font-size: 1.1em; color: #333; }
            .track-order { display: block; margin-top: 20px; text-align: center; color: #fff; background-color: #28a745; padding: 10px; border-radius: 5px; text-decoration: none; }
            .track-order:hover { background-color: #218838; }
            .col { padding-right: 2.5em; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Order Items</h1>
            <div class="greeting">${greeting}</div>
            <div id="order-items">${orderItemsHtml}</div>
            <div class="total">Total: $${total}</div>
            <a href="${process.env.FRONTEND_URL}/track-order" class="track-order">Track Your Order</a>
        </div>
    </body>
    </html>
`;

      // Create a plain text version of the email
      const text = `
${greeting}

Order Items:
${order.items
  .map(
    (item: OrderItem) =>
      `${item.meal.name} - Quantity: ${item.quantity} - Price: $${(
        item.quantity * item.meal.price
      ).toFixed(2)}`
  )
  .join('\n')}

Total: $${total}

Track your order here: ${process.env.FRONTEND_URL}/track-order
`;

      await sendEmail({
        to: email,
        subject: 'DishCovery Confirmation of Order',
        html,
        text,
      });

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
