import connectDB from './config/db';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};
app.use(cors(corsOptions));

// Morgan for logging requests
app.use(morgan('dev'));

// Test route
app.get('/test', (_req: Request, res: Response) => {
  res.send('articlehub server is running');
});

// Auth route
import authRouter from './routes/authRoutes';
app.use("/auth", authRouter);

// Profile route
import profileRouter from './routes/profileRoutes';
app.use("/profile", profileRouter);

// Post route
import postRouter from './routes/postRoutes';
app.use("/post", postRouter);

// Global error handler middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message: message });
});

// Start server
app.listen(process.env.PORT, () => {
    connectDB();
  console.log('articlehub server listening on port ' + (process.env.PORT));
});
