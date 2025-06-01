import { Router } from "express";
import { updateQuestion } from "../controllers/updateQuestion";
import dotenv from 'dotenv';

dotenv.config();

const updateQuestionRouter = Router();

updateQuestionRouter.put('/update/:_id', updateQuestion);

export default updateQuestionRouter;