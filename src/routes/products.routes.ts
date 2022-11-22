import {Router} from "express";
import {ProductsController} from "../controllers/ProductsController";


export const productsRouter = Router();

productsRouter.post("/add-product", async (req, res) => {
    await ProductsController.addProduct(req, res);
});

productsRouter.get("/get-products", async (req, res) => {
    await ProductsController.getProducts(req, res);
});

productsRouter.put("/update-product", async (req, res) => {
    await ProductsController.updateProduct(req, res);
});

productsRouter.delete("/delete-product", async (req, res) => {
    await ProductsController.deleteProduct(req, res);
});