import { Router } from "express";
import UsersController from "../controllers/users";
import { authenticateToken, authorizeAdmin } from "../authmiddleware";

const router = Router();

// Public route to sign up
router.post("/users", UsersController.createUser);

router.get("/users/:id", authenticateToken, UsersController.getUserById);

router.put("/users/:id", authenticateToken, UsersController.updateUser);

// Admin only
router.get("/users", authenticateToken, authorizeAdmin, UsersController.getAllUsers);

router.delete("/users/:id", authenticateToken, authorizeAdmin, UsersController.deleteUser);

export default router;
