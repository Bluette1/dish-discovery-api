const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    recipe: {
        type: String,
        required: true
    }, 
    category: {
        type: String,
        required: true
    }, 
    ingredients: {
        type: [String],
        required: true
    }, 
    region: {
        type: String,
    }
});

module.exports = mongoose.model('Item', MealSchema);
