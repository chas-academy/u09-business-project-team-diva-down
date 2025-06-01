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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestion = createQuestion;
const question_model_1 = require("../models/question.model");
function createQuestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Question making received');
            const { question, rightAnswer, answerOp2, answerOp3, answerOp4 } = req.body;
            const newQuestion = new question_model_1.Question({
                question: question,
                rightAnswer: rightAnswer,
                answerOp2: answerOp2,
                answerOp3: answerOp3,
                answerOp4: answerOp4
            });
            yield newQuestion.save();
            return res.status(201).json({
                message: "Question created successfully",
                question: {
                    question: newQuestion.question,
                    rightAnswer: newQuestion.rightAnswer,
                    answerOp2: newQuestion.answerOp2,
                    answerOp3: newQuestion.answerOp3,
                    answerOp4: newQuestion.answerOp4
                }
            });
        }
        catch (error) {
            console.error("Question error: ", error);
            res.status(500).json({ message: "Failed to save new question" });
        }
    });
}
