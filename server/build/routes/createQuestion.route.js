"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createQuestion_1 = require("../controllers/createQuestion");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createQuestionRouter = (0, express_1.Router)();
createQuestionRouter.post('/createquestion', createQuestion_1.createQuestion);
exports.default = createQuestionRouter;
