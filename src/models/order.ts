import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  meal: Schema.Types.ObjectId;
  quantity: number;
}

enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export interface IOrder extends Document {
  orderNumber: string;
  stripePaymentIntentId: string;
  amount: number;
  status: OrderStatus;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    items: {
      type: [
        {
          meal: { type: Schema.Types.ObjectId, required: true, ref: 'Meal' },
          quantity: { type: Number, required: true, min: 1 },
        },
      ],
      required: true,
    },
  },
  { timestamps: true },
);

// Create the model
const Order = mongoose.model<IOrder>('Order', OrderSchema);

export { OrderStatus };
export default Order;
