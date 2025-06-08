import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { deleteQuestion } from "../controllers/deleteQuestion";
import dotenv from 'dotenv';

dotenv.config();

const deleteQuestionRouter = Router();

deleteQuestionRouter.delete('/delete/:_id', authenticate, deleteQuestion);

export default deleteQuestionRouter;