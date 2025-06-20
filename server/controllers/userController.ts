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