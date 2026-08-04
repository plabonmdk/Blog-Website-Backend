import express from "express";
import { isAdmin } from "../middleware/isAdmin.js";
import {
  GetallData,
  GetUser,
  UserDelete,
} from "../controllers/Dashboard.js";

const DashboardRoutes = express.Router();

// Dashboard Statistics
DashboardRoutes.get("/", isAdmin, GetallData);

// All Users
DashboardRoutes.get("/users", isAdmin, GetUser);

// Delete User
DashboardRoutes.delete("/users/:id", isAdmin, UserDelete);

export default DashboardRoutes;