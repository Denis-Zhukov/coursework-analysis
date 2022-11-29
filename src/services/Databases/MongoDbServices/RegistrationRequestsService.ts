import mongoose from "mongoose";
import {MongoDbService} from "../MongoDbService";
import {services} from "../services";
import {RefinedException} from "../../../exceptions/handler/RefinedException";
import {IRegistrationRequests} from "../interfaces/IRegistrationRequests";
import {IResendVerifyEmail} from "../../../models/IResendVerifyEmail";
import {IRegisterData} from "../../../models/IRegisterData";
import {RegistrationRequests} from "./schemas/RegistrationRequests";
import {Accounts} from "./schemas/Accounts";


export class RegistrationRequestsService implements IRegistrationRequests {
    private instance: MongoDbService;

    constructor() {
        this.instance = MongoDbService.instance;
    }

    public async add(data: IRegisterData) {
        await this.instance.getConnection();
        const result = (await RegistrationRequests.find({$or: [{email: data.email}, {username: data.username}]})) as IRegisterData[];
        if (result.length) {
            let err = "";
            result[0].email === data.email && (err += `There is already a user with email ${data.email}\n`);
            result[0].username === data.username && (err += `There is already a user with username ${data.username}`);
            throw new RefinedException(err, 400);
        }

        const newUser = new RegistrationRequests({
            username: data.username,
            email: data.email,
            passwordHash: data.passwordHash,
            token: data.token,
            contactDetails: data.contactDetails,
            confirmed: false,
        });

        const res = await newUser.save();
        return res["_id"];
    }

    public async verifyEmail(token: string) {
        await this.instance.getConnection();
        const result = await RegistrationRequests.updateOne({
            $and: [{"token": token}, {"confirmed": false}],
        }, {
            confirmed: true,
        });
        return result.modifiedCount;
    }

    public async resendVerifyEmail(data: IResendVerifyEmail) {
        await this.instance.getConnection();
        const acc = (await RegistrationRequests.findOne({email: data.email})) as IRegisterData;

        if (!acc) throw new RefinedException("No such account with email " + data.email, 400);
        if (acc?.confirmed) throw new RefinedException("Email has already confirmed", 400);

        const result = await RegistrationRequests.updateOne({
            email: data.email,
        }, {
            token: data.token,
        });

        return result.modifiedCount;
    }

    public async get(count: number, offset: number) {
        await this.instance.getConnection();
        return RegistrationRequests.find().skip(offset).limit(count);
    }

    public async getById(id: number) {
        await this.instance.getConnection();
        return RegistrationRequests.findOne({_id: id});
    }

    public async acceptUser(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const user = await RegistrationRequests.findOne({_id: id}) as IRegisterData;
        await this.delete(id);
        const account = new Accounts({
            username: user.username,
            email: user.email,
            passwordHash: user.passwordHash,
            contactDetails: user.contactDetails
        });
        const result = await account.save();

        return result["_id"];
    }

    public async update(data: IRegisterData) {
        await this.instance.getConnection();

        const result = await RegistrationRequests.updateOne({"_id": new mongoose.Types.ObjectId(data.id)}, {
            email: data.email,
            username: data.username,
            passwordHash: data.passwordHash ? data.passwordHash : undefined,
            contactDetails: data.contactDetails,
            confirmed: data.confirmed,
        });
        return result.matchedCount;
    }

    public async delete(id: mongoose.Types.ObjectId) {
        await this.instance.getConnection();
        const {deletedCount} = await RegistrationRequests.deleteOne({"_id": new mongoose.Types.ObjectId(id)});
        return deletedCount;
    }
}

MongoDbService.registerService(services.registrationRequest, new RegistrationRequestsService());