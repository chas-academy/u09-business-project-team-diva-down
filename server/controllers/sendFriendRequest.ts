import { Request, Response } from "express";
import { User } from "../models/User.model";
import { FriendRelationship } from "../models/friend.model";

export const sendFriendRequest = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, friendId } = req.body;

        const [user, friend] = await Promise.all([
            User.findById(userId),
            User.findById(friendId)
        ]);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingRelationship = await FriendRelationship.findOne({
            user: userId,
            friend: friendId
        });

        if (existingRelationship) {
            return res.status(400).json({ 
                message: "Friend request already exists",
                status: existingRelationship.status
            });
        }

        const relationship = new FriendRelationship({
            user: userId,
            friend: friendId,
            status: 'pending'
        });

        await relationship.save();

        res.status(201).json({
            message: "Friend request sent successfully",
            relationship
        });
    } catch (error) {
        res.status(500).json({ message: "Error sending friend request", error });
    }
};
