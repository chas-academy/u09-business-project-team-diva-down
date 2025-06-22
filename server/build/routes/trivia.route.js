"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const Trivia_controller_1 = require("../controllers/Trivia.controller");
dotenv_1.default.config();
const TriviaRouter = (0, express_1.Router)();
TriviaRouter.get('/user/:userId', Trivia_controller_1.getTriviaTables);
TriviaRouter.get('/:id', Trivia_controller_1.getTriviaTable);
TriviaRouter.post('/', Trivia_controller_1.createTriviaTable);
TriviaRouter.put('/:id', Trivia_controller_1.updateTriviaTable);
TriviaRouter.delete('/:id', Trivia_controller_1.deleteTriviaTable);
TriviaRouter.delete('/:id/question/:questionId', Trivia_controller_1.deleteQuestion);
exports.default = TriviaRouter;
