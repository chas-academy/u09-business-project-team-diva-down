import { Request, Response } from "express";
import { User } from "../models/User.model";
import mongoose, { Types } from "mongoose";

export const getUser = async (req: Request, res: Response): Promise<any> => {
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

export const updateUser = async (req: Request, res: Response): Promise<any> => {
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
            res.status(404).json({ message: 'No user found with that ID' });
            return;
        }

        const { name, email, password, eloScore, wins, total_matches } = req.body

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        user.eloScore = eloScore || user.eloScore;
        user.wins = wins || user.wins;
        user.total_matches = total_matches || user.total_matches;

        await user.save();
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ message: "Failed to Update User", error: err});
        return;
    }
}