import {Router} from "express";
import {CountryController} from "../../controllers/AdressControllers/CountryController";

export const countryRouter = Router();

countryRouter.post("/add", async (req, res) => {
    await CountryController.addCountry(req, res);
});

countryRouter.get("/get", async (req, res) => {
    await CountryController.getCountries(req, res);
});

countryRouter.put("/update", async (req, res) => {
    await CountryController.updateCountry(req, res);
});

countryRouter.delete("/delete/:id", async (req, res) => {
    await CountryController.deleteCountry(req, res);
});