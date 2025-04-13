import { 
    createPostController, 
    deletePostController, 
    getPostDetailsController,
    updatePostController
} from "../controllers/postController";
import authMiddleware from "../helpers/authMiddleware";
import fileUploadMiddleware from "../helpers/fileUploadMiddleware";

const postRouter = require('express').Router();

//create post
postRouter.post('/', authMiddleware, fileUploadMiddleware, createPostController);

//get post details
postRouter.get('/:id', authMiddleware, getPostDetailsController);

//update post
postRouter.put('/:postID', authMiddleware, updatePostController);

//delete post
postRouter.delete('/:postID', authMiddleware, deletePostController);

export default postRouter;