import {Request, Response} from "express";
import {Id, QueryParam} from "../types/types";
import {validateLimitStart} from "../validations/general.validations";
import database from "../services";
import {IProduct} from "../interfaces/IProduct";
import {validateProduct, validateUpdateProduct} from "../validations/products.validations";


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

    public static async addProduct(req: Request, res: Response) {
        const product = req.body as IProduct;
        const {error} = validateProduct(product);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const result = await database.addProduct(req.body);

        return res.status(201).json(result);
    }

    public static async deleteProduct(req: Request, res: Response) {
        const {id} = req.body;
        if (!id) return res.status(400).send("id is required");

        const result = await database.deleteProduct(id);
        if (result === 0) return res.status(400).send(`${id} has not been found`);
        return res.send(`${id} has been deleted`);
    }

    public static async updateProduct(req: Request, res: Response) {
        const product = req.body as IProduct & { oldId: Id | undefined };
        const {error} = validateUpdateProduct(product);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const result = await database.updateProduct(product, product.oldId);
        if (result === 0) return res.status(400).send(`Product has not been updated`);

        return res.send(`Product has been updated`);
    }
}