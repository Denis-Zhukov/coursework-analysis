import {ICRUD} from "../../interfaces/ICRUD";
import {services} from "../../services";
import {ICountry} from "../../../../models/Addresses/ICountry";
import {MongoDbService} from "../../MongoDbService";
import mongoose from "mongoose";
import {Cities} from "../schemas/Addresses/Cities";
import {Streets} from "../schemas/Addresses/Streets";
import {Addresses} from "../schemas/Addresses/Addresses";
import {ICity} from "../../../../models/Addresses/ICity";


export class CityService implements ICRUD<ICountry> {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(city: ICity) {
        await this.instance.getConnection();

        const newCountry = new Cities({
            name: city.name,
            idCountry: city.idCountry
        });
        const result = await newCountry.save();
        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return Cities.find().skip(offset).limit(count);
    }

    public async update(city: ICity) {
        await this.instance.getConnection();
        const result = await Cities.updateOne({"_id": new mongoose.Types.ObjectId(city.id)}, {
            name: city.name,
            idCountry: city.idCountry
        });
        return result.matchedCount;
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await Cities.deleteOne({"_id": new mongoose.Types.ObjectId(id)});

        const streets = await Streets.find({idCity: id});

        for (const street of streets)
            await Addresses.deleteMany({idStreet: street["_id"]});

        await Streets.deleteMany({idCity: id});

        return deletedCount;
    }
}

MongoDbService.registerService(services.city, new CityService());