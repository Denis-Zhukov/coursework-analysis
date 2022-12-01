import {Router} from "express";
import {ShopController} from "../controllers/ShopController";
import {verifyToken} from "../middlewares/verifyToken";
import {onlyUsers} from "../middlewares";

export const shopRouter = Router();

shopRouter.post("/add", verifyToken, async (req, res) => {
    await ShopController.addShop(req, res);
});

shopRouter.get("/get", verifyToken, async (req, res) => {
    await ShopController.getShops(req, res);
});

shopRouter.put("/update", verifyToken, async (req, res) => {
    await ShopController.updateShop(req, res);
});

shopRouter.delete("/delete/:id", verifyToken, async (req, res) => {
    await ShopController.deleteShop(req, res);
});


const userRouter = Router();
userRouter.use(...onlyUsers());

userRouter.post("/add", async (req, res) => {
    await ShopController.addUserShop(req, res);
});

userRouter.get("/get", async (req, res) => {
    await ShopController.getUserShops(req, res);
});

userRouter.put("/update", async (req, res) => {
    await ShopController.updateUserShop(req, res);
});

userRouter.delete("/delete/:id", async (req, res) => {
    await ShopController.deleteUserShop(req, res);
});

shopRouter.use("/user", userRouter);