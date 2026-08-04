import express from 'express'
import { GetMe, GetSinePost } from '../controllers/public.js'


const PublicRoutes= express.Router()

PublicRoutes.get('/singlePost/:id' , GetSinePost)
PublicRoutes.get("/me", GetMe);


export default PublicRoutes