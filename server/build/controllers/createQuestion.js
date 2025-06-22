"use strict";
// import { Request, Response } from 'express';
// import { Question } from '../models/question.model';
// interface AuthRequest extends Request {
//     user?: { id: string };
// }
// export async function createQuestion(req: Request, res: Response): Promise<any> {
//     const authReq = req as AuthRequest;
//     const userId = authReq.user?.id;
//     const { question, rightAnswer, answerOp2, answerOp3, answerOp4 } = req.body;
//     if (!userId) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     try {
//         const newQuestion = new Question({
//         question,
//         rightAnswer,
//         answerOp2,
//         answerOp3,
//         answerOp4,
//         createdBy: userId,
//     });
//         await newQuestion.save();
//         res.status(201).json({ message: 'Question created', question: newQuestion });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// }
