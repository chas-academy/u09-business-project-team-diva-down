import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import routerRegister from "./routes/registerUser.route";

dotenv.config();

const app = express();
const port = 3000;
const URI = process.env.MONGODB_URI;
mongoose.connect(`${URI}`)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('API is live!')
});

app.use('/', routerRegister );

mongoose.connect(URI!)
    .then(() => {
        console.log('Connected to MongoDB successfully.');
        app.listen(port, () => {
            console.log(`API is live at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });