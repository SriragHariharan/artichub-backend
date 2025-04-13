import { 
    createPostController, 
    getPostDetailsController
} from "../controllers/postController";
import authMiddleware from "../helpers/authMiddleware";
import fileUploadMiddleware from "../helpers/fileUploadMiddleware";

const postRouter = require('express').Router();

//create post
postRouter.post('/', authMiddleware, fileUploadMiddleware, createPostController);

//get post details
postRouter.get('/:id', authMiddleware, getPostDetailsController);

export default postRouter;