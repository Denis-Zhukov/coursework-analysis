import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import process from "process";

dotenv.config();
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization || req.headers["x-access-token"] || req.body.token || req.query.token;
    token = `${token}`.slice(7);
    if (!token) return res.status(403).send("A token is required for authentication");

    try {
        (req as any).account = jwt.verify(token, String(process.env.KEY_VERIFY_TOKEN));
    } catch (err: any) {
        return res.status(401).send(err.message === 'jwt expired' ? "Token expired" : "Invalid token");
    }
    return next();
};