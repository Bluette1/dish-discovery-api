import { Router } from 'express';
import MealsController from '../controllers/meals';
import { authenticateToken, authorizeAdmin } from '../middleware/authmiddleware';

const router = Router();

// Public route to get all meals
router.get('/meals', MealsController.getAllMeals);

// Protected routes
router.get('/meals/:id', authenticateToken, MealsController.getMealById);

// Admin only
router.post(
  '/meals',
  authenticateToken,
  authorizeAdmin,
  MealsController.createMeal,
);

router.put(
  '/meals/:id',
  authenticateToken,
  authorizeAdmin,
  MealsController.updateMeal,
);

router.delete(
  '/meals/:id',
  authenticateToken,
  authorizeAdmin,
  MealsController.deleteMeal,
);

export default router;
