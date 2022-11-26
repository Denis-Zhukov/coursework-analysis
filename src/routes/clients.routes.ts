import {Router} from "express";
import {ClientController} from "../controllers/ClientController";


export const clientRouter = Router();

clientRouter.post("/register", async (req, res) => {
    await ClientController.sendRequestToRegister(req, res);
});
