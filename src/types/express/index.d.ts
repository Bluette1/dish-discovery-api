// src/types/express/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }

  interface UserPayload {
    id: string;
    role: string;
    name: string;
    email: string;
    password: string;
}
}

export {}; // This line ensures the file is treated as a module
