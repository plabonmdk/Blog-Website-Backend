import express from 'express'
import { GetSinePost } from '../controllers/public.js'


const PublicRoutes= express.Router()

PublicRoutes.get('/singlePost/:id' , GetSinePost)


export default PublicRoutes