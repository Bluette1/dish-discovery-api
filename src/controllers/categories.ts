import { Request, Response } from 'express';
import Category from '../models/category';

class CategoriesController {
  // Get all categories
  public async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Get a single category by ID
  public async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await Category.findById(id);
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Create a new category
  public async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const newCategory = new Category(req.body);
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Update a category by ID
  public async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
      if (updatedCategory) {
        res.status(200).json(updatedCategory);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // Delete a category by ID
  public async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedCategory = await Category.findByIdAndDelete(id);
      if (deletedCategory) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new CategoriesController();
