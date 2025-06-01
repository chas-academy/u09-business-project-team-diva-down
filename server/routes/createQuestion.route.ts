import { Router } from "express";
import { createQuestion } from "../controllers/createQuestion";
import { authenticate } from '../middleware/authMiddleware';
import dotenv from 'dotenv';

dotenv.config();

const createQuestionRouter = Router();

createQuestionRouter.post('/createquestion', authenticate, createQuestion);

export default createQuestionRouter;