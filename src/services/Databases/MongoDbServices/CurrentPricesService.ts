import {services} from "../services";
import {ICurrentPrice} from "../../../models/ICurrentPrice";
import {ICurrentPricesService} from "../interfaces/ICurrentPricesService";
import {MongoDbService} from "../MongoDbService";
import {Categories} from "./schemas/Categories";
import {RefinedException} from "../../../exceptions/handler/RefinedException";
import {CurrentPrices} from "./schemas/CurrentPrices";
import mongoose from "mongoose";
import {Products} from "./schemas/Products";
import {OldPrices} from "./schemas/OldPrices";


export class CurrentPricesService implements ICurrentPricesService {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(data: ICurrentPrice) {
        await this.instance.getConnection();

        const newCategory = new CurrentPrices({
            idShop: data.idShop, idProduct: data.idProduct, price: data.price, lastUpdate: new Date(),
        });
        const result = await newCategory.save();
        return result["_id"];
    }

    public async addMany(datum: ICurrentPrice[]) {
        await this.instance.getConnection();

        const result = await CurrentPrices.insertMany(datum);
        return result.length;
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return CurrentPrices.find().skip(offset).limit(count);
    }

    public async getByIdProductAndIdShop(count: number, offset: number, idProduct: number, idShop: number) {
        await this.instance.getConnection();
        return CurrentPrices.find({idProduct, idShop}).skip(offset).limit(count);
    }

    public async update(data: ICurrentPrice) {
        await this.instance.getConnection();

        const result = await CurrentPrices.updateOne({
            "idShop": new mongoose.Types.ObjectId(data.idShop),
            "idProduct": new mongoose.Types.ObjectId(data.idProduct),
        }, {
            price: data.price, lastUpdate: new Date(),
        });
        return result.matchedCount;
    }

    public async delete(id: number) {
        await this.instance.getConnection();
        const products = await CurrentPrices.find({"idShop": new mongoose.Types.ObjectId(id)});
        await OldPrices.insertMany(products);
        const {deletedCount} = await CurrentPrices.deleteMany({"idShop": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }

    public async deleteIdProductAndByIdShop(idProduct: number, idShop: number) {
        await this.instance.getConnection();
        const products = await CurrentPrices.find({
            "idShop": new mongoose.Types.ObjectId(idShop), "idProduct": new mongoose.Types.ObjectId(idProduct),
        });
        await OldPrices.insertMany(products);
        const {deletedCount} = await CurrentPrices.deleteMany({
            "idShop": new mongoose.Types.ObjectId(idShop), "idProduct": new mongoose.Types.ObjectId(idProduct),
        });
        return deletedCount;
    }
}

MongoDbService.registerService(services.currentPrices, new CurrentPricesService());