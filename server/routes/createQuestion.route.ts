import { Router } from "express";
import { createQuestion } from "../controllers/createQuestion";
import dotenv from 'dotenv';

dotenv.config();

const createQuestionRouter = Router();

createQuestionRouter.post('/createquestion', createQuestion);

export default createQuestionRouter;