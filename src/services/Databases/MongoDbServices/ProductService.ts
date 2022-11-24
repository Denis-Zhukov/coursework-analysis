import {IProduct} from "../../../models/IProduct";
import {ICRUD} from "../interfaces/ICRUD";
import {Products} from "./schemas/Products";
import mongoose from "mongoose";
import {MongoDbService} from "../MongoDbService";
import {services} from "../services";
import {Categories} from "./schemas/Categories";
import {RefinedException} from "../../../exceptions/handler/RefinedException";

export class ProductService implements ICRUD<IProduct> {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    private async checkCategories(product: IProduct) {
        const categories = await Categories.find({name: {$in: product.categories}});
        if (categories.length !== product.categories.length) {
            const excludedCategories = product.categories.filter(c => categories.find(el => el.name === c) === undefined);
            throw new RefinedException(`Categories: ${excludedCategories.map(c => `'${c}'`).join(', ')} don't exist`, 400);
        }
        return categories;
    }

    public async add(product: IProduct) {
        await this.instance.getConnection();
        const categories = await this.checkCategories(product);

        const prod = new Products({
            name: product.name,
            description: product.description,
            categories: categories.map(c => c._id)
        });
        const result = await prod.save();
        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        const products = await Products.find().skip(offset).limit(count).populate("categories");
        return products.map(p => {
            const prod = p.toObject();
            return {...prod, categories: prod.categories?.map((c: any) => c.name)}
        });
    }

    public async update(product: IProduct) {
        await this.instance.getConnection();
        const categories = await this.checkCategories(product);

        const result = await Products.updateOne({"_id": new mongoose.Types.ObjectId(product.id)}, {
            name: product.name,
            description: product.description,
            categories: categories.map(c => c._id)
        });
        return result.matchedCount;
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await Products.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }
}

MongoDbService.registerService(services.product, new ProductService());