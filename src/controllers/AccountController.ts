import {Request, Response} from "express";
import {Id, QueryParam} from "../types/types";
import database from "../services/Databases";
import {services} from "../services/Databases/services";
import {IAccount} from "../models/IAccount";
import {validateId, validateLimitStart} from "../validations/general.validations";
import {refineException} from "../exceptions/handler";
import {RefinedException} from "../exceptions/handler/RefinedException";
import {validateAccountWithId, validateAccountWithoutId} from "../validations/account.validations";
import {Security} from "../services/Security";


export class AccountController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async addAccount(req: Request, res: Response) {
        let acc = req.body as IAccount;
        const {error} = validateAccountWithoutId(acc);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            acc.passwordHash = await Security.hashPassword(acc.password);
            const result = await database.getService(services.account).add(acc);
            return res.status(201).json(result);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async getAccounts(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.getService(services.account).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            throw refineException(e);
        }
    }

    public static async updateAccount(req: Request, res: Response) {
        const acc = req.body as IAccount;
        const {error} = validateAccountWithId(acc);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.getService(services.account).update(acc);
            if (result === 0) return res.status(400).send(`${acc.id} has not been found`);
            return res.send(`Account has been updated`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async deleteAccount(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.getService(services.account).delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);
            return res.send(`${id} has been deleted`);
        } catch (e: any) {
            throw refineException(e);
        }
    }
}