"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deleteBook_1 = require("../controllers/deleteBook");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const deleteQuestionRouter = (0, express_1.Router)();
deleteQuestionRouter.delete('/delete/:_id', deleteBook_1.deleteQuestion);
exports.default = deleteQuestionRouter;
