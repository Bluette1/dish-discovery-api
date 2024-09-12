import { Request, Response } from 'express';
import User from '../models/user';

class UsersController {
  // Get all users
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get a single user by ID
  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create a new user
  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const {
        username, email, password, role,
      } = req.body;
      const newUser = new User({
        username, email, password, role,
      });
      const currentUserRole = req.user?.role;

      // Prevent normal users from creating admin users
      if (role === 'admin' && currentUserRole !== 'admin') {
        res
          .status(403)
          .json({
            message: 'Only admins can create users with the admin role',
          });
        return; // Ensure no further code executes
      }

      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update a user by ID
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        name, email, password, role,
      } = req.body;
      const currentUserRole = req.user?.role;

      // Prevent normal users from changing roles
      if (role && currentUserRole !== 'admin') {
        res.status(403).json({ message: 'Only admins can change user roles' });
        return; // Ensure no further code executes
      }

      // Update only the fields that are provided
      const updateFields: Partial<typeof req.user> = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (password) updateFields.password = password;
      if (role) updateFields.role = role;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        updateFields,
        { new: true },
      );
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Delete a user by ID
  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (deletedUser) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new UsersController();
