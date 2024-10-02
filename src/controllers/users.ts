import { Request, Response } from "express";
import { normalizeEmail } from "validator";
import User from "../models/user";
import { IUser } from "../models/user";

class UsersController {
  // Get all users
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
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
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Create a new user
  public async createUser(req: Request, res: Response): Promise<void> {
    const { name, email, password, role } = req.body;

    try {
      const newUser = new User({
        name,
        email,
        password,
        role,
      });
      const currentUserRole = req.user?.role;

      // Prevent normal users from creating admin users
      if (role === "admin" && currentUserRole !== "admin") {
        res.status(403).json({
          message: "Only admins can create users with the admin role",
        });
        return; // Ensure no further code executes
      }

      const savedUser = await newUser.save();
      res.status(201).json({
        id: savedUser._id,
        name: savedUser.name,
        role: savedUser.role,
        email: savedUser.email,
      });
    } catch (error) {
      if (JSON.stringify(error).includes("duplicate key")) {
        const existingUser = await User.findOne({ email: normalizeEmail(email) });
        res.status(200).json({
          id: existingUser?._id,
          name: existingUser?.name,
          role: existingUser?.role,
          email: existingUser?.email,
        });
      } else {
        res.status(500).json({ message: "Server error", error });
      }
    }
  }

  // Update a user by ID
  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, email, password, role } = req.body;
      const currentUserRole = req.user?.role;

      // Prevent normal users from changing roles
      if (role && currentUserRole !== "admin") {
        res.status(403).json({ message: "Only admins can change user roles" });
        return; // Ensure no further code executes
      }

      // Update only the fields that are provided
      const updateFields: Partial<IUser> = {};
      if (name) updateFields.name = name;
      if (email) updateFields.email = email;
      if (password) updateFields.password = password;
      if (role) updateFields.role = role;

      const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
      if (updatedUser) {
        res.status(200).json({
          id: updatedUser._id,
          name: updatedUser.name,
          role: updatedUser.role,
          email: updatedUser.email,
        });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
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
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new UsersController();
