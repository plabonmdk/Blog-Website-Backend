import UserModel from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import crypto from "crypto";
import nodemailer from "nodemailer";


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

    // Normalize email 
    const normalizedEmail = email.trim().toLowerCase();

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
      res.cookie("token", token, {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 3 * 24 * 60 * 60 * 1000,
});
      res.status(200).json({success:true,message:"Login successfully" , user:FindUser,token})
    }catch(error){
     
      return res.status(500).json({success:false , message: "Internal server error"})
    }
}

// logout

const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Profile

const Profile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("-password");

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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Get All Users
const GetUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Delete User
const DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await UserModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Update Profile
const UpdateProfile = async (req, res) => {
  try {
    const { FullName, phone, location, about } = req.body;

    // Find logged-in user
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    if (FullName !== undefined) {
      user.FullName = FullName.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    if (location !== undefined) {
      user.location = location.trim();
    }

    if (about !== undefined) {
      user.about = about.trim();
    }

    // Update profile image
    if (req.file) {
      user.imagePath = req.file.filename;
    }

    await user.save();

    // Don't send password
    const updatedUser = await UserModel.findById(req.userId).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Forgot Password
const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const user = await UserModel.findOne({
      email: normalizedEmail,
    });

    // User doesn't exist
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving to database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token valid for 15 minutes
    const resetPasswordExpire = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Save reset token
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpire: resetPasswordExpire,
        },
      }
    );

    // Frontend reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("EMAIL_USER or EMAIL_PASS is missing in .env");

      return res.status(500).json({
        success: false,
        message: "Email configuration is missing",
      });
    }

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify Gmail connection
    await transporter.verify();

    // Send email
    await transporter.sendMail({
      from: `"BlogSphere" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "BlogSphere - Reset Password",

      html: `
        <div style="
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          font-family: Arial, sans-serif;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #ffffff;
        ">

          <h2 style="color: #2563eb;">
            Reset Your Password
          </h2>

          <p>
            Hello ${user.FullName || "User"},
          </p>

          <p>
            We received a request to reset your BlogSphere password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${resetUrl}"
              style="
                background: #2563eb;
                color: white;
                padding: 12px 25px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
                font-weight: bold;
              "
            >
              Reset Password
            </a>
          </div>

          <p>
            This link will expire in
            <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request this password reset,
            please ignore this email.
          </p>

          <hr />

          <p style="color: #777;">
            BlogSphere Team
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });

  } catch (error) {
    console.log("=================================");
    console.log("Forgot Password Error:", error);
    console.log("Error Message:", error.message);
    console.log("Error Code:", error.code);
    console.log("=================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to send password reset email",
    });
  }
};


// Reset Password


const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Check token
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    // Check password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: new Date(),
      },
    });

    // Token invalid/expired
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update only required fields
    await UserModel.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpire: null,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.log("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




export {Register , Login , Logout , Profile , DeleteUser ,GetUsers , ForgotPassword , ResetPassword , UpdateProfile};