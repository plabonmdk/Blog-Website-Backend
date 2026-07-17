import PostModel from "../models/Blog.js"



const GetSinePost=async(req, res) => {
    try{
        const postId= req.params.Id
        const FindPost = await PostModel.findById(postId)
        .populate({
            path:'comments',
            populate:{
                path:'userId'
            }
        })

        if(!FindPost){
            return res.status(404).json({success:false , message: "Blog post not Found"})
        }
        return res.status(500).json({success:true ,post:FindPost})
    }catch(error){
        return res.status(500).json({success:false , message: "Internal server error"})
    }
}

export {GetSinePost}