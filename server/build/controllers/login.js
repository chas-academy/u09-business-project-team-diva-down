"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
const User_model_1 = require("../models/User.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Login request received');
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required.' });
            }
            const user = yield User_model_1.User.findOne({ email });
            if (!user || !user.password) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id.toString() }, process.env.JWT_SECRET, { expiresIn: '86400s' });
            console.log("Generated Token: ", token);
            // // Decode the token to get the expiration time
            // const decoded = jwt.decode(token) as { id: string; exp: number } | null;
            // if (decoded && decoded.exp) {
            //     // Get current time in seconds
            //     const nowInSeconds = Math.floor(Date.now() / 1000);
            //     // Calculate remaining time in seconds
            //     const timeLeftInSeconds = decoded.exp - nowInSeconds;
            //     // Convert to hours, minutes, seconds for better readability
            //     const hours = Math.floor(timeLeftInSeconds / 3600);
            //     const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
            //     const seconds = timeLeftInSeconds % 60;
            // console.log(`Token expires in: ${hours}h ${minutes}m ${seconds}s`);
            // } else {
            // console.log("Could not decode token or no expiration set");
            // }
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token
            });
        }
        catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    });
}
