require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
};

// const connectDB =  (url) => {
//  return mongoose.connect((url) => {

//  }).then(() => {
//   console.log('Connected to DB')

//  }).catch(error => {
//   console.log('failed to connect to DB')
//   console.error('ERROR', error);
//  })

// }

module.exports = connectDB;
