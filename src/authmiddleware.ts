import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import normalizeEmail from 'normalize-email';
import User from './models/user';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'YourSecretKey';
const { GOOGLE_CLIENT_ID } = process.env;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  if (token.length > 300) {
    // Google ID tokens are generally longer
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (payload) {
        let user = await User.findOne({
          email: normalizeEmail(payload.email || ''),
        });
        if (!user) {
          user = await User.create({
            email: payload.email || '',
            name: payload.name || '',
          });
        }
        const {
          _id: id, role, email, name,
        } = user;
        // Attach Custom user to request

        req.user = {
          id: id.toString(),
          role,
          email,
          name,
        };
        return next();
      }
    } catch (error) {
      console.error('Error verifying Google token:', error);
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid Google token' });
    }
  } else {
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
        decodedToken: JwtPayload | string | undefined,
      ) => {
        if (err) {
          return res.sendStatus(403);
        }

        // If the token is decoded and not a string, assign its payload to req.user
        if (decodedToken && typeof decodedToken !== 'string') {
          const {
            id, role, email, name,
          } = decodedToken.payload as UserPayload;

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
      },
    );
  }
}

// Middleware to check for admin role
function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  // First, check if `req.user` exists
  if (!req.user) {
    return res.status(403).send({ message: 'Access Denied' });
  }

  // Narrow down the type: check if `req.user` is a JwtPayload and contains `role`
  if (typeof req.user !== 'string' && 'role' in req.user) {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'Access Denied' });
    }
  } else {
    // If `req.user` is a string or doesn't have a `role`, deny access
    return res.status(403).send({ message: 'Access Denied' });
  }

  return next();
}

export { authenticateToken, authorizeAdmin };
