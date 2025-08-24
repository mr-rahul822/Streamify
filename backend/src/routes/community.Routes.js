import express from "express";
import {
  createCommunity,
  joinCommunity,
  leaveCommunity,
  getAllCommunities,
  getCommunityById,
  joinCommunityChannel
} from "../controllers/community.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// @route POST /api/communities
router.post("/", protectRoute, createCommunity);

// @route POST /api/communities/:id/join
router.post("/:id/join", protectRoute, joinCommunity);

// @route POST /api/communities/:id/leave
router.post("/:id/leave", protectRoute, leaveCommunity);

// @route GET /api/communities
router.get("/", protectRoute, getAllCommunities);

// @route GET /api/communities/:id
router.get("/:id", protectRoute, getCommunityById);

// @route POST /api/communities/:id/join-channel
router.post("/:id/join-channel", protectRoute, joinCommunityChannel);


// Single file upload (field name = coverImage)
router.post(
  "/create",
  protectRoute,
  upload.single("coverImage"),
  createCommunity
);

export default router;
