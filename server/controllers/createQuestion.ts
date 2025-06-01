import { Question } from "../models/question.model";
import { Request, Response } from "express";


async function createQuestion(req: Request, res: Response): Promise<any> {
    try {
        console.log('Question making received');
        const { question, rightAnswer, answerOp2, answerOp3, answerOp4} = req.body;

        const newQuestion = new Question({
            question: question,
            rightAnswer: rightAnswer,
            answerOp2: answerOp2,
            answerOp3: answerOp3,
            answerOp4: answerOp4
        });

        await newQuestion.save();
        
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
    } catch(error) {
        console.error("Question error: ", error);
        res.status(500).json({ message: "Failed to save new question"})
    }
}

export {createQuestion}