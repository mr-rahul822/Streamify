import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import communityRoutes from "./routes/community.Routes.js";
import { ConnectDB } from "./lib/db.js";

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Serve uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRoute);
app.use("/api/communities", communityRoutes);

// ✅ Only if frontend dist is bundled with backend
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(process.cwd(), "../frontend/dist");
  const indexPath = path.join(frontendPath, "index.html");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  ConnectDB();
});
