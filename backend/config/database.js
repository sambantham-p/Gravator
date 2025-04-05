const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async function connectDB() {
  try {
    await mongoose
      .connect(process.env.DATABASE_URL)
      .then(() => console.log('DB connected'))
      .catch((err) => console.error('DB connection error', err));
  } catch (err) {
    console.error('MongoDB connection failed');
    console.error(err);
  }
};
