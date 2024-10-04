import mongoose from 'mongoose';
import User from './models/user';
import dotenv from 'dotenv';

dotenv.config();

// Database connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dishdiscovery';


const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    // Create an admin user
    const adminUser = new User({
      email: 'newadmin@gmail.com',
      password: 'newadminpass', 
      role: 'admin',
      name: 'new admin'
    });

    // Save the admin user to the database
    await adminUser.save();

    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
  }
};

seedDatabase();
