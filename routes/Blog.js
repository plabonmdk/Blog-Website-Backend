import express from 'express'
import { Create, DeletePost, GetPosts, GetSinglePost, Update } from '../controllers/Blog.js';
import { isAdmin } from '../middleware/isAdmin.js';
import upload from '../middleware/multer.js';



const BlogsRoutes = express.Router()

BlogsRoutes.post('/create',isAdmin,upload.single('postimage'),Create)
BlogsRoutes.delete('/delete/:id',isAdmin,DeletePost)
BlogsRoutes.get('/getposts',GetPosts)
BlogsRoutes.patch('/update/:id',isAdmin,upload.single('postimage') , Update)
BlogsRoutes.get("/post/:id", GetSinglePost);




export default BlogsRoutes;