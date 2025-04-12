import { profile } from "console";
import { getProfileDetailsController, updateUsernameController } from "../controllers/profileController";
import authMiddleware from "../helpers/authMiddleware";

const profileRouter = require('express').Router();

//get profile details
profileRouter.get('/', authMiddleware, getProfileDetailsController);

//update username
profileRouter.put('/username', authMiddleware, updateUsernameController);

export default profileRouter;