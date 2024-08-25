const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// function to connect to database
const connectDB = () => {
  try {
    // connect to MongoDB
    mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
