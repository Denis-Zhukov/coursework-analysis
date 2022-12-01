import {Router} from "express";
import {ProductController} from "../controllers/ProductController";
import {onlyAdmin} from "../middlewares";


export const productRouter = Router();

productRouter.post("/add", ...onlyAdmin(), async (req, res) => {
    await ProductController.addProduct(req, res);
});

productRouter.get("/get", async (req, res) => {
    await ProductController.getProducts(req, res);
});

productRouter.put("/update", ...onlyAdmin(), async (req, res) => {
    await ProductController.updateProduct(req, res);
});

productRouter.delete("/delete/:id", ...onlyAdmin(), async (req, res) => {
    await ProductController.deleteProduct(req, res);
});