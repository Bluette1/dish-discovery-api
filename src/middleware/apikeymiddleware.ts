import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.API_KEY;

// Middleware to validate API key
const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const apiKeyHeader = req.headers['x-api-key'];

  if (!apiKeyHeader || apiKeyHeader !== apiKey) {
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }

  next();
};

export default apiKeyMiddleware;
