import {Request, Response} from "express";
import {RefinedException} from "../exceptions/handler/RefinedException";
import {refineException} from "../exceptions/handler";
import {ILoginData} from "../models/ILoginData";
import {validateLoginData} from "../validations/auth.validations";
import {Security} from "../services/Security";
import database from "../services/Databases";
import {services} from "../services/Databases/services";
import {IAccountService} from "../services/Databases/interfaces/IAccountService";
import {IAccount} from "../models/IAccount";


export class AuthController {
    public static async login(req: Request, res: Response) {
        const data = req.body as ILoginData;
        const {error} = validateLoginData(data);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const service = database.getService(services.account) as IAccountService;
            const account: IAccount = (await service.getByUsername(data.username)) as IAccount;
            console.log(account)
            if (!account || !account.passwordHash)
                return res.status(400).send("Invalid username");

            if (!(await Security.compareHashAndPassword(data.password, account.passwordHash)))
                return res.status(403).send("Incorrect password");

            return res.status(200).json({verifyToken: Security.login(account?.id)});
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }
}