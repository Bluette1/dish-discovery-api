// src/types/express/index.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: string | UserPayload; // Add your custom `user` property here
    }
  }

  interface UserPayload {
    id: string;
    role: string;
    // Add other properties as needed
}
}


export {}; // This line ensures the file is treated as a module
