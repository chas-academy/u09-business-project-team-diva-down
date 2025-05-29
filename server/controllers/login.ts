import { User } from "../models/User.model";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'

async function loginUser(req: Request, res: Response): Promise<any> {
    try {
        console.log('Login request received');
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Username and password required'});
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({message: 'Invalid username or password'});
        }

        const PasswordValid = await bcrypt.compare(password, user.password);

        if(!PasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch {
        
    }
}