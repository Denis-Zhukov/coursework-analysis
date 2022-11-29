import {Router} from "express";
import {ProductController} from "../controllers/ProductController";


export const productRouter = Router();

productRouter.post("/add-product", async (req, res) => {
    await ProductController.addProduct(req, res);
});

productRouter.get("/get-products", async (req, res) => {
    await ProductController.getProducts(req, res);
});

productRouter.put("/update-product", async (req, res) => {
    await ProductController.updateProduct(req, res);
});

productRouter.delete("/delete-product/:id", async (req, res) => {
    await ProductController.deleteProduct(req, res);
});