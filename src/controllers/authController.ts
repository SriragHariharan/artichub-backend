//signup user controller
import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import User from '../models/User';
import { generateToken } from '../helpers/jwt';

export const signupController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        //validating inputs
        if(!req.body.username || !req.body.phone || !req.body.email || !req.body.password || !req.body.confirmPassword || !req.body.interests){
            throw createHttpError(400, "All fields are required");
        }

        //check for password match
        if(req.body.password !== req.body.confirmPassword){
            throw createHttpError(400, "Passwords do not match");
        }

        //find if user already exists
        const existingUser = await User.findOne({email: req.body.email});
        if(existingUser){
            throw createHttpError(400, "User already exists");
        }

        //create user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.phone,
            profilePic: req.body.profilePic ?? null,
            interests: req.body.interests
        });

        //save user
        const newUser = await user.save();
        console.log(newUser, " new user");

        //generate JWT token
        const token = generateToken({email: user.email, userID: String(user._id)});

        //send response
        res.status(201).json({ success: true, message: "Signup successful", token, data:{ username: newUser?.username, email: newUser?.email  } });

    } catch (error) {
        next(error)
    }
}
