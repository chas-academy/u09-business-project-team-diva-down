import { Router } from "express";
import { loginUser } from "../controllers/login";
import dotenv from 'dotenv';

dotenv.config();

const loginRouter= Router();

loginRouter.post('/login', loginUser);

export default loginRouter;