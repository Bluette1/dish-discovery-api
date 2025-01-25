import mongoose from "mongoose";
import User from "./models/user";
import dotenv from "dotenv";
import Category from "./models/category";
import Meal from "./models/meal";

dotenv.config();

// Database connection string
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/dishdiscovery";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    // Clear existing users
    await User.deleteMany({});

    // Create an admin user
    const adminUser = new User({
      email: "admin@gmail.com",
      password: "adminpass",
      role: "admin",
      name: "admin",
    });

    // Save the admin user to the database
    await adminUser.save();

    console.log("Admin user created successfully!");

    // Clear existing categories
    await Category.deleteMany({});

    //Add categories data
    const categories = [
      {
        name: "Starter",
        description: "Small dishes served before the main course.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/starter.jpg",
      },
      {
        name: "Breakfast",
        description: "Hearty morning dishes that help you start your day.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/breakfast.jpg",
      },
      {
        name: "Dessert",
        description: "Sweet dishes served at the end of a meal.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/dessert.jpg",
      },
      {
        name: "Miscellaneous",
        description:
          "Miscellaneous meals such as soups and bread served alongside the meal.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/miscellaneous.jpg",
      },
      {
        name: "Pasta",
        description: "Traditional Italian staple food",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/pasta.jpg",
      },
      {
        name: "Vegetarian",
        description:
          "Delicious dishes for those who eat neither meat nor seafood.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/vegetarian.jpg",
      },
      {
        name: "Vegan",
        description:
          "Delicious dishes for those who do not eat animal products, including diary and eggs.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/vegan.jpg",
      },
      {
        name: "Seafood",
        description:
          "Any form of sea life eaten by humans such as fish and other forms of sea food.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/seafood.jpg",
      },
      {
        name: "Chicken",
        description: "Mouth-watering chicken meals.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/chicken.jpg",
      },
      {
        name: "Beef",
        description: "Meat from cattle meals.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/beef.jpg",
      },
      {
        name: "Lamb",
        description: "Meat from domestic sheep.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/lamb.jpg",
      },
      {
        name: "Salad",
        description: "Salads and the like.",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/salad.jpg",
      },
    ];

    // Insert new categories
    await Category.insertMany(categories);

    console.log("Categories added successfully!");

    // Clear existing meals
    await Meal.deleteMany({});

    const meals = [
      // Starter
      {
        name: "Garlic Butter Shrimp",
        description: "Succulent shrimp cooked in garlic butter.",
        recipe: "Sauté shrimp in garlic butter and serve with lemon.",
        category: "Starter",
        ingredients: ["Shrimp", "Garlic", "Butter", "Lemon"],
        region: "Global",
        price: 15,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/garlic-butter-shrimp.jpg",
      },
      {
        name: "Bruschetta",
        description: "Toasted bread topped with fresh tomatoes and basil.",
        recipe: "Top toasted bread with diced tomatoes, basil, and garlic.",
        category: "Starter",
        ingredients: ["Bread", "Tomatoes", "Basil", "Garlic"],
        region: "Italian",
        price: 12,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/bruschetta.jpg",
      },
      {
        name: "Stuffed Mushrooms",
        description: "Mushrooms stuffed with cheese and herbs.",
        recipe: "Fill mushroom caps with cheese mixture and bake.",
        category: "Starter",
        ingredients: ["Mushrooms", "Cream Cheese", "Herbs"],
        region: "Global",
        price: 15,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/stuffed-mushrooms.jpg",
      },

      // Breakfast
      {
        name: "Pancakes",
        description: "Fluffy pancakes served with syrup.",
        recipe: "Mix ingredients, cook on a griddle, and serve with syrup.",
        category: "Breakfast",
        ingredients: ["Flour", "Eggs", "Milk", "Sugar"],
        region: "Global",
        price: 20,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/pancakes.jpg",
      },
      {
        name: "Omelette",
        description: "Eggs cooked with fillings like cheese and vegetables.",
        recipe: "Beat eggs, pour into a pan, and add fillings.",
        category: "Breakfast",
        ingredients: ["Eggs", "Cheese", "Bell Peppers"],
        region: "Global",
        price: 22,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/omelette.jpg",
      },
      {
        name: "Avocado Toast",
        description: "Toast topped with smashed avocado and seasonings.",
        recipe: "Mash avocado on toast and season with salt and pepper.",
        category: "Breakfast",
        ingredients: ["Bread", "Avocado", "Salt"],
        region: "Global",
        price: 12,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/avocado-toast.jpg",
      },

      // Dessert
      {
        name: "Chocolate Cake",
        description: "Rich chocolate cake topped with icing.",
        recipe: "Bake the cake and frost with chocolate icing.",
        category: "Dessert",
        ingredients: ["Flour", "Cocoa Powder", "Sugar", "Eggs"],
        region: "Global",
        price: 70,
        serves: 8,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/chocolate-cake.jpg",
      },
      {
        name: "Apple Pie",
        description: "Classic pie filled with spiced apples.",
        recipe: "Bake apples in a pastry crust.",
        category: "Dessert",
        ingredients: ["Apples", "Sugar", "Cinnamon", "Pie Crust"],
        region: "American",
        price: 25,
        serves: 3,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/apple-pie.jpg",
      },
      {
        name: "Tiramisu",
        description: "Coffee-flavored Italian dessert.",
        recipe: "Layer coffee-soaked ladyfingers with mascarpone cheese.",
        category: "Dessert",
        ingredients: ["Ladyfingers", "Coffee", "Mascarpone"],
        region: "Italian",
        price: 32,
        serves: 3,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/tiramisu.jpg",
      },

      // Miscellaneous
      {
        name: "Minestrone Soup",
        description: "Hearty vegetable soup with pasta.",
        recipe: "Cook vegetables and pasta in broth.",
        category: "Miscellaneous",
        ingredients: ["Vegetables", "Pasta", "Broth"],
        region: "Italian",
        price: 20,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/minestrone-soup.jpg",
      },
      {
        name: "Fried Rice",
        description: "Stir-fried rice with vegetables and eggs.",
        recipe: "Fry rice with vegetables and scrambled eggs.",
        category: "Miscellaneous",
        ingredients: ["Rice", "Eggs", "Vegetables"],
        region: "Asian",
        price: 26,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/fried-rice.jpg",
      },
      {
        name: "Potato Salad",
        description: "Cold salad made with boiled potatoes and dressing.",
        recipe: "Mix boiled potatoes with mayonnaise and seasonings.",
        category: "Miscellaneous",
        ingredients: ["Potatoes", "Mayonnaise", "Onions"],
        region: "American",
        price: 17,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/potato-salad.jpg",
      },

      // Vegetarian
      {
        name: "Vegetable Stir Fry",
        description: "A mix of fresh vegetables stir-fried.",
        recipe: "Stir-fry vegetables in a wok with soy sauce.",
        category: "Vegetarian",
        ingredients: ["Broccoli", "Bell Peppers", "Carrots"],
        region: "Asian",
        price: 24,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/vegetable-stir-fry.jpg",
      },
      {
        name: "Stuffed Peppers",
        description: "Peppers filled with rice, beans, and cheese.",
        recipe: "Fill peppers with mixture and bake.",
        category: "Vegetarian",
        ingredients: ["Bell Peppers", "Rice", "Beans", "Cheese"],
        region: "Global",
        price: 22,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/stuffed-peppers.jpg",
      },
      {
        name: "Caprese Salad",
        description: "Salad made with fresh mozzarella, tomatoes, and basil.",
        recipe: "Layer mozzarella and tomatoes, drizzle with olive oil.",
        category: "Vegetarian",
        ingredients: ["Mozzarella", "Tomatoes", "Basil"],
        region: "Italian",
        price: 23,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/caprese-salad.jpg",
      },

      // Vegan
      {
        name: "Vegan Chili",
        description: "Spicy chili made with beans and vegetables.",
        recipe: "Simmer beans and vegetables with spices.",
        category: "Vegan",
        ingredients: ["Beans", "Tomatoes", "Onions", "Chili Powder"],
        region: "Global",
        price: 25,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/vegan-chili.jpg",
      },
      {
        name: "Quinoa Salad",
        description: "Nutty quinoa tossed with vegetables.",
        recipe: "Mix cooked quinoa with vegetables and dressing.",
        category: "Vegan",
        ingredients: ["Quinoa", "Cucumber", "Tomatoes"],
        region: "Global",
        price: 17,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/quinoa-salad.jpg",
      },
      {
        name: "Lentil Soup",
        description: "Hearty soup made with lentils and spices.",
        recipe: "Cook lentils with broth and vegetables.",
        category: "Vegan",
        ingredients: ["Lentils", "Carrots", "Celery", "Onions"],
        region: "Global",
        price: 13,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/lentil-soup.jpg",
      },

      // Seafood
      {
        name: "Grilled Salmon",
        description: "Delicious salmon fillet grilled to perfection.",
        recipe: "Season salmon and grill until cooked through.",
        category: "Seafood",
        ingredients: ["Salmon", "Lemon", "Herbs"],
        region: "Global",
        price: 27,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/grilled-salmon.jpg",
      },
      {
        name: "Shrimp Scampi",
        description: "Shrimp cooked in garlic and butter sauce.",
        recipe: "Sauté shrimp in garlic butter and serve over pasta.",
        category: "Seafood",
        price: 34,
        ingredients: ["Shrimp", "Garlic", "Butter", "Pasta"],
        region: "Italian",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/shrimp-scampi.jpg",
      },
      {
        name: "Fish Tacos",
        description: "Tacos filled with seasoned fish and toppings.",
        recipe: "Fill tortillas with cooked fish and toppings.",
        category: "Seafood",
        ingredients: ["Fish", "Tortillas", "Cabbage", "Salsa"],
        region: "Mexican",
        price: 30,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/fish-tacos.jpg",
      },

      // Chicken
      {
        name: "Tandoori Chicken",
        description: "Spicy chicken marinated in yogurt and spices.",
        recipe: "Marinate chicken and cook in a tandoor.",
        category: "Chicken",
        ingredients: ["Chicken", "Yogurt", "Spices"],
        region: "Indian",
        price: 15,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/tandoori-chicken.jpg",
      },
      {
        name: "Chicken Alfredo",
        description: "Pasta with creamy Alfredo sauce and chicken.",
        recipe: "Cook pasta and mix with Alfredo sauce and chicken.",
        category: "Chicken",
        ingredients: ["Chicken", "Pasta", "Cream", "Parmesan"],
        region: "Italian",
        price: 15,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/chicken-alfredo.jpg",
      },
      {
        name: "Buffalo Chicken Wings",
        description: "Spicy chicken wings served with blue cheese sauce.",
        recipe: "Fry chicken wings and toss in buffalo sauce.",
        category: "Chicken",
        ingredients: ["Chicken Wings", "Buffalo Sauce", "Blue Cheese"],
        region: "American",
        price: 13,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/buffalo-wings.jpg",
      },

      // Beef
      {
        name: "Beef Stroganoff",
        description: "Tender beef in a creamy mushroom sauce.",
        recipe: "Cook beef and mushrooms in a creamy sauce.",
        category: "Beef",
        ingredients: ["Beef", "Mushrooms", "Cream", "Onions"],
        region: "Russian",
        price: 25,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/beef-stroganoff.jpg",
      },
      {
        name: "Beef Tacos",
        description: "Tacos filled with seasoned ground beef.",
        recipe: "Fill tortillas with cooked ground beef and toppings.",
        category: "Beef",
        price: 30,
        ingredients: ["Ground Beef", "Tortillas", "Lettuce", "Cheese"],
        region: "Mexican",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/beef-tacos.jpg",
      },
      {
        name: "Beef Bourguignon",
        description: "Beef stew braised in red wine.",
        recipe: "Cook beef with wine, carrots, and onions.",
        category: "Beef",
        ingredients: ["Beef", "Red Wine", "Carrots", "Onions"],
        region: "French",
        price: 26,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/beef-bourguignon.jpg",
      },

      // Lamb
      {
        name: "Lamb Chops",
        description: "Juicy lamb chops grilled with herbs.",
        recipe: "Season and grill lamb chops until cooked.",
        category: "Lamb",
        ingredients: ["Lamb Chops", "Garlic", "Rosemary"],
        region: "Global",
        price: 28,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/lamb-chops.jpg",
      },
      {
        name: "Lamb Curry",
        description: "Spicy lamb cooked in a rich curry sauce.",
        recipe: "Simmer lamb with spices and coconut milk.",
        category: "Lamb",
        ingredients: ["Lamb", "Curry Powder", "Coconut Milk"],
        region: "Indian",
        price: 30,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/lamb-curry.jpg",
      },
      {
        name: "Greek Lamb Gyros",
        description: "Pita bread filled with spiced lamb and toppings.",
        recipe: "Fill pita bread with cooked lamb and salad.",
        category: "Lamb",
        ingredients: ["Lamb", "Pita Bread", "Tzatziki"],
        region: "Greek",
        price: 32,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/lamb-gyros.jpg",
      },

      // Salad
      {
        name: "Caesar Salad",
        description: "Classic Caesar salad with dressing and croutons.",
        recipe: "Toss romaine lettuce with Caesar dressing and croutons.",
        category: "Salad",
        ingredients: ["Romaine Lettuce", "Croutons", "Parmesan Cheese"],
        region: "Italian",
        price: 22,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/caesar-salad.jpg",
      },
      {
        name: "Greek Salad",
        description: "Fresh salad with tomatoes, cucumbers, and feta cheese.",
        recipe: "Mix tomatoes, cucumbers, onions, and feta.",
        category: "Salad",
        price: 20,
        ingredients: ["Tomatoes", "Cucumbers", "Feta Cheese", "Olives"],
        region: "Greek",
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/greek-salad.jpg",
      },
      {
        name: "Caprese Salad",
        description: "Salad made with fresh mozzarella, tomatoes, and basil.",
        recipe: "Layer mozzarella and tomatoes, drizzle with olive oil.",
        category: "Salad",
        ingredients: ["Mozzarella", "Tomatoes", "Basil"],
        region: "Italian",
        price: 20,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/caprese-salad.jpg",
      },
      // Pasta
      {
        name: "Spaghetti Carbonara",
        description: "Pasta with eggs, cheese, pancetta, and pepper.",
        recipe: "Cook spaghetti and mix with egg and cheese mixture.",
        category: "Pasta",
        ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan"],
        region: "Italian",
        price: 30,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/carbonara.jpg",
      },
      {
        name: "Penne Arrabbiata",
        description: "Pasta with a spicy tomato sauce.",
        recipe: "Cook penne and toss with spicy tomato sauce.",
        category: "Pasta",
        ingredients: ["Penne", "Tomatoes", "Garlic", "Chili"],
        region: "Italian",
        price: 32,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/penne-arrabbiata.jpg",
      },
      {
        name: "Fettuccine Alfredo",
        description: "Pasta in a creamy Alfredo sauce.",
        recipe: "Cook fettuccine and mix with cream and cheese.",
        category: "Pasta",
        ingredients: ["Fettuccine", "Cream", "Parmesan", "Butter"],
        region: "Italian",
        price: 29,
        imageUrl:
          "https://dishdiscovery.s3.us-east-1.amazonaws.com/images/meals/fettuccine-alfredo.jpg",
      },
    ];

    // Insert new meals
    await Meal.insertMany(meals);

    console.log("Meals added successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
  }
};

seedDatabase();
