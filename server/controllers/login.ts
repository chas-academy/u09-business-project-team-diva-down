import { User } from "../models/User.model";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
        
        
        const token = jwt.sign(
            { id: user.id.toString() }, 
            process.env.JWT_SECRET!,
            { expiresIn: '86400s' }
        );

        console.log("Generated Token: ", token);

        // // Decode the token to get the expiration time
        // const decoded = jwt.decode(token) as { id: string; exp: number } | null;

        // if (decoded && decoded.exp) {
        //     // Get current time in seconds
        //     const nowInSeconds = Math.floor(Date.now() / 1000);
            
        //     // Calculate remaining time in seconds
        //     const timeLeftInSeconds = decoded.exp - nowInSeconds;
            
        //     // Convert to hours, minutes, seconds for better readability
        //     const hours = Math.floor(timeLeftInSeconds / 3600);
        //     const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
        //     const seconds = timeLeftInSeconds % 60;
        
        // console.log(`Token expires in: ${hours}h ${minutes}m ${seconds}s`);
        // } else {
        // console.log("Could not decode token or no expiration set");
        // }

        return res.status(200).json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}
