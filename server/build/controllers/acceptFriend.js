"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriendRequest = void 0;
const friend_model_1 = require("../models/friend.model");
const acceptFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { relationshipId } = req.body;
        const relationship = yield friend_model_1.FriendRelationship.findById(relationshipId);
        if (!relationship) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        if (relationship.status !== 'pending') {
            return res.status(400).json({ message: "Friend request is not pending" });
        }
        relationship.status = 'accepted';
        yield relationship.save();
        const reciprocalRelationship = new friend_model_1.FriendRelationship({
            user: relationship.friend,
            friend: relationship.user,
            status: 'accepted'
        });
        yield reciprocalRelationship.save();
        res.status(200).json({
            message: "Friend request accepted",
            relationship
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error accepting friend request", error });
    }
});
exports.acceptFriendRequest = acceptFriendRequest;
