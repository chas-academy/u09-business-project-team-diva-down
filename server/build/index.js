"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
const URI = process.env.MONGODB_URI;
mongoose_1.default.connect(`${URI}`);
app.get('/', (req, res) => {
    res.send('API is live!');
});
app.listen(port, () => {
    console.log(`API is ;live at http://localhost:3000 on port ${port}`);
    mongoose_1.default.connect(`${URI}`)
        .then(() => {
        console.log('Connected to MongoDB successfully.');
    })
        .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });
});
