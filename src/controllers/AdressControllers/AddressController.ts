import {Request, Response} from "express";
import {Id, QueryParam} from "../../types/types";
import database from "../../services/Databases";
import {services} from "../../services/Databases/services";
import {validateId, validateLimitStart} from "../../validations/general.validations";
import {refineException} from "../../exceptions/handler";
import {RefinedException} from "../../exceptions/handler/RefinedException";
import {IAddress} from "../../models/Addresses/IAddress";
import {validateAddress} from "../../validations/AddressValidations/addresses.validations";


export class AddressController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async addAddress(req: Request, res: Response) {
        let address = req.body as IAddress;
        const {error} = validateAddress(address);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));
        address.restOfAddress = address.restOfAddress.toLowerCase();

        try {
            const result = await database.getService(services.address).add(address);
            return res.status(201).json(result);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async getAddresses(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.getService(services.address).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            throw refineException(e);
        }
    }

    public static async updateAddress(req: Request, res: Response) {
        const address = req.body as IAddress;

        let errorResponse = "";
        let {error} = validateId(address.id);
        error && (errorResponse += error.details.map(d => d.message).join("\n") + "\n");
        error = validateAddress(address).error;
        error && (errorResponse += error.details.map(d => d.message).join("\n"));
        if (error) return res.status(400).send(errorResponse);
        address.restOfAddress = address.restOfAddress.toLowerCase();

        try {
            const result = await database.getService(services.address).update(address);
            if (result === 0) return res.status(400).send(`${address.id} has not been found`);
            return res.send(`Address has been updated`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async deleteAddress(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.getService(services.address).delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);
            return res.send(`${id} has been deleted`);
        } catch (e: any) {
            throw refineException(e);
        }
    }
}