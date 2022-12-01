import {Router} from "express";
import {AccountController} from "../controllers/AccountController";
import {onlyAdmin} from "../middlewares";

export const accountRouter = Router();
accountRouter.use(...onlyAdmin());

accountRouter.post("/add", async (req, res) => {
    await AccountController.addAccount(req, res);
});

accountRouter.get("/get", async (req, res) => {
    await AccountController.getAccounts(req, res);
});

accountRouter.put("/update", async (req, res) => {
    await AccountController.updateAccount(req, res);
});

accountRouter.delete("/delete/:id", async (req, res) => {
    await AccountController.deleteAccount(req, res);
});