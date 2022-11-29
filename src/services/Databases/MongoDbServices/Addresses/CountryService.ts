import {ICRUD} from "../../interfaces/ICRUD";
import {services} from "../../services";
import {ICountry} from "../../../../models/Addresses/ICountry";
import {MongoDbService} from "../../MongoDbService";
import mongoose from "mongoose";
import {Countries} from "../schemas/Addresses/Countries";
import {Cities} from "../schemas/Addresses/Cities";
import {Streets} from "../schemas/Addresses/Streets";
import {Addresses} from "../schemas/Addresses/Addresses";


export class CountryService implements ICRUD<ICountry> {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(country: ICountry) {
        await this.instance.getConnection();

        const newCountry = new Countries({
            name: country.name,
        });
        const result = await newCountry.save();
        return result["_id"];
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return Countries.find().skip(offset).limit(count);
    }

    public async update(country: ICountry) {
        await this.instance.getConnection();
        const result = await Countries.updateOne({"_id": new mongoose.Types.ObjectId(country.id)}, {
            name: country.name,
        });
        return result.matchedCount;
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await Countries.deleteOne({"_id": new mongoose.Types.ObjectId(id)});

        const cities = await Cities.find({idCountry: id});
        await Cities.deleteMany({idCountry: id});

        for (const city of cities) {
            const streets = await Streets.find({idCity: city["_id"]});

            for (const street of streets)
                await Addresses.deleteMany({idStreet: street["_id"]});

            await Streets.deleteMany({idCity: city["_id"]});
        }

        return deletedCount;
    }
}

MongoDbService.registerService(services.country, new CountryService());