import {Request, Response} from "express";
import database from "../services/Databases";
import {services} from "../services/Databases/services";
import {refineException} from "../exceptions/handler";
import {RefinedException} from "../exceptions/handler/RefinedException";
import {validateRegisterUserData} from "../validations/client.validations";
import {IRegisterData} from "../models/IRegisterData";
import {IClient} from "../services/Databases/interfaces/IClient";


export class ClientController {
    public static async sendRequestToRegister(req: Request, res: Response) {
        const registerData = req.body as IRegisterData;
        const {error} = validateRegisterUserData(registerData);
        if (error) return res.status(400).send(error.details.map(d => d.message).join("\n"));

        try {
            const service: IClient = database.getService(services.client) as IClient;

            return res.status(201).json("nice to met you");
        } catch (e: any) {
            throw (e instanceof RefinedException ? e : refineException(e));
        }
    }
}

// let transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//         user: "PostAnalysis.CourseWork@gmail.com",
//         pass: "qbaecubyjzbnovkw",
//     },
// })
//
// let result = await transporter.sendMail({
//     from: 'PostAnalysis.CourseWork@gmail.com',
//     to: 'Reyal.steam.vip@gmail.com',
//     subject: 'Message from Node js',
//     text: 'This message was sent from Node js server.',
//     html: 'This <i>message</i> was sent from <strong>Node js</strong> server.',
// })