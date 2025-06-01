import mongoose, { Schema, Model } from "mongoose";

interface IQuestions {
    question: string;
    rightAnswer: string;
    answerOp2: string;
    answerOp3: string;
    answerOp4: string; 
    userID: string;
    createdBy: Schema.Types.ObjectId;
}

const questionSchema = new Schema<IQuestions>(
    {
        question: { type: String, required: true},
        rightAnswer: { type: String, required: true },
        answerOp2: { type: String, required: true},
        answerOp3: { type: String, required: true},
        answerOp4: { type: String, required: true},
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    }, 
    {
        collection: 'Questions'
    }
);

const Question: Model<IQuestions> = mongoose.model<IQuestions>('Questions', questionSchema);

export {Question};