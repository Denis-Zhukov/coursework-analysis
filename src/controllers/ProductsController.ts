import {Request, Response} from "express";
import {QueryParam} from "../types/types";
import {IProduct} from "../models/IProduct";
import database from "../services/Databases";
import {validateLimitStart} from "../validations/general.validations";
import {validateProductWithId, validateProductWithOutId} from "../validations/products.validations";
import {refineException} from "../exceptions/handler";
import {tableName} from "../services/Databases/tableName";


export class ProductsController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async getProducts(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.table(tableName.product).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            refineException(e);
        }
    }

    public static async addProduct(req: Request, res: Response) {
        const product = req.body as IProduct;
        const {error} = validateProductWithOutId(product);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.table(tableName.product).add(product);
            return res.status(201).json(result);
        } catch (e: any) {
            refineException(e);
        }
    }

    public static async deleteProduct(req: Request, res: Response) {
        const {id} = req.body;
        if (!id) return res.status(400).send("id is required");

        try {
            const result = await database.table(tableName.product).delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);
            return res.send(`${id} has been deleted`);
        } catch (e: any) {
            refineException(e);
        }
    }

    public static async updateProduct(req: Request, res: Response) {
        const product = req.body as IProduct;
        const {error} = validateProductWithId(product);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.table(tableName.product).update(product);
            if (result === 0) return res.status(400).send(`Product has not been updated`);
            return res.send(`Product has been updated`);
        } catch (e: any) {
            refineException(e);
        }
    }
}