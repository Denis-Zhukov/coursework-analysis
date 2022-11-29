import {ICRUD} from "../interfaces/ICRUD";
import mongoose from "mongoose";
import {MongoDbService} from "../MongoDbService";
import {services} from "../services";
import {ICategory} from "../../../models/ICategory";
import {Categories} from "./schemas/Categories";
import {RefinedException} from "../../../exceptions/handler/RefinedException";


export class AccountService implements ICRUD<ICategory> {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(category: ICategory) {
        await this.instance.getConnection();

        const checkCategory = await Categories.find({name: category.name});
        if (checkCategory.length) throw new RefinedException(`Category '${category.name}' already exist`, 400);

        const newCategory = new Categories({
            name: category.name,
        });
        const result = await newCategory.save();
        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return Categories.find().skip(offset).limit(count);
    }

    public async update(category: ICategory) {
        await this.instance.getConnection();

        const result = await Categories.updateOne({"_id": new mongoose.Types.ObjectId(category.id)}, {
            name: category.name,
        });
        return result.matchedCount;
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await Categories.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }
}

MongoDbService.registerService(services.account, new AccountService());