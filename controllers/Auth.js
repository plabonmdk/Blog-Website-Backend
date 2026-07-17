import UserModel from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"


// register
const Register = async (req, res) => {
  try {
    const { FullName, email, password } = req.body;

    // Validation
    if (!FullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existUser = await UserModel.findOne({ email });

    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Image filename
    const imagePath = req.file ? req.file.filename : "";

    // Hash Password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = await UserModel.create({
      FullName,
      email,
      password: hashedPassword,
      imagePath,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// login

const Login = async (req,res) => {
    try{
      const {email, password}=req.body;
      if(!email || !password) {
        return res.status(400).json({success:false , message: "All fields are required"})
      }
      const FindUser = await UserModel.findOne({email})
      if (!FindUser) {
        return res.status(400).json({success:false , message: "No User found please Register "})

      }
      const comparePassword = await bcryptjs.compare(password,FindUser.password)
      if (!comparePassword) {
        return res.status(400).json({success:false , message: "Invalid Password "})

      }
      const token= jwt.sign({userId:FindUser._id},process.env.JWT_SECREATE)
      res.cookie('token',token,{
        httpOnly: true,
        secure: false,
        maxAge: 3 * 24 * 60 * 60 * 1000
      })
      res.status(200).json({success:true,message:"Login successfully" , user:FindUser,token})
    }catch(error){
     
      return res.status(500).json({success:false , message: "Internal server error"})
    }
}

// logout

const Logout = async (req,res) => {
  try{
    res.clearCookie("token")
    res.status(200).json({success:true,message:"Logout successfully"})
  }catch(error){
    console.log(error)
      return res.status(500).json({success:false , message: "Internal server error"})
  }
}

export {Register , Login , Logout};