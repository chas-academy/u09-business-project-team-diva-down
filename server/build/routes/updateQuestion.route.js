"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const updateQuestion_1 = require("../controllers/updateQuestion");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const updateQuestionRouter = (0, express_1.Router)();
updateQuestionRouter.put('/update/:_id', updateQuestion_1.updateQuestion);
exports.default = updateQuestionRouter;
