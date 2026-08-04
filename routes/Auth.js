import express from "express";
import { DeleteUser, ForgotPassword, GetUsers, Login, Logout, Profile, Register, ResetPassword, UpdateProfile,   } from "../controllers/Auth.js";
import upload from "../middleware/multer.js";
import { isAdmin, isLogin } from "../middleware/isAdmin.js";




const AuthRoutes = express.Router();

AuthRoutes.post(
  "/register",
  upload.single("profile"),
  Register
);

AuthRoutes.post("/login",Login);
AuthRoutes.post('/logout',Logout)
AuthRoutes.get("/profile",isLogin , Profile);
AuthRoutes.patch("/profile/update",isLogin,upload.single("profile"),UpdateProfile);
AuthRoutes.get("/users", isAdmin, GetUsers);

AuthRoutes.delete("/user/:id", isAdmin, DeleteUser);
AuthRoutes.post("/forgot-password",ForgotPassword);
AuthRoutes.post("/reset-password/:token",ResetPassword);


export default AuthRoutes;