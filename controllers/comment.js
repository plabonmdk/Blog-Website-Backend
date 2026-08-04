import CommentModel from "../models/comments.js";
import PostModel from "../models/Blog.js";


// Add Comment
const AddComment = async (req, res) => {
  try {

    const { postId, comment } = req.body;


    if (!postId || !comment) {
      return res.status(400).json({
        success: false,
        message: "Post id and comment are required"
      });
    }


    const newComment = new CommentModel({
      postId,
      userId: req.userId,
      comment
    });


    await newComment.save();



    const existPost = await PostModel.findById(postId);


    if (!existPost) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found"
      });
    }



    existPost.comments.push(newComment._id);

    await existPost.save();



    res.status(201).json({
      success: true,
      message: "Comments added successfully",
      comment: newComment
    });



  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};





// Get All Comments By Post ID
const GetComments = async (req, res) => {

  try {

    const { id } = req.params;


    const comments = await CommentModel.find({
      postId: id
    })
    .populate("userId", "FullName email imagePath")
    .sort({
      createdAt: -1
    });



    res.status(200).json({

      success: true,
      comments

    });



  } catch (error) {


    res.status(500).json({

      success:false,
      message:error.message

    });


  }

};



export { AddComment, GetComments };