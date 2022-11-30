import {ICRUD} from "../interfaces/ICRUD";
import mongoose from "mongoose";
import {MongoDbService} from "../MongoDbService";
import {services} from "../services";
import {IShop} from "../../../models/IShop";
import {Shops} from "./schemas/Shops";
import {RefinedException} from "../../../exceptions/handler/RefinedException";
import {Addresses} from "./schemas/Addresses/Addresses";
import {IShopService} from "../interfaces/IShop";
import {IUserShop} from "../../../models/IUserShop";
import {Id} from "../../../types/types";
import {Accounts} from "./schemas/Accounts";


export class ShopService implements IShopService {
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

    public async addUserShop(shop: IUserShop) {
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

        await Accounts.updateOne({_id: shop.accountId}, {
            $push: {"shops": result["_id"]}
        })

        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return Shops.find().skip(offset).limit(count);
    }

    public async getUserShops(id: mongoose.Types.ObjectId, count: number, offset: number) {
        await this.instance.getConnection();
        const ids = (await Accounts.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            {$project: {shops: 1}}
        ]).skip(offset).limit(count))?.[0]?.shops;
        return Shops.find({_id: {$in: ids}});
    }

    public async update(shop: IShop) {
        await this.instance.getConnection();

        const checkAddress = await Addresses.find({_id: shop.address});
        if (!checkAddress.length) throw new RefinedException(`Addresses '${shop.address}' doesn't exist`, 400);


        const result = await Shops.updateOne({"_id": new mongoose.Types.ObjectId(shop.id)}, {
            name: shop.name,
            address: shop.address,
            getProducts: shop.getProducts,
            getOrders: shop.getOrders,
        });
        return result.matchedCount;
    }

    public async updateUserShop(shop: IUserShop) {
        await this.instance.getConnection();

        const checkAddress = await Addresses.find({_id: shop.address});
        if (!checkAddress.length)
            throw new RefinedException(`Addresses '${shop.address}' doesn't exist`, 400);


        const res = await Accounts.find({
            _id: shop.accountId,
            "shops": {
                $elemMatch: {$eq: shop.id}
            }
        });

        if (!res?.length)
            throw new RefinedException(`You aren't own '${shop.id}'`, 400);

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

    public async deleteUserShop(id: mongoose.Types.ObjectId, idOwner: mongoose.Types.ObjectId) {
        await this.instance.getConnection();

        const res = await Accounts.find({
            _id: idOwner,
            "shops": {
                $elemMatch: {$eq: id}
            }
        });

        if (!res?.length)
            throw new RefinedException(`You aren't own '${id}'`, 400);

        const {deletedCount} = await Shops.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        await Accounts.updateOne({_id: idOwner}, {
            $pull: {"shops": new mongoose.Types.ObjectId(id)}
        });

        return deletedCount;
    }
}

MongoDbService.registerService(services.shop, new ShopService());