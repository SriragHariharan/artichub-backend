import { 
    createPostController 
} from "../controllers/postController";
import authMiddleware from "../helpers/authMiddleware";
import fileUploadMiddleware from "../helpers/fileUploadMiddleware";

const postRouter = require('express').Router();

//create post
postRouter.post('/', authMiddleware, fileUploadMiddleware, createPostController);

export default postRouter;