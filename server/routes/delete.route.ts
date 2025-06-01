import { Router } from "express";
import { deleteQuestion } from "../controllers/deleteBook";
import dotenv from 'dotenv';

dotenv.config();

const deleteQuestionRouter = Router();

deleteQuestionRouter.delete('/delete/:_id', deleteQuestion);

export default deleteQuestionRouter;