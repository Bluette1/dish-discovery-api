import { Request, Response } from "express";
import Meal from "../models/meal";

class MealsController {
  // Get all meals or meals by category, name, etc
  public async getAllMeals(req: Request, res: Response): Promise<void> {
    try {
      const { category, name } = req.query;

      let meals;
      // If a category is provided, filter meals by that category

      if (category && typeof category === "string") {
        meals = await Meal.find({ category: decodeURIComponent(category) });
      } else if (name && typeof name === "string") {
        // If a name is provided, filter meals by that name
        meals = await Meal.find({ name: decodeURIComponent(name) });
      }
      // If no category or name is provided, return all meals
      else {
        meals = await Meal.find();
      }
      res.status(200).json(meals);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Get a single meal by ID
  public async getMealById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const meal = await Meal.findById(id);
      if (meal) {
        res.status(200).json(meal);
      } else {
        res.status(404).json({ message: "Meal not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Create a new meal
  public async createMeal(req: Request, res: Response): Promise<void> {
    try {
      const newMeal = new Meal(req.body);
      const savedMeal = await newMeal.save();
      res.status(201).json(savedMeal);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Update a meal by ID
  public async updateMeal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updatedMeal = await Meal.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (updatedMeal) {
        res.status(200).json(updatedMeal);
      } else {
        res.status(404).json({ message: "Meal not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  // Delete a meal by ID
  public async deleteMeal(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedMeal = await Meal.findByIdAndDelete(id);
      if (deletedMeal) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Meal not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}

export default new MealsController();
