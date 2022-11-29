import {Router} from "express";
import {AddressController} from "../../controllers/AdressControllers/AddressController";

export const addressRouter = Router();

addressRouter.post("/add", async (req, res) => {
    await AddressController.addAddress(req, res);
});

addressRouter.get("/get", async (req, res) => {
    await AddressController.getAddresses(req, res);
});

addressRouter.put("/update", async (req, res) => {
    await AddressController.updateAddress(req, res);
});

addressRouter.delete("/delete/:id", async (req, res) => {
    await AddressController.deleteAddress(req, res);
});