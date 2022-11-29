import {Request, Response} from "express";
import {Id, QueryParam} from "../../types/types";
import database from "../../services/Databases";
import {services} from "../../services/Databases/services";
import {validateId, validateLimitStart} from "../../validations/general.validations";
import {refineException} from "../../exceptions/handler";
import {RefinedException} from "../../exceptions/handler/RefinedException";
import {ICity} from "../../models/Addresses/ICity";
import {validateCity} from "../../validations/AddressValidations/cities.validations";


export class CityController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async addCity(req: Request, res: Response) {
        let city = req.body as ICity;
        const {error} = validateCity(city);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));
        city.name = city.name.toLowerCase();

        try {
            const result = await database.getService(services.city).add(city);
            return res.status(201).json(result);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async getCities(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.getService(services.city).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            throw refineException(e);
        }
    }

    public static async updateCity(req: Request, res: Response) {
        const city = req.body as ICity;

        let errorResponse = "";
        let {error} = validateId(city.id);
        error && (errorResponse += error.details.map(d => d.message).join("\n") + "\n");
        error = validateCity(city).error;
        error && (errorResponse += error.details.map(d => d.message).join("\n"));
        if (error) return res.status(400).send(errorResponse);
        city.name = city.name.toLowerCase();

        try {
            const result = await database.getService(services.city).update(city);
            if (result === 0) return res.status(400).send(`${city.id} has not been found`);
            return res.send(`City has been updated`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async deleteCity(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.getService(services.city).delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);
            return res.send(`${id} has been deleted`);
        } catch (e: any) {
            throw refineException(e);
        }
    }
}