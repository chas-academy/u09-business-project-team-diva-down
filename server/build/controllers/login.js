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
const User_model_1 = require("../models/User.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Login request received');
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Username and password required' });
            }
            const user = yield User_model_1.User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            const PasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!PasswordValid) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        }
        catch (_a) {
        }
    });
}
