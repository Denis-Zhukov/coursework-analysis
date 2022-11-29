import {Request, Response} from "express";
import {Id, QueryParam} from "../../types/types";
import database from "../../services/Databases";
import {services} from "../../services/Databases/services";
import {validateId, validateLimitStart} from "../../validations/general.validations";
import {refineException} from "../../exceptions/handler";
import {RefinedException} from "../../exceptions/handler/RefinedException";
import {ICountry} from "../../models/Addresses/ICountry";
import {validateCountry} from "../../validations/AddressValidations/countries.validations";


export class CountryController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async addCountry(req: Request, res: Response) {
        let country = req.body as ICountry;
        const {error} = validateCountry(country);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));
        country.name = country.name.toLowerCase();

        try {
            const result = await database.getService(services.country).add(country);
            return res.status(201).json(result);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async getCountries(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.getService(services.country).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            throw refineException(e);
        }
    }

    public static async updateCountry(req: Request, res: Response) {
        const country = req.body as ICountry;

        let errorResponse = "";
        let {error} = validateId(country.id);
        error && (errorResponse += error.details.map(d => d.message).join("\n") + "\n");
        error = validateCountry(country).error;
        error && (errorResponse += error.details.map(d => d.message).join("\n"));
        if (error) return res.status(400).send(errorResponse);
        country.name = country.name.toLowerCase();

        try {
            const result = await database.getService(services.country).update(country);
            if (result === 0) return res.status(400).send(`${country.id} has not been found`);
            return res.send(`Country has been updated`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async deleteCountry(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.getService(services.country).delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);
            return res.send(`${id} has been deleted`);
        } catch (e: any) {
            throw refineException(e);
        }
    }
}