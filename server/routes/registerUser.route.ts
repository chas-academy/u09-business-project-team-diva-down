import { Router } from "express";
import { registerNewUser } from "../controllers/register";
import dotenv from 'dotenv';

dotenv.config();

const routerRegister = Router();

routerRegister.post('/register', registerNewUser);

export default routerRegister;