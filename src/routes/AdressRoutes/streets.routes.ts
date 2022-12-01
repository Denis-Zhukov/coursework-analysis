import {Router} from "express";
import {StreetController} from "../../controllers/AdressControllers/StreetController";
import {onlyAdmin} from "../../middlewares";
import {addressRouter} from "./addresses.routes";

export const streetRouter = Router();
addressRouter.use(...onlyAdmin());

streetRouter.post("/add", async (req, res) => {
    await StreetController.addStreet(req, res);
});

streetRouter.get("/get", async (req, res) => {
    await StreetController.getStreets(req, res);
});

streetRouter.put("/update", async (req, res) => {
    await StreetController.updateStreet(req, res);
});

streetRouter.delete("/delete/:id", async (req, res) => {
    await StreetController.deleteStreet(req, res);
});