import {Request, Response} from "express";
import {Id, QueryParam} from "../../types/types";
import database from "../../services/Databases";
import {services} from "../../services/Databases/services";
import {validateId, validateLimitStart} from "../../validations/general.validations";
import {refineException} from "../../exceptions/handler";
import {RefinedException} from "../../exceptions/handler/RefinedException";
import {IStreet} from "../../models/Addresses/IStreet";
import {validateStreet} from "../../validations/AddressValidations/streets.validations";


export class StreetController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async addStreet(req: Request, res: Response) {
        let street = req.body as IStreet;
        const {error} = validateStreet(street);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));
        street.name = street.name.toLowerCase();

        try {
            const result = await database.getService(services.street).add(street);
            return res.status(201).json(result);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async getStreets(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.getService(services.street).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            throw refineException(e);
        }
    }

    public static async updateStreet(req: Request, res: Response) {
        const street = req.body as IStreet;

        let errorResponse = "";
        let {error} = validateId(street.id);
        error && (errorResponse += error.details.map(d => d.message).join("\n") + "\n");
        error = validateStreet(street).error;
        error && (errorResponse += error.details.map(d => d.message).join("\n"));
        if (error) return res.status(400).send(errorResponse);
        street.name = street.name.toLowerCase();

        try {
            const result = await database.getService(services.street).update(street);
            if (result === 0) return res.status(400).send(`${street.id} has not been found`);
            return res.send(`Street has been updated`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async deleteStreet(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.getService(services.street).delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);
            return res.send(`${id} has been deleted`);
        } catch (e: any) {
            throw refineException(e);
        }
    }
}