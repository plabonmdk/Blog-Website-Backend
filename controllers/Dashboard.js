import PostModel from "../models/Blog.js";
import UserModel from "../models/user.js";
import CommentModel from "../models/comments.js";
import fs from "fs";
import path from "path";




const GetallData = async (req, res) => {
  try {

    const Users = await UserModel.find().select("-password");

    const Posts = await PostModel.find();

    const Comments = await CommentModel.find();



    return res.status(200).json({
      success: true,

      totalUsers: Users.length,

      totalPosts: Posts.length,

      totalComments: Comments.length,


      Users,
      Posts,
      Comments,

    });


  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};





const GetUser = async (req, res) => {
  try {

    const Users = await UserModel.find().select("-password");


    return res.status(200).json({
      success: true,
      totalUsers: Users.length,
      Users,
    });


  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }
};





const UserDelete = async (req, res) => {
  try {

    const userId = req.params.id;


    const ExistUser = await UserModel.findById(userId);


    if (!ExistUser) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }



    if (ExistUser.role === "admin") {

      return res.status(403).json({
        success: false,
        message: "Sorry! Admin account can't be deleted.",
      });

    }



    if (ExistUser.imagePath) {

      const imagePath = path.join(
        "public",
        "images",
        ExistUser.imagePath
      );


      if (fs.existsSync(imagePath)) {

        await fs.promises.unlink(imagePath);

      }

    }



    await UserModel.findByIdAndDelete(userId);


    return res.status(200).json({
      success:true,
      message:"User deleted successfully",
    });



  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success:false,
      message:"Internal server error",
    });

  }
};



export {
  GetallData,
  GetUser,
  UserDelete
};