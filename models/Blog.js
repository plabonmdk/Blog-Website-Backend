import mongoose from "mongoose";


const PostSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    desc:{
        type:String,
        required:true
    },

    image:{
        type:String
    },


    // Total Views Count
    views:{
  type:Number,
  default:0
},


    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]

},{timestamps:true});



const PostModel = mongoose.model("posts", PostSchema);


export default PostModel;