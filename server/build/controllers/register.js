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
exports.registerNewUser = registerNewUser;
const User_model_1 = require("../models/User.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 10;
function registerNewUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
            const eloScore = 0;
            const wins = 0;
            const total_matches = 0;
            const newUser = new User_model_1.User({
                name: name,
                email: email,
                password: hashedPassword,
                eloScore: eloScore,
                wins: wins,
                total_matches: total_matches,
            });
            yield newUser.save();
            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    eloScore: newUser.eloScore,
                    wins: wins,
                    total_matches: total_matches,
                }
            });
        }
        catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Failed to register new user" });
        }
    });
}
