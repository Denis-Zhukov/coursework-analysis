import {Request, Response} from "express";
import database from "../services/Databases";
import {services} from "../services/Databases/services";
import {refineException} from "../exceptions/handler";
import {RefinedException} from "../exceptions/handler/RefinedException";
import {
    validateRegisterUserData, validateResendVerifyEmail, validateUpdateRegistrationRequest, validateVerifyToken,
} from "../validations/client.validations";
import {IRegisterData} from "../models/IRegisterData";
import {Mailer} from "../services/Mailer";
import {Security} from "../services/Security";
import {IRegistrationRequests} from "../services/Databases/interfaces/IRegistrationRequests";
import {Id, QueryParam} from "../types/types";
import {validateId, validateLimitStart} from "../validations/general.validations";
import {IResendVerifyEmail} from "../models/IResendVerifyEmail";


export class RegistrationRequestController {
    private static defaultCount: number = 10;
    private static maxCount: number = 50;

    public static async sendRequestToRegister(req: Request, res: Response) {
        const data = req.body as IRegisterData;
        const {error} = validateRegisterUserData(data);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            data.token = Security.generateUuid();
            data.passwordHash = await Security.hashPassword(data.password);
            const result = await database.getService(services.registrationRequest).add(data);

            //there is no await by cause of send mail take a lot of time
            result && Mailer.sendEmailConfirmation(data.email, data.token);

            return res.status(201).send(`'${data.username}' has been added to registration requests.
An email has been sent to ${data.email}. Confirm mail.`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async verifyEmail(req: Request, res: Response) {
        const {token} = req.params;
        const {error} = validateVerifyToken(token);
        if (error) return res.sendStatus(404);

        try {
            const service = database.getService(services.registrationRequest) as IRegistrationRequests;
            const result = await service.verifyEmail(token);
            if (result) return res.status(200).send("Email has been verified");
            return res.sendStatus(404);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }

    }

    public static async resendVerifyEmail(req: Request, res: Response) {
        const data = req.body as IResendVerifyEmail;
        const {error} = validateResendVerifyEmail(data);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            data.token = Security.generateUuid();
            const service = database.getService(services.registrationRequest) as IRegistrationRequests;
            let result = await service.resendVerifyEmail(data);

            if (!result) throw new Error("Token for verify email hasn't been updated");

            result = await Mailer.sendEmailConfirmation(data.email, data.token);

            if (result.rejected.length) throw new RefinedException("Email service hasn't sent the verify email", 500);

            return res.status(201).send(`An email has been resent to ${data.email}. Confirm mail.`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async getRegistrationRequests(req: Request, res: Response) {
        const [_limit, _start] = [req.query._limit, req.query._start] as QueryParam[];
        const {error} = validateLimitStart({_limit, _start}, this.maxCount);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        const count = Number(_limit || this.defaultCount);
        const offset = Number(_start || 0);

        try {
            const result = await database.getService(services.registrationRequest).get(count, offset);
            return res.send(result);
        } catch (e: any) {
            throw refineException(e);
        }
    }

    public static async acceptRequest(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const serivce = database.getService(services.registrationRequest) as IRegistrationRequests;

            const userInfo = (await serivce.getById(id)) as IRegisterData;
            if (userInfo === null) return res.status(400).send(`${id} hasn't been found`);

            const result = await serivce.acceptUser(id);
            if (result < 1) return res.status(500).send(`Something went wrong. User hasn't been accepted`);

            Mailer.sendUserAcceptance(userInfo.username, userInfo.email);

            return res.send("User has been accepted")
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async rejectRequest(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const serivce = database.getService(services.registrationRequest) as IRegistrationRequests;

            const userInfo = (await serivce.getById(id)) as IRegisterData;
            if (userInfo === null) return res.status(400).send(`${id} hasn't been found`);

            const result = await serivce.delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);

            Mailer.sendUserRejection(userInfo.username, userInfo.email);

            return res.send("User has been rejected")
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async updateRegistrationRequest(req: Request, res: Response) {
        const data = req.body as IRegisterData;
        const {error} = validateUpdateRegistrationRequest(data);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            if (data.password) data.passwordHash = await Security.hashPassword(data.password);
            const result = await database.getService(services.registrationRequest).update(data);
            if (!result) return res.status(400).send(`${data.id} has not been found`);
            return res.send(`Registration request has been updated`);
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }

    public static async deleteRegistrationRequest(req: Request, res: Response) {
        const id = (req.params.id as unknown) as Id;
        const {error} = validateId(id);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const result = await database.getService(services.registrationRequest).delete(id);
            if (result === 0) return res.status(400).send(`${id} has not been found`);
            return res.send(`${id} has been deleted`);
        } catch (e: any) {
            throw refineException(e);
        }
    }
}

