import {Request, Response} from "express";
import {Id, QueryParam} from "../types/types";
import database from "../services/Databases";
import {services} from "../services/Databases/services";
import {validateId, validateLimitStart} from "../validations/general.validations";
import {refineException} from "../exceptions/handler";
import {RefinedException} from "../exceptions/handler/RefinedException";
import {IShop} from "../models/IShop";
import {validateShopWithId, validateShopWithOutId} from "../validations/shop.validations";


export class CategoryController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async addShop(req: Request, res: Response) {
        let shop = req.body as IShop;
        const {error} = validateShopWithOutId(shop);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));


        try {
            const result = await database.getService(services.shop).add(shop);
            return res.status(201).json(result);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async getShops(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.getService(services.shop).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            throw refineException(e);
        }
    }

    public static async updateShop(req: Request, res: Response) {
        const shop = req.body as IShop;
        let {error} = validateShopWithId(shop);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {

        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async deleteShop(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {

        } catch (e: any) {
            throw refineException(e);
        }
    }
}