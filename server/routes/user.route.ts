import { Router } from "express";
import { loginUser } from "../controllers/login";
import dotenv from 'dotenv';
import { getUser, updateUser } from "../controllers/userController";
import { getAllusers } from "../controllers/userController";

dotenv.config();

const userRouter = Router();

userRouter.get('/:userId', getUser);
userRouter.get('/', getAllusers);
userRouter.put('/:userId', updateUser);

export default userRouter;