// import { Question } from "../models/question.model";
// import { Request, Response } from "express";


// async function createQuestion(req: Request, res: Response): Promise<any> {
//     try {
//         console.log('Question making received');
//         const { question, rightAnswer, answerOp2, answerOp3, answerOp4} = req.body;

//         const newQuestion = new Question({
//             question: question,
//             rightAnswer: rightAnswer,
//             answerOp2: answerOp2,
//             answerOp3: answerOp3,
//             answerOp4: answerOp4
//         });

//         await newQuestion.save();
        
//         return res.status(201).json({
//             message: "Question created successfully",
//             question: {
//                 question: newQuestion.question,
//                 rightAnswer: newQuestion.rightAnswer,
//                 answerOp2: newQuestion.answerOp2,
//                 answerOp3: newQuestion.answerOp3,
//                 answerOp4: newQuestion.answerOp4
//             }
//         });
//     } catch(error) {
//         console.error("Question error: ", error);
//         res.status(500).json({ message: "Failed to save new question"})
//     }
// }

// export {createQuestion}

import { Request, Response } from 'express';
import { Question } from '../models/question.model';

interface AuthRequest extends Request {
    user?: { id: string };
}

export async function createQuestion(req: Request, res: Response): Promise<any> {
    const authReq = req as AuthRequest; // cast to AuthRequest inside the function
    const userId = authReq.user?.id;
    const { question, rightAnswer, answerOp2, answerOp3, answerOp4 } = req.body;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const newQuestion = new Question({
        question,
        rightAnswer,
        answerOp2,
        answerOp3,
        answerOp4,
        createdBy: userId,
    });

        await newQuestion.save();

        res.status(201).json({ message: 'Question created', question: newQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

