import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

export class Mailer {
    private static from = String(process.env.GMAIL_FROM);
    private static user = String(process.env.GMAIL_USERNAME);
    private static pass = String(process.env.GMAIL_APP_PASS);

    public static async sendEmailConfirmation(email: string, token: string) {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", port: 465, secure: true, auth: {
                user: Mailer.user, pass: Mailer.pass,
            },
        });

        return await transporter.sendMail({
            from: {
                name: Mailer.from, address: Mailer.user,
            },
            to: email,
            subject: "Confirm email",
            text: "This message was sent from Node js server.",
            html: `<a href='http://localhost:8000/api/verify-email/${token}' target='_blank'>Confirm</a>`,
        });
    }

}