import {Router} from "express";
import {AuthController} from "../controllers/AuthController";

export const authRouter = Router();
authRouter.post("/login", async (req, res) => {
    await AuthController.login(req, res);
})