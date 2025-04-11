// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { validateToken } from './jwt';

export interface DecodedUser {
    id: string;
    email: string;
    name?: string;
}


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw createHttpError(401, "Authorization token missing or malformed");
        }

        const token = authHeader.split(" ")[1];
        console.log(token);

        const decoded = validateToken(token);

        req.user = decoded;

        next();
    } catch (err) {
        next(createHttpError(401, "Invalid or expired token"));
    }
};

export default authMiddleware;
