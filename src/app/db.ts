import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.DB) return console.log("MONGODB_URL not found");
  if (isConnected) return console.log("Connected to MongoDB");

  try {
    await mongoose.connect(process.env.DB);

    isConnected = true;

    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

export { connectToDB };
