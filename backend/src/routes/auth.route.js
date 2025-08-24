import express from "express";
import { login, logout, onboard, signup } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/logout", logout)
router.post("/login", login)
router.post("/signup", signup)

router.post("/onbording",protectRoute,onboard)

// forgot password
// send reset email password

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;

