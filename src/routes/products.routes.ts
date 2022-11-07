import {Router} from "express";
import {ProductsController} from "../controllers/products.controller";


export const productsRouter = Router();

productsRouter.get("/get-products", async (req, res) => {
    await ProductsController.getProducts(req, res);
});