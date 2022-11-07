import {Request, Response} from "express";
import {QueryParam} from "../types/Query";
import {validateLimitStart} from "../validations/general.validations";
import database from "../services";

export class ProductsController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async getProducts(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        const result = await database.getProducts(count, offset);

        return res.send(result);
    }
}