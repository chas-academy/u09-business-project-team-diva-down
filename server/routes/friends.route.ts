import express  from "express";
import { sendFriendRequest } from "../controllers/sendFriendRequest";
import { getPendingRequests } from "../controllers/pendingFriends";
import { acceptFriendRequest } from "../controllers/acceptFriend";
import { getFriends } from "../controllers/friendsList";

const friendRouter = express.Router()

friendRouter.post("/request", sendFriendRequest);
friendRouter.post("/accept", acceptFriendRequest);
friendRouter.get("/:userId", getFriends);
friendRouter.get("/pending/:userId", getPendingRequests);

export default friendRouter;