import { Request, Response } from "express";
import { User } from "../models/User.model";
import { FriendRelationship } from "../models/friend.model";

export const acceptFriendRequest = async (req: Request, res: Response): Promise<any> => {
    try {
        const { relationshipId } = req.body;

        const relationship = await FriendRelationship.findById(relationshipId);

        if (!relationship) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (relationship.status !== 'pending') {
            return res.status(400).json({ message: "Friend request is not pending" });
        }

        relationship.status = 'accepted';
        await relationship.save();

        const reciprocalRelationship = new FriendRelationship({
            user: relationship.friend,
            friend: relationship.user,
            status: 'accepted'
        });
        await reciprocalRelationship.save();

        res.status(200).json({
            message: "Friend request accepted",
            relationship
        });
    } catch (error) {
        res.status(500).json({ message: "Error accepting friend request", error });
    }
};