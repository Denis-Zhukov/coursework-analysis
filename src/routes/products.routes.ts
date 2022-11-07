import {Router} from "express";
import {ProductsController} from "../controllers/ProductsController";


export const productsRouter = Router();

productsRouter.get("/get-products", async (req, res) => {
    await ProductsController.getProducts(req, res);
});

productsRouter.post("/add-product", async (req, res) => {
    await ProductsController.addProduct(req, res);
});

productsRouter.delete("/delete-product", async (req, res) => {
    await ProductsController.deleteProduct(req, res);
});