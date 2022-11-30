import {Router} from "express";
import {ProductController} from "../controllers/ProductController";
import {verifyToken} from "../middlewares/verifyToken";


export const productRouter = Router();

productRouter.post("/add", verifyToken, async (req, res) => {
    await ProductController.addProduct(req, res);
});

productRouter.get("/get", async (req, res) => {
    await ProductController.getProducts(req, res);
});

productRouter.put("/update", verifyToken, async (req, res) => {
    await ProductController.updateProduct(req, res);
});

productRouter.delete("/delete/:id", verifyToken, async (req, res) => {
    await ProductController.deleteProduct(req, res);
});