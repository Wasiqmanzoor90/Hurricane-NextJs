import mongoose from "mongoose";

export const connectDb = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already connected to database");
    return;
  }
  try {
    await mongoose.connect("mongodb://localhost:27017/");
    console.log("Db Connected!");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
