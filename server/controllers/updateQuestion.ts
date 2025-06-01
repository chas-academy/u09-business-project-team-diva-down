import { Question } from "../models/question.model";
import { Request, Response } from "express";

async function updateQuestion(req: Request, res: Response): Promise<any> {
    try {
        console.log('Update request received');
        const { question, rightAnswer, answerOp2, answerOp3, answerOp4} = req.body;

        const questionToUpdate = await Question.findById(req.params._id);

        if (!questionToUpdate) {
            return res.status(404).json({ message: "Question Not Found" });
        }

        const update = {};

        if (question) questionToUpdate.question = question;
        if (rightAnswer) questionToUpdate.rightAnswer = rightAnswer;
        if (answerOp2) questionToUpdate.answerOp2 = answerOp2;
        if (answerOp3) questionToUpdate.answerOp3 = answerOp3;
        if (answerOp4) questionToUpdate.answerOp4 = answerOp4;

        await questionToUpdate.save();

        return res.status(200).json({
            message: "Question Updated Successfully!",
            question: questionToUpdate
        });
    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export { updateQuestion }