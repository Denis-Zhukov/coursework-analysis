import {Router} from "express";
import {AccountController} from "../controllers/AccountController";


export const accountRouter = Router();

accountRouter.post("/add-account", async (req, res) => {
    await AccountController.addAccount(req, res);
});

accountRouter.get("/get-accounts", async (req, res) => {
    await AccountController.getAccounts(req, res);
});

accountRouter.put("/update-account", async (req, res) => {
    await AccountController.updateAccount(req, res);
});

accountRouter.delete("/delete-account/:id", async (req, res) => {
    await AccountController.deleteAccount(req, res);
});