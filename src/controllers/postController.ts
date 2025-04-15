import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import Post from "../models/Post";
import User from "../models/User";
import { Types } from "mongoose";

//create new post
export const createPostController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body, req.files);
        //check for the fields
        if (!req?.body?.title || !req?.body?.description || !req?.body?.category) {
            throw createHttpError(400, "All fields are required");
        }

        //upload image to cloudinary if image is present
        if (req.files && req.files.image) {
            const image = req.files.image;

            if (Array.isArray(image)) {
                throw createHttpError(400, "Only one image is allowed"); // or handle multiple uploads
            }

            const uploadResponse = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "article-hub/posts",
                
            });
            req.body.image = uploadResponse.secure_url;
        }

        //create post
        const newPost = new Post({author: req?.user?.userID ,...req.body});
        const savedPost = await newPost.save();

        //send response
        res.status(201).json({ success: true, message: "Post created successfully", data: savedPost });

    } catch (error) {
        next(error);
    }
};


//get the details of a post
export const getPostDetailsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", [
      "-password",
      "-email",
      "-mobile"
    ]);

    if (!post) {
      throw createHttpError(404, "Post not found");
    }

    const isMine = post.author._id.toString() === req?.user?.userID;

    // Convert the post to a plain JS object
    const postObject = post.toObject() as typeof post & { isLiked?: boolean };

    postObject.isLiked = false;
    console.log(postObject?.likes)

    // check if I have liked the post
    if (postObject?.likes?.some((like: Types.ObjectId) => like.equals(req?.user?.userID))) {
        postObject.isLiked = true;
    }

    return res.status(200).json({
      success: true,
      message: "Post details fetched successfully",
      data: {
        ...postObject,
        edit: isMine,
        delete: isMine
      }
    });
  } catch (error) {
    next(error);
  }
};


//update a post
export const updatePostController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params?.postID,
            { $set: { ...req.body } },
            { new: true } // <- this returns the updated document
        );

        if (!updatedPost) {
            throw createHttpError(404, "Post not found");
        }

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            data: updatedPost
        });
    } catch (error) {
        next(error);
    }
};


//delete a post
export const deletePostController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params?.postID);
        if (!deletedPost) {
            throw createHttpError(404, "Post not found");
        }
        res.status(200).json({ success: true, message: "Post deleted successfully"});
    } catch (error) {
        next(error);
    }
};

//like or unlike a post
export const likePostController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //check if the user has already liked the post
        const post = await Post.findById(req.params?.postID);
        if (!post) {
            throw createHttpError(404, "Post not found");
        }

        //check if the user has already liked the post
        if (post?.likes?.includes(req?.user?.userID)) {
            const updatedPost = await Post.findByIdAndUpdate(req.params?.postID, { $pull: { likes: req?.user?.userID } }, { new: true });
            res.status(200).json({ success: true, message: "Post unliked successfully", data: updatedPost });
        } else {
            const updatedPost = await Post.findByIdAndUpdate(req.params?.postID, { $push: { likes: req?.user?.userID } }, { new: true });
            res.status(200).json({ success: true, message: "Post liked successfully", data: updatedPost }); 
        }
    } catch (error) {
        next(error);
    }
}

//get all the posts of a user
export const getAllPostsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({ author: req?.user?.userID });
        res.status(200).json({ success: true, message: "Posts fetched successfully", data: posts });
    } catch (error) {
        next(error);
    }
}

//get feed
export const getFeedController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const interests = await User.findById(req?.user?.userID).select("interests");
        console.log(interests?.interests);

        //get all the posts based on the interests array
        const posts = await Post.find({ category: { $in: interests?.interests } }).populate("author", [ "-password",  "-email", "-mobile"]);
        console.log(posts)
        res.status(200).json({ success: true, message: "Posts fetched successfully", data: posts });
    } catch (error) {
        next(error);
    }
}

//get all the posts of a specific user
export const getMyPostsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find({ author: req?.user?.userID }).populate("author", [ "-password",  "-email", "-mobile"]);
        res.status(200).json({ success: true, message: "Posts fetched successfully", data: posts });
    } catch (error) {
        next(error);
    }
}