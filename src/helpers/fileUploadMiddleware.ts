import  fileUpload from 'express-fileupload';
import { RequestHandler } from 'express';

const fileUploadMiddleware: RequestHandler = fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  abortOnLimit: true,
  responseOnLimit: 'File size exceeds the 5MB limit',
  useTempFiles: true,
  tempFileDir: '/tmp/'
});

export default fileUploadMiddleware;