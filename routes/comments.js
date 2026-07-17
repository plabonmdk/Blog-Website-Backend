import express from 'express'
import { isAdmin } from '../middleware/isAdmin.js'
import AddComment from '../controllers/comment.js'


const CommentsRoutes = express.Router()

CommentsRoutes.post('/addComment', isAdmin , AddComment )


export default CommentsRoutes