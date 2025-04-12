import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "../models/User";

//get profileDetails
export const getProfileDetailsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userDetails = await User.findOne({ _id: req?.user?.userID }, { password: 0 });
        if(!userDetails) throw createHttpError(400, "User does not exist");
        res.status(200).json({ success: true, message: "Profile details fetched successfully", data: {user: userDetails} });
    } catch (error) {
        next(error);
    }
};

//update username
export const updateUsernameController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req?.body?.username){
            throw createHttpError(400, "Username is required");
        } 

        const updatedUser = await User.findOneAndUpdate({ _id: req?.user?.userID }, { username: req?.body?.username }, { new: true });
        if(!updatedUser){
            throw createHttpError(400, "User does not exist");
        } 
        res.status(200).json({ success: true, message: "Username updated successfully", data: { username: updatedUser?.username }});
    } catch (error) {
        next(error);
    }
};