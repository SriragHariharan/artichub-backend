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

/*
    TODO
    1. Create a post ✅
    2. Edit a post
    3. Delete a post 
    4. Get details of a post 
    5. Add like to a post
    6. Remove like from a post 
*/