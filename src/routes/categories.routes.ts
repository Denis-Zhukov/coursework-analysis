import {Router} from "express";
import {CategoryController} from "../controllers/CategoryController";


export const categoryRouter = Router();

categoryRouter.post("/add-category", async (req, res) => {
    await CategoryController.addCategory(req, res);
});

categoryRouter.get("/get-categories", async (req, res) => {
    await CategoryController.getCategories(req, res);
});

categoryRouter.put("/update-category", async (req, res) => {
    await CategoryController.updateCategory(req, res);
});

categoryRouter.delete("/delete-category", async (req, res) => {
    await CategoryController.deleteCategory(req, res);
});