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
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  const indexPath = path.join(frontendPath, "index.html");

  console.log("Serving frontend from:", frontendPath);
  console.log("Index file path:", indexPath);
  console.log("Current directory:", process.cwd());
  console.log("__dirname:", __dirname);

  // Check if the directory exists
  import('fs').then(fs => {
    try {
      const stats = fs.statSync(frontendPath);
      console.log("Frontend dist directory exists:", stats.isDirectory());
    } catch (err) {
      console.error("Frontend dist directory does not exist:", err.message);
    }

    try {
      const stats = fs.statSync(indexPath);
      console.log("Index.html exists:", stats.isFile());
    } catch (err) {
      console.error("Index.html does not exist:", err.message);
    }
  });

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(indexPath);
  });
}
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
  ConnectDB();
});