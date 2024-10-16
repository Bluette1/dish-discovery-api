import { Router } from 'express';
import LoginController from '../controllers/login';

const router = Router();

// Public login route
router.post('/login', LoginController.login);

export default router;
