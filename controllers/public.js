import PostModel from "../models/Blog.js";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

// Single Post
const GetSinePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const FindPost = await PostModel.findById(postId).populate({
      path: "comments",
      populate: {
        path: "userId",
      },
    });

    if (!FindPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not Found",
      });
    }

    return res.status(200).json({
      success: true,
      post: FindPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Logged In User
const GetMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECREATE);

    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { GetSinePost, GetMe };