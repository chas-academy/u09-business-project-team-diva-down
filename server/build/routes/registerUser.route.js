"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const register_1 = require("../controllers/register");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const routerRegister = (0, express_1.Router)();
routerRegister.post('/register', register_1.registerNewUser);
exports.default = routerRegister;
