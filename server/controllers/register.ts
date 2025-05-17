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

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
        });

        await newUser.save()
    } catch(error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Failed to register new user" });
    }
}

export {registerNewUser}