import { Router } from "express";
import dotenv from 'dotenv';
import { getTriviaTable, getTriviaTables, updateTriviaTable, deleteTriviaTable, deleteQuestion, createTriviaTable } from "../controllers/Trivia.controller";

dotenv.config();

const TriviaRouter = Router();

TriviaRouter.get('/user/:userId', getTriviaTables);
TriviaRouter.get('/:id', getTriviaTable);
TriviaRouter.post('/', createTriviaTable);
TriviaRouter.put('/:id', updateTriviaTable);
TriviaRouter.delete('/:id', deleteTriviaTable);
TriviaRouter.delete('/:id/question/:questionId', deleteQuestion);

export default TriviaRouter;