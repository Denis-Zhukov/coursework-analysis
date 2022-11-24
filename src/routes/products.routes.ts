import {Router} from "express";
import {ProductController} from "../controllers/ProductController";


export const productsRouter = Router();

productsRouter.post("/add-product", async (req, res) => {
    await ProductController.addProduct(req, res);
});

productsRouter.get("/get-products", async (req, res) => {
    await ProductController.getProducts(req, res);
});

productsRouter.put("/update-product", async (req, res) => {
    await ProductController.updateProduct(req, res);
});

productsRouter.delete("/delete-product", async (req, res) => {
    await ProductController.deleteProduct(req, res);
});