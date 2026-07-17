import { error, log } from "console";
import PostModel from "../models/Blog.js"
import fs from 'fs'
import path from "path";
// create blog

const Create = async(req,res) => {
    try{
        const {title,desc}=req.body;
        const imagePath = req.file ? req.file.filename : "";
        const CreateBlog= new PostModel({
            title,
            desc,
            image:imagePath
        })
        await CreateBlog.save()
        return res.status(200).json({success: true,message: "Post Created successfully",post:CreateBlog});
    }catch(error){
       
      return res.status(500).json({success:false , message: "Internal server error"})
    }
}

// delete blog

const DeletePost = async(req, res)=> {
    try{
        const postId= req.params.id

        const FindPost = await PostModel.findById(postId)
        if(!FindPost){
            return res.status(404).json({success:false , message: "Post not found"})
        }
        if(FindPost.image){
            const profilePath= path.join('public/images', FindPost.image)
            fs.promises.unlink(profilePath)
            .then(()=> console.log("post image deleted"))
            .catch(error => console.log("error deleting post image"))
        }
        const DeletePost= await PostModel.findByIdAndDelete(postId)
        return res.status(200).json({success:true , message: "Post Deleted Successfully",post:DeletePost})
    }catch(error){
        return res.status(500).json({success:false , message: "Internal server error"})
    }
}

// get post

const GetPosts = async (req , res) => {
    try{
        const posts = await PostModel.find()
        if(!posts){
           return res.status(404).json({success:false , message: "Post not Found"}) 
        }
        return res.status(200).json({success:true,posts})
    }catch(error){
       return res.status(500).json({success:false , message: "Internal server error"}) 
    }
}


// update blog

const Update= async (req, res) => {
    try{
        const {title,desc} = req.body;
        const postId=req.params.id;

        const postUpdate = await PostModel.findById(postId)
        if(!postUpdate){
          return res.status(404).json({success:false , message: "Post not Found"})   
        }
        if(title){
            postUpdate.title=title
        }
        if(desc){
            postUpdate.desc=desc
        }
        if(req.file){
            postUpdate.image=req.file.filename
        }
        await postUpdate.save()
         return res.status(200).json({success:true,message:'Post Updated successfully',posts:postUpdate})
    }catch(error){
       return res.status(500).json({success:false , message: "Internal server error"}) 
    }
}

export {Create , DeletePost , GetPosts , Update}