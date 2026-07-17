import express from 'express'
import { isAdmin } from '../middleware/isAdmin.js'
import { GetallData, GetUser, UserDelete } from '../controllers/Dashboard.js'


const DashboardRoutes= express.Router()

DashboardRoutes.get('/',isAdmin,GetallData)
DashboardRoutes.get('/users',isAdmin, GetUser)
DashboardRoutes.delete('/deleteUsers/:id',isAdmin, UserDelete)

export default DashboardRoutes