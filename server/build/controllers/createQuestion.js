"use strict";
// import { Question } from "../models/question.model";
// import { Request, Response } from "express";
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
        var _a;
        const authReq = req; // cast to AuthRequest inside the function
        const userId = (_a = authReq.user) === null || _a === void 0 ? void 0 : _a.id;
        const { question, rightAnswer, answerOp2, answerOp3, answerOp4 } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const newQuestion = new question_model_1.Question({
                question,
                rightAnswer,
                answerOp2,
                answerOp3,
                answerOp4,
                createdBy: userId,
            });
            yield newQuestion.save();
            res.status(201).json({ message: 'Question created', question: newQuestion });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
}
