import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

// Secret key for JWT
const secretKey = process.env.JWT_SECRET_KEY ||  "YourSecretKey";

// Middleware to authenticate users
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(
    token,
    secretKey,
    (
      err: jwt.VerifyErrors | null,
      decodedToken: JwtPayload | string | undefined
    ) => {
      if (err) return res.sendStatus(403); // Forbidden

      // TypeScript now knows `req.user` exists because of the type declaration
      if (decodedToken && typeof decodedToken !== "string") {
        req.user = decodedToken; // Safely assign the decoded token to `req.user`
      } else {
        return res.sendStatus(403); // Forbidden if token is invalid
      }

      next();
    }
  );
}


// Middleware to check for admin role
function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  // First, check if `req.user` exists
  if (!req.user) {
    return res.status(403).send("Access Denied");
  }

  // Narrow down the type: check if `req.user` is a JwtPayload and contains `role`
  if (typeof req.user !== 'string' && 'role' in req.user) {
    if (req.user.role !== "admin") {
      return res.status(403).send("Access Denied");
    }
  } else {
    // If `req.user` is a string or doesn't have a `role`, deny access
    return res.status(403).send("Access Denied");
  }

  next();
}

export { authenticateToken, authorizeAdmin };
