"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/login");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loginRouter = (0, express_1.Router)();
loginRouter.post('/login', login_1.loginUser);
exports.default = loginRouter;
