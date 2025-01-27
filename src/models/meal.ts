import mongoose, { Document, Schema } from 'mongoose';

interface IMeal extends Document {
  name: string;
  description: string;
  recipe: string;
  category: string;
  ingredients: string[];
  region: string;
  imageUrl: string;
  price: number;
  serves: number;

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
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  serves: {
    type: Number,
    default: 1,
  },
});

// Create the model
const Meal = mongoose.model<IMeal>('Meal', MealSchema);

export default Meal;
