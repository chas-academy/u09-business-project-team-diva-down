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
exports.updateQuestion = updateQuestion;
const question_model_1 = require("../models/question.model");
function updateQuestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Update request received');
            const { question, rightAnswer, answerOp2, answerOp3, answerOp4 } = req.body;
            const questionToUpdate = yield question_model_1.Question.findById(req.params._id);
            if (!questionToUpdate) {
                return res.status(404).json({ message: "Question Not Found" });
            }
            const update = {};
            if (question)
                questionToUpdate.question = question;
            if (rightAnswer)
                questionToUpdate.rightAnswer = rightAnswer;
            if (answerOp2)
                questionToUpdate.answerOp2 = answerOp2;
            if (answerOp3)
                questionToUpdate.answerOp3 = answerOp3;
            if (answerOp4)
                questionToUpdate.answerOp4 = answerOp4;
            yield questionToUpdate.save();
            return res.status(200).json({
                message: "Question Updated Successfully!",
                question: questionToUpdate
            });
        }
        catch (error) {
            console.error('Update error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
}
