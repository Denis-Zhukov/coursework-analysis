import {ICRUD} from "../interfaces/ICRUD";
import mongoose from "mongoose";
import {MongoDbService} from "../MongoDbService";
import {services} from "../services";
import {IShop} from "../../../models/IShop";
import {Shops} from "./schemas/Shops";
import {RefinedException} from "../../../exceptions/handler/RefinedException";
import {Products} from "./schemas/Products";
import {Addresses} from "./schemas/Addresses/Addresses";


export class CategoryService implements ICRUD<IShop> {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(shop: IShop) {
        await this.instance.getConnection();

        const checkAddress = await Addresses.find({_id: shop.address});
        if (!checkAddress.length) throw new RefinedException(`Addresses '${shop.address}' doesn't exist`, 400);

        const newShop = new Shops({
            name: shop.name,
            address: shop.address,
            getProducts: shop.getProducts,
            getOrders: shop.getOrders,
        });
        const result = await newShop.save();
        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return Shops.find().skip(offset).limit(count);
    }

    public async update(shop: IShop) {
        await this.instance.getConnection();

        const result = await Shops.updateOne({"_id": new mongoose.Types.ObjectId(shop.id)}, {
            name: shop.name,
            address: shop.address,
            getProducts: shop.getProducts,
            getOrders: shop.getOrders,
        });
        return result.matchedCount;
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await Shops.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }
}

MongoDbService.registerService(services.category, new CategoryService());