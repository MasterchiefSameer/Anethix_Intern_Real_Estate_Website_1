//Main entry point for backend application
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import dns from 'node:dns';

// Fix DNS resolution issues by routing queries through public DNS servers
// dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config({ path: path.resolve(import.meta.dirname, '.env') });

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB!');
}).catch((error) => {
    console.log('MongoDB connection failed:', error);
});


const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})