import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";


import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import chatRoute from "./routes/chat.route.js"
import communityRoutes from "./routes/community.Routes.js";
import { ConnectDB } from "./lib/db.js";


const app = express();
const __dirname = path.resolve();
app.use(cors({
    origin: "http://localhost:5173",
    credentials : true,
}));

app.use(express.json());
app.use(cookieParser())
const PORT = process.env.PORT;
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/chat",chatRoute)
app.use("/api/communities", communityRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../frontend/dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  ConnectDB();
});