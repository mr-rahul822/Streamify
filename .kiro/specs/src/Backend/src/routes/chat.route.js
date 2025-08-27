import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controllers.js";

const router =  express.Router();

router.get("/token" , protectRoute, getStreamToken)

export default router;



// try after complete this project addding a ai video tuttor 