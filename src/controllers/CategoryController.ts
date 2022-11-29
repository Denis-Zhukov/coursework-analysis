import {Request, Response} from "express";
import {Id, QueryParam} from "../types/types";
import database from "../services/Databases";
import {services} from "../services/Databases/services";
import {ICategory} from "../models/ICategory";
import {validateId, validateLimitStart} from "../validations/general.validations";
import {validateCategoryWithId, validateCategoryWithOutId} from "../validations/category.validations";
import {refineException} from "../exceptions/handler";
import {RefinedException} from "../exceptions/handler/RefinedException";


export class CategoryController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async addCategory(req: Request, res: Response) {
        let category = req.body as ICategory;
        const {error} = validateCategoryWithOutId(category);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));
        category.name = category.name.toLowerCase();

        try {
            const result = await database.getService(services.category).add(category);
            return res.status(201).json(result);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async getCategories(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.getService(services.category).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            throw refineException(e);
        }
    }

    public static async updateCategory(req: Request, res: Response) {
        const category = req.body as ICategory;
        const {error} = validateCategoryWithId(category);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));
        category.name = category.name.toLowerCase();

        try {
            const result = await database.getService(services.category).update(category);
            if (result === 0) return res.status(400).send(`${category.id} has not been found`);
            return res.send(`Category has been updated`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async deleteCategory(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.getService(services.category).delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);
            return res.send(`${id} has been deleted`);
        } catch (e: any) {
            throw refineException(e);
        }
    }
}