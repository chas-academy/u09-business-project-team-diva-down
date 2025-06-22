import { Request, Response } from "express";
import { User } from "../models/User.model";
import mongoose, { Types } from "mongoose";
import bcrypt from 'bcryptjs';

export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ _id: "_id params is required! "});
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const user = await User.findOne({ _id: new Types.ObjectId(userId) }).select('-password');

        if (!user) {
            res.status(404).json({ message: 'No user found with that ID' });
            return;
        }
        res.json(user);

    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err});
        return;
    }
}

export const getAllusers = async (req: Request, res: Response): Promise<any> => {
    try {

        const allUsers = await User.find({}).select('-password');

        if (!allUsers || allUsers.length === 0) {
            return res.status(404).json({ message: 'No users found!' });
        }

        res.status(200).json(allUsers);

    } catch (err) {
        res.status(500).json({ message: "Error fetch All users", error: err});
        return;
    }
}

const saltRounds = 10;

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ _id: "_id params is required!" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No data submitted!" });
        }

        const user = await User.findOne({ _id: new Types.ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'No user found with that ID' });
        }

        const { name, email, password, eloScore, wins, total_matches } = req.body;

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (password !== undefined) {
            const newHashedPassword = await bcrypt.hash(password, saltRounds);
            user.password = newHashedPassword;
        }
        if (eloScore !== undefined) user.eloScore = Number(eloScore);
        if (wins !== undefined) user.wins = Number(wins);
        if (total_matches !== undefined) user.total_matches = Number(total_matches);

        const updatedUser = await user.save();

        const userToReturn = updatedUser.toObject();
        delete userToReturn.password;

        return res.status(200).json({
            message: "Updated user successfully!",
            user: userToReturn
        });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ 
            message: "Failed to update user",
            error
        });
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ _id: "_id params is required! "});
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const user = await User.findOne({ _id: new Types.ObjectId(userId) });

        if (!user) {
            res.status(404).json({ message: "No User found with that ID!" });
            return;
        }

        await user.deleteOne();
        res.status(200).json({ message: "User has been deleted", user });
        return;

    } catch (err) {
        res.status(500).json({ message: "Failed to Update User", error: err});
        return;
    }
}