import CommentModel from "../models/comments.js"
import PostModel from "../models/Blog.js"


const AddComment= async(req, res) => {
    try{
        const {postId,userId,comment}=req.body


        const newComment = new CommentModel({
            postId,userId,comment
        })
        await newComment.save()

        const existPost =await PostModel.findById(postId)
        if(!existPost){
            res.status(200).json({success:false,message:"Blog post not found" })
        }
        existPost.comments.push(newComment._id)
        await existPost.save()
        res.status(200).json({success:true,message:"Comments added successfully" , comment: newComment })

    }catch(error){
        res.status(500).json({success:true,message:"Internal server error"})

    }
}

export default AddComment