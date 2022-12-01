import {Router} from "express";
import {CategoryController} from "../controllers/CategoryController";
import {verifyToken} from "../middlewares/verifyToken";
import {onlyAdmin} from "../middlewares";


export const categoryRouter = Router();

categoryRouter.post("/add", ...onlyAdmin(), async (req, res) => {
    await CategoryController.addCategory(req, res);
});

categoryRouter.get("/get", async (req, res) => {
    await CategoryController.getCategories(req, res);
});

categoryRouter.put("/update", ...onlyAdmin(), async (req, res) => {
    await CategoryController.updateCategory(req, res);
});

categoryRouter.delete("/delete/:id", ...onlyAdmin(), async (req, res) => {
    await CategoryController.deleteCategory(req, res);
});