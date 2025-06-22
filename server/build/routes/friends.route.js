"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sendFriendRequest_1 = require("../controllers/sendFriendRequest");
const pendingFriends_1 = require("../controllers/pendingFriends");
const acceptFriend_1 = require("../controllers/acceptFriend");
const friendsList_1 = require("../controllers/friendsList");
const friendRouter = express_1.default.Router();
friendRouter.post("/request", sendFriendRequest_1.sendFriendRequest);
friendRouter.post("/accept", acceptFriend_1.acceptFriendRequest);
friendRouter.get("/:userId", friendsList_1.getFriends);
friendRouter.get("/pending/:userId", pendingFriends_1.getPendingRequests);
exports.default = friendRouter;
