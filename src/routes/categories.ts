import { Router } from 'express';
import CategoriesController from '../controllers/categories';
import { authenticateToken, authorizeAdmin } from '../authmiddleware';

const router = Router();

// Public route to get all categories
router.get('/categories', CategoriesController.getAllCategories);

// Protected routes
router.use(authenticateToken); // Apply authentication middleware

router.get('/categories/:id', CategoriesController.getCategoryById);

// Admin only
router.post('/categories', authorizeAdmin, CategoriesController.createCategory);

router.put('/categories/:id', authorizeAdmin, CategoriesController.updateCategory);

router.delete('/categories/:id', authorizeAdmin, CategoriesController.deleteCategory);

export default router;
