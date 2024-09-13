import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || "YourSecretKey";

// Middleware to authenticate users
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(
    token,
    secretKey,
    {
      complete: true,
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    },
    (
      err: jwt.VerifyErrors | null,
      decodedToken: JwtPayload | string | undefined
    ) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      // If the token is decoded and not a string, assign its payload to req.user
      if (decodedToken && typeof decodedToken !== "string") {
        const { id, role, email, name } = decodedToken.payload as UserPayload;

        req.user = {
          id,
          role,
          email,
          name,
        }; // Assign the decoded token to req.user
        return next(); // Move on to the next middleware
      }

      // Handle cases where decodedToken is a string or invalid
      return res.sendStatus(403); // Forbidden if token is invalid
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
  if (typeof req.user !== "string" && "role" in req.user) {
    if (req.user.role !== "admin") {
      return res.status(403).send("Access Denied");
    }
  } else {
    // If `req.user` is a string or doesn't have a `role`, deny access
    return res.status(403).send("Access Denied");
  }

  return next();
}

export { authenticateToken, authorizeAdmin };
