import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

export class Mailer {
    private static host = process.env.HOST;
    private static port = process.env.PORT;
    private static protocol = process.env.PROTOCOL;
    private static from = String(process.env.GMAIL_FROM);
    private static user = String(process.env.GMAIL_USERNAME);
    private static pass = String(process.env.GMAIL_APP_PASS);

    private static transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", port: 465, secure: true, auth: {
            user: Mailer.user, pass: Mailer.pass,
        },
    });

    public static async sendEmailConfirmation(email: string, token: string) {
        return await Mailer.transporter.sendMail({
            from: {
                name: Mailer.from, address: Mailer.user,
            },
            to: email,
            subject: "Confirm email",
            text: "This message was sent from Node js server.",
            html: `<a href='${Mailer.protocol}://${Mailer.host}:${Mailer.port}/api/registration-requests/verify-email/${token}' target='_blank'>Confirm</a>`,
        });
    }

    public static async sendUserAcceptance(name: string, email: string) {
        return await Mailer.transporter.sendMail({
            from: {name: Mailer.from, address: Mailer.user},
            to: email,
            subject: "You are accepted!",
            text: "This message was sent from Node js server.",
            html: `Dear ${name}, you are accepted.`,
        });
    }

    public static async sendUserRejection(name: string, email: string) {
        return await Mailer.transporter.sendMail({
            from: {name: Mailer.from, address: Mailer.user},
            to: email,
            subject: "You are rejected!",
            text: "This message was sent from Node js server.",
            html: `Dear ${name}, you are rejected.`,
        });
    }
}