import { 
    createPostController, 
    deletePostController, 
    getAllPostsController, 
    getFeedController, 
    getMyPostsController, 
    getPostDetailsController,
    likePostController,
    updatePostController
} from "../controllers/postController";
import authMiddleware from "../helpers/authMiddleware";
import fileUploadMiddleware from "../helpers/fileUploadMiddleware";

const postRouter = require('express').Router();

//create post
postRouter.post('/', authMiddleware, fileUploadMiddleware, createPostController);

//get feed
postRouter.get('/feeds', authMiddleware, getFeedController);

//get all posts of a specific user
postRouter.get('/mine', authMiddleware, getMyPostsController);

//get post details
postRouter.get('/:id', authMiddleware, getPostDetailsController);

//update post
postRouter.put('/:postID', authMiddleware, updatePostController);

//delete post
postRouter.delete('/:postID', authMiddleware, deletePostController);

//like or unlike a post
postRouter.put('/:postID/like', authMiddleware, likePostController);

//get all posts of a user
postRouter.get('/', authMiddleware, getAllPostsController);



export default postRouter;