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
exports.sendFriendRequest = void 0;
const User_model_1 = require("../models/User.model");
const friend_model_1 = require("../models/friend.model");
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, friendId } = req.body;
        const [user, friend] = yield Promise.all([
            User_model_1.User.findById(userId),
            User_model_1.User.findById(friendId)
        ]);
        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingRelationship = yield friend_model_1.FriendRelationship.findOne({
            user: userId,
            friend: friendId
        });
        if (existingRelationship) {
            return res.status(400).json({
                message: "Friend request already exists",
                status: existingRelationship.status
            });
        }
        const relationship = new friend_model_1.FriendRelationship({
            user: userId,
            friend: friendId,
            status: 'pending'
        });
        yield relationship.save();
        res.status(201).json({
            message: "Friend request sent successfully",
            relationship
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error sending friend request", error });
    }
});
exports.sendFriendRequest = sendFriendRequest;
