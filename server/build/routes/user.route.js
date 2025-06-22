"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const userController_1 = require("../controllers/userController");
const userController_2 = require("../controllers/userController");
const userController_3 = require("../controllers/userController");
dotenv_1.default.config();
const userRouter = (0, express_1.Router)();
userRouter.get('/:userId', userController_1.getUser);
userRouter.get('/', userController_2.getAllusers);
userRouter.put('/:userId', userController_1.updateUser);
userRouter.delete('/:userId', userController_3.deleteUser);
exports.default = userRouter;
