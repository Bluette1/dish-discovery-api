// middleware/validatePaymentIntent.ts
import { Request, Response, NextFunction } from 'express';

const validatePaymentIntentId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Stripe PaymentIntent IDs typically start with 'pi_'
  if (!id || !id.startsWith('pi_')) {
    return res.status(400).json({
      success: false,
      message: 'Invalid Payment Intent ID format',
    });
  }

  next();
};

export default validatePaymentIntentId;
