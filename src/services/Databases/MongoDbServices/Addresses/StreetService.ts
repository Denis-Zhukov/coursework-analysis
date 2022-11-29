import {ICRUD} from "../../interfaces/ICRUD";
import {services} from "../../services";
import {ICountry} from "../../../../models/Addresses/ICountry";
import {MongoDbService} from "../../MongoDbService";
import mongoose from "mongoose";
import {Streets} from "../schemas/Addresses/Streets";
import {Addresses} from "../schemas/Addresses/Addresses";
import {IStreet} from "../../../../models/Addresses/IStreet";


export class StreetService implements ICRUD<ICountry> {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(street: IStreet) {
        await this.instance.getConnection();

        const newCountry = new Streets({
            name: street.name,
            idCity: street.idCity
        });
        const result = await newCountry.save();
        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return Streets.find().skip(offset).limit(count);
    }

    public async update(street: IStreet) {
        await this.instance.getConnection();
        const result = await Streets.updateOne({"_id": new mongoose.Types.ObjectId(street.id)}, {
            name: street.name,
            idCity: street.idCity
        });
        return result.matchedCount;
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await Streets.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        await Addresses.deleteMany({idStreet: id});

        return deletedCount;
    }
}

MongoDbService.registerService(services.street, new StreetService());