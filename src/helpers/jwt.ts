import jwt from "jsonwebtoken";

export const generateToken = (data: { email: string, userID: string }) => jwt.sign(data, process.env.TOKEN_SECRET as string, { expiresIn: "1d" });

export const validateToken = (token: string) => jwt.verify(token, process.env.TOKEN_SECRET as string);