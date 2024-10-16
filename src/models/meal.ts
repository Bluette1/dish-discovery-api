import mongoose, { Document, Schema } from 'mongoose';

interface IMeal extends Document {
  name: string;
  description: string;
  recipe: string;
  category: string;
  ingredients: string[];
  region: string;
}

const MealSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  recipe: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  region: {
    type: String,
  },
});

// Create the model
const Meal = mongoose.model<IMeal>('Meal', MealSchema);

export default Meal;
