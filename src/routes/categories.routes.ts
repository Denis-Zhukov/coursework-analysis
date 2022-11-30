import {Router} from "express";
import {CategoryController} from "../controllers/CategoryController";
import {verifyToken} from "../middlewares/verifyToken";


export const categoryRouter = Router();

categoryRouter.post("/add", verifyToken, async (req, res) => {
    await CategoryController.addCategory(req, res);
});

categoryRouter.get("/get", async (req, res) => {
    await CategoryController.getCategories(req, res);
});

categoryRouter.put("/update", verifyToken, async (req, res) => {
    await CategoryController.updateCategory(req, res);
});

categoryRouter.delete("/delete/:id", verifyToken, async (req, res) => {
    await CategoryController.deleteCategory(req, res);
});