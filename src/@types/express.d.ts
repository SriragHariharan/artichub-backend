// src/@types/express.d.ts or src/types/express.d.ts
import { DecodedUser } from '../middleware/auth';

declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}