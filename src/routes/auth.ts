import { Router } from 'express';
import LoginController from '../controllers/login';

const router = Router();

// Public routes
router.post('/login', LoginController.login);
router.post('/forgot-password', LoginController.forgotPassword);
router.post('/reset-password', LoginController.resetPassword);

export default router;
