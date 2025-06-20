"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const userController_1 = require("../controllers/userController");
dotenv_1.default.config();
const userRouter = (0, express_1.Router)();
userRouter.get('/:userId', userController_1.getUser);
exports.default = userRouter;
