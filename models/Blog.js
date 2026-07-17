import mongoose from "mongoose";



const PostSchema = new mongoose.Schema({
    title:{
        type:String
    },
    desc:{
        type:String
    },
    image:{
        type:String
    },
    comments: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment", 
  },
],
},{timestamps:true})

const PostModel = mongoose.model('posts',PostSchema)


export default PostModel