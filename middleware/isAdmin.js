import jwt from 'jsonwebtoken'
import UserModel from '../models/user.js'



const isAdmin = async (req, res, next)=> {
    try{
        const token = req.cookies.token
        
        if(!token){
            return res.status(401).json({message:'Unauthorized : no token provided'})
        }
        const decoded= jwt.verify(token,process.env.JWT_SECREATE)
        const user= await UserModel.findById(decoded.userId)
        if (!user) {
            return res.status(403).json({success: false, message:'Unauthorized : User not found'})
        }
        if (user.role != "admin") {
            return res.status(403).json({success: false, message:'Unauthorized : User not an Admin'})
        }
        next()
    }catch(error){
        return res.status(500).json({success:false , message: "Internal server error"})
    }
}

const isLogin= async(req , res) => {
    try{
        const token = req.cookies.token
        
        if(!token){
            return res.status(401).json({message:'Unauthorized : no token provided'})
        }
        const decoded= jwt.verify(token,process.env.JWT_SECREATE)
        const user= await UserModel.findById(decoded.userId)
        if (!user) {
            return res.status(403).json({success: false, message:'Unauthorized : User not found'})
        }
        req.user=user
        next()
    }catch(error){
        return res.status(500).json({success:false , message: "Internal server error"})
    }
}


export {isAdmin ,isLogin}