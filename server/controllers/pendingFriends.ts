import { Request, Response } from "express";
import { User } from "../models/User.model";
import { FriendRelationship } from "../models/friend.model";

const getPendingRequests = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        const requests = await FriendRelationship.find({
            friend: userId,
            status: 'pending'
        }).populate({
            path: 'user',
            select: 'name email eloScore'
        })
        .populate({
            path: 'friend',
            select: 'name email eloScore'
        });

        res.status(200).json(requests);
    } catch (error) {
        console.error("GET PENDING REQUESTS ERROR", error);
        res.status(500).json({ message: "Error getting pending requests", error });
    }
};

export { getPendingRequests };