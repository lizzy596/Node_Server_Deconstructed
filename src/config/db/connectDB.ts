import mongoose from "mongoose";

const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log("connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
};


export default connectDB;





