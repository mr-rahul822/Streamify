import express from "express";


import { protectRoute } from "../middleware/auth.middleware.js";
import {
        getRecommendedUsers,
        getMyFriends,
        sendFriendRequest,
        acceptFriendRequest,
        getFriendRequests,
        getOutgoingFriendReqs,
        getProfile,
        updateProfile
} from "../controllers/user.controllers.js";
const router = express.Router();


router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.post("/friend-request", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest)
// reject friend request


router.get("/friend-request", getFriendRequests)
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;


