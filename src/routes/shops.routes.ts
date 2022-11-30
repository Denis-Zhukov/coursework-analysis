import {Router} from "express";
import {ShopController} from "../controllers/ShopController";

export const shopRouter = Router();

shopRouter.post("/add-shop", async (req, res) => {
    await ShopController.addShop(req, res);
});

shopRouter.get("/get-shops", async (req, res) => {
    await ShopController.getShops(req, res);
});

shopRouter.put("/update-shop", async (req, res) => {
    await ShopController.updateShop(req, res);
});

shopRouter.delete("/delete-shop/:id", async (req, res) => {
    await ShopController.deleteShop(req, res);
});