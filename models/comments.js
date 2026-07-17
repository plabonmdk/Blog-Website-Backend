import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"posts",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    comment:{
        type:String,
        
        required:true
    },
},{timestamps:true})

const CommentModel = mongoose.model('Comment', commentSchema)

export default CommentModel