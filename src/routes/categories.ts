import { Router } from 'express';
import CategoriesController from '../controllers/categories';
import { authenticateToken, authorizeAdmin } from '../middleware/authmiddleware';

const router = Router();

// Public route to get all categories
router.get('/categories', CategoriesController.getAllCategories);

// Protected routes
router.get('/categories/:id', authenticateToken, CategoriesController.getCategoryById);

// Admin only
router.post('/categories', authenticateToken, authorizeAdmin, CategoriesController.createCategory);

router.put('/categories/:id', authenticateToken, authorizeAdmin, CategoriesController.updateCategory);

router.delete('/categories/:id', authenticateToken, authorizeAdmin, CategoriesController.deleteCategory);

export default router;
