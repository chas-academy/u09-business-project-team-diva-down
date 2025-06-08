"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const deleteQuestion_1 = require("../controllers/deleteQuestion");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const deleteQuestionRouter = (0, express_1.Router)();
deleteQuestionRouter.delete('/delete/:_id', authMiddleware_1.authenticate, deleteQuestion_1.deleteQuestion);
exports.default = deleteQuestionRouter;
