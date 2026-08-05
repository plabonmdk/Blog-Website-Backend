import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import DBCon from "./utlis/db.js";
import AuthRoutes from "./routes/Auth.js";
import cookieParser from "cookie-parser";
import BlogsRoutes from "./routes/Blog.js";
import DashboardRoutes from "./routes/Dashboard.js";
import CommentsRoutes from "./routes/comments.js";
import PublicRoutes from "./routes/Public.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "https://blog-website-frontend-five.vercel.app",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connect
DBCon();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", AuthRoutes);
app.use("/blog", BlogsRoutes);
app.use("/dashboard", DashboardRoutes);
app.use("/comment", CommentsRoutes);
app.use("/public", PublicRoutes);
export default app;