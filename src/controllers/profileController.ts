import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "../models/User";
import cloudinary from "../config/cloudinary";

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

//update profilePic
export const updateProfilePicController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !req.files.profilePic) {
      return next(createHttpError(400, 'No file uploaded'));
    }

    const profilePic = req.files.profilePic;
    const userID = req.user?.userID;

    if (Array.isArray(profilePic)) {
      return next(createHttpError(400, 'Only one file allowed for profile picture'));
    }

    //Get the existing user
    const user = await User.findById(userID);
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    // If user has existing profile picture in Cloudinary, delete it
    if (user.profilePic) {
      try {
        // Extract public ID from the URL (last part without extension)
        const urlParts = user.profilePic.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        const fullPublicId = `article-hub/${publicId}`;

        await cloudinary.uploader.destroy(fullPublicId);
        console.log('Deleted old image from Cloudinary');
      } catch (error) {
        console.error('Error deleting old image from Cloudinary:', error);
      }
    }

    //Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(profilePic.tempFilePath, {
      folder: 'article-hub',
      width: 150,
      height: 150,
      crop: 'fill'
    });

    //Update user in database
    await User.updateOne(
      { _id: userID },
      { profilePic: result.secure_url }
    );

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      url: result.secure_url
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    next(createHttpError(500, 'Failed to update profile picture'));
  }
}

//update interests
export const updateInterestsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if(!req?.body?.interests || !Array.isArray(req?.body?.interests) || req?.body?.interests.length === 0){
            throw createHttpError(400, "Interests are required");
        }

        const updatedResponse = await User.updateOne({ _id: req?.user?.userID }, { $set: { interests: req?.body?.interests } });
        if(!updatedResponse){
            throw createHttpError(400, "User does not exist");
        } 
        res.status(200).json({ success: true, message: "Interests updated successfully", data: { interests: req?.body?.interests }});
    } catch (error) {    
        next(error);
    }
};