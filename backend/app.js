import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import rateLimit from 'express-rate-limit';
import connectionsRouter from './Routes/ConnectionRoutes.js';
import documentRouter from './Routes/DocumentRoutes.js';
import userRouter from './Routes/UserRoutes.js'
import authRouter from './Routes/AuthRoutes.js'

dotenv.config();

const app = express();

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_API, 
    credentials: true,              
  }));

app.use(helmet());

app.use(
    session({
        secret: process.env.SESSION_SECRET || '12345NWSDB@Badulla', // 
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 2,
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
        },
    })
);

app.use('/', apiLimiter);
app.use('/connections', connectionsRouter);
app.use('/documents', documentRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);
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
