const authRouter = require('express').Router();
import { NextFunction, Request, Response } from 'express';
import { signupController } from '../controllers/authController';

//signup user
authRouter.post('/signup', signupController);

export default authRouter;