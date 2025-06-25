import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectionsRouter from './Routes/ConnectionRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use('/connections', connectionsRouter);

// MongoDB connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");

        const port = process.env.PORT || 5000;
        app.listen(port, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

connectDB();

export default app;
