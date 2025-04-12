import { 
  getProfileDetailsController, 
  updateInterestsController, 
  updateProfilePicController, 
  updateUsernameController 
} from "../controllers/profileController";
import authMiddleware from "../helpers/authMiddleware";
import fileUploadMiddleware from "../helpers/fileUploadMiddleware";

const profileRouter = require('express').Router();

//get profile details
profileRouter.get('/', authMiddleware, getProfileDetailsController);

//update username
profileRouter.put('/username', authMiddleware, updateUsernameController);

//update profilePic - added fileUploadMiddleware
profileRouter.put(
  '/profilePic', 
  authMiddleware, 
  fileUploadMiddleware, 
  updateProfilePicController
);

//update interests
profileRouter.put('/interests', authMiddleware, updateInterestsController);

export default profileRouter;