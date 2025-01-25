import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    const mongoUri = "mongodb+srv://thimayarohit:Rohit%402728@cluster0.mr1gx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your MongoDB URI

    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process on failure
    }
};

export default connectDB;
