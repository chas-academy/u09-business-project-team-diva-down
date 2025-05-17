import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = 3000;
const URI = process.env.MONGODB_URI;
mongoose.connect(`${URI}`)


app.get('/', (req, res) => {
    res.send('API is live!')
});

app.listen(port, () => {
    console.log(`API is ;live at http://localhost:3000 on port ${port}`);
    mongoose.connect(`${URI}`)
        .then(() => {
            console.log('Connected to MongoDB successfully.');
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB:', err);
        });
});