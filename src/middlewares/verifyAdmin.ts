import {NextFunction, Request, Response} from "express";
import * as dotenv from "dotenv";

dotenv.config();
export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).account.isAdmin)
        return res.status(403).send("method not allowed to default users")
    return next();
};