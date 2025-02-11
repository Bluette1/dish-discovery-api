import { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import normalizeEmail from 'normalize-email';
import crypto from 'crypto';
import User from '../models/user';
import { sendEmail } from '../utils/email';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY || 'YourSecretKey';

class LoginController {
  // User login
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email: normalizeEmail(email) });
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Compare provided password with hashed password in the database
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          name: user.name,
          email: user.email,
        },
        secretKey,
        {
          expiresIn: '1h',
          notBefore: '0',
        },
      );

      // Respond with token and user details
      res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: unknown) {
      console.log('error{{{{{{{{{{{{{', error)
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unknown error occurred' });
      }
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        // Return 200 even if user doesn't exist for security
        res.json({
          message: 'If an account exists, a reset link will be sent',
        });
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      // Save to user
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();

      // Send email
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `To reset your password, click the following link: ${resetUrl}`,
        html: `
          <p>To reset your password, click the following link:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
        `,
      });

      res.json({ message: 'Reset link sent to email' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'Error sending reset email' });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        res.status(400).json({ message: 'Invalid or expired reset token' });
        return;
      }

      // Update password
      user.password = password; // Assuming you have a pre-save hook for hashing
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'Error resetting password' });
    }
  }
}

export default new LoginController();
