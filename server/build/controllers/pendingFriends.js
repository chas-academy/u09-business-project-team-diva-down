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
exports.getPendingRequests = void 0;
const friend_model_1 = require("../models/friend.model");
const getPendingRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const requests = yield friend_model_1.FriendRelationship.find({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error getting pending requests", error });
    }
});
exports.getPendingRequests = getPendingRequests;
