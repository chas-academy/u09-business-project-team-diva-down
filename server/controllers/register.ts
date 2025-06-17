import { User } from "../models/User.model";
import { Request, Response } from "express";
import bcrypt from 'bcryptjs'

const saltRounds = 10;

async function registerNewUser(req: Request, res: Response): Promise<any> {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({message: "Missing required fields"});
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const eloScore = 0;

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            eloScore: eloScore
        });

        await newUser.save();

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                eloScore: newUser.eloScore
            }
        });
        
    } catch(error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Failed to register new user" });
    }
}

export {registerNewUser}