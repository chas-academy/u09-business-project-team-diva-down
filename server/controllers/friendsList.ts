import { Request, Response } from "express";
import { User } from "../models/User.model";
import { FriendRelationship } from "../models/friend.model";

export const getFriends = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        const friends = await FriendRelationship.find({
            user: userId,
            status: 'accepted'
        }).populate('friend', 'name email eloScore');

        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: "Error getting friends", error });
    }
};