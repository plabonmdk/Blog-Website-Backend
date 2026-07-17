import express from "express";
import dotenv from "dotenv";
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

app.use(cookieParser())
app.use(express.static('public'))
// Middleware
app.use(express.json());

// MongoDB Connect
DBCon();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth",AuthRoutes)
app.use('/blog',BlogsRoutes)
app.use('/dashboard' , DashboardRoutes)
app.use('/comment' , CommentsRoutes)
app.use('/public' , PublicRoutes)

app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});