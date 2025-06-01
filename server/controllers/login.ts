import { User } from "../models/User.model";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';

export async function loginUser(req: Request, res: Response): Promise<any> {
    try {
        console.log('Login request received');
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        return res.status(200).json({ 
            message: 'Login successful', 
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
