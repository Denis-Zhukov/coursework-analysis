import {ICRUD} from "../../interfaces/ICRUD";
import {services} from "../../services";
import {MongoDbService} from "../../MongoDbService";
import mongoose from "mongoose";
import {Addresses} from "../schemas/Addresses/Addresses";
import {IAddress} from "../../../../models/Addresses/IAddress";


export class AddressService implements ICRUD<IAddress> {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(address: IAddress) {
        await this.instance.getConnection();

        const newAddress = new Addresses({
            restOfAddress: address.restOfAddress,
            idStreet: address.idStreet
        });
        const result = await newAddress.save();
        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return Addresses.find().skip(offset).limit(count);
    }

    public async update(street: IAddress) {
        await this.instance.getConnection();
        const result = await Addresses.updateOne({"_id": new mongoose.Types.ObjectId(street.id)}, {
            restOfAddress: street.restOfAddress,
            idStreet: street.idStreet
        });
        return result.matchedCount;
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await Addresses.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }
}

MongoDbService.registerService(services.address, new AddressService());