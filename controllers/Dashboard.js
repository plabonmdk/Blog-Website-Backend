import PostModel from "../models/Blog.js"
import UserModel from "../models/user.js"
import fs from 'fs'
import path from "path";




const GetallData= async(req ,res) => {
    try{
        const Users = await UserModel.find()
        const Posts= await PostModel.find()

        // comment wiil be get here
        if(!Users && !Posts){
            return res.status(404).json({success:false , message: "Not Data Found"})
        }
        return res.status(500).json({success:true , Users , Posts})
    }catch(error){
        return res.status(500).json({success:false , message: "Internal server error"}) 
    }
}

const GetUser = async(req , res) => {
   try{
        const Users = await UserModel.find()
        

        
        if(!Users){
            return res.status(404).json({success:false , message: "Not Data Found"})
        }
        return res.status(500).json({success:true , Users})
    }catch(error){
        return res.status(500).json({success:false , message: "Internal server error"}) 
    }
}

// delete

const UserDelete = async(req , res) => {
   try{
        const userId = req.params.id
        const ExistUser=await UserModel.findById(userId)
        

        
        if(!ExistUser){
            return res.status(404).json({success:false , message: "Not Data Found"})
        }
        if(ExistUser.role == "admin"){
            return res.status(404).json({success:false, message: "Soory your Admin you can't Delete you Account"})
        }
        if(ExistUser.profile){
                    const profilePath= path.join('public/images', ExistUser.profile)
                    fs.promises.unlink(profilePath)
                    .then(()=> console.log("post image deleted"))
                    .catch(error => console.log("error deleting post image"))
                }

        const deleteUsers= await UserModel.findByIdAndDelete(userId)
        return res.status(500).json({success:true ,message: "User Deleted Successfully",user:deleteUsers})
    }catch(error){
        return res.status(500).json({success:false , message: "Internal server error"}) 
    }
}
export {GetallData , GetUser , UserDelete}