const authRouter = require('express').Router();
import { NextFunction, Request, Response } from 'express';
import { loginUserController, signupController } from '../controllers/authController';

//signup user
authRouter.post('/signup', signupController);

//login user
authRouter.post("/login", loginUserController)

export default authRouter;