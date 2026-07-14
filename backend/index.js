//Main entry point for backend application
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './routes/user.route.js' 
import authRouter from './routes/auth.route.js'
import dns from 'node:dns';

// Fix DNS resolution issues by routing queries through public DNS servers
// dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config({ path: path.resolve(import.meta.dirname, '.env') });

mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB!');
})
.catch((error) => {
    console.log('MongoDB connection failed:', error);
});


const app = express();
const PORT = 3000;

//This will allow the server to use json data 
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)

// middleware for error handling, this will take the custom error or error i made here.
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});
