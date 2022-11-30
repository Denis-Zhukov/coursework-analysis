import {Router} from "express";
import {AccountController} from "../controllers/AccountController";
import {verifyToken} from "../middlewares/verifyToken";

export const accountRouter = Router();
accountRouter.use(verifyToken);

accountRouter.post("/add", verifyToken, async (req, res) => {
    await AccountController.addAccount(req, res);
});

accountRouter.get("/get", verifyToken, async (req, res) => {
    await AccountController.getAccounts(req, res);
});

accountRouter.put("/update", verifyToken, async (req, res) => {
    await AccountController.updateAccount(req, res);
});

accountRouter.delete("/delete/:id", verifyToken, async (req, res) => {
    await AccountController.deleteAccount(req, res);
});