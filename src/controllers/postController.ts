import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary";
import Post from "../models/Post";

//create new post
export const createPostController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.body, req.files);
        //check for the fields
        if (!req?.body?.title || !req?.body?.description) {
            throw createHttpError(400, "All fields are required");
        }

        //upload image to cloudinary if image is present
        if (req.files && req.files.image) {
            const image = req.files.image;
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
        const post = await Post.findById(req.params.id).populate("author",[ "-password",  "-email", "-mobile"]);
        if (!post) {
            throw createHttpError(404, "Post not found");
        }
        res.status(200).json({ success: true, message: "Post details fetched successfully", data: post });
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

/*
    TODO
    1. get all posts of him
*/