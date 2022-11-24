import {Router} from "express";
import {CategoryController} from "../controllers/CategoryController";


export const categoriesRouter = Router();

categoriesRouter.post("/add-category", async (req, res) => {
    await CategoryController.addCategory(req, res);
});

categoriesRouter.get("/get-categories", async (req, res) => {
    await CategoryController.getCategories(req, res);
});

categoriesRouter.put("/update-category", async (req, res) => {
    await CategoryController.updateCategory(req, res);
});

categoriesRouter.delete("/delete-category", async (req, res) => {
    await CategoryController.deleteCategory(req, res);
});