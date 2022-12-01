import process from "process";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {Id} from "../types/types";
import bcrypt from "bcrypt";
import {v4} from "uuid";

dotenv.config();


export class Security {
    private static keyVerify = String(process.env.KEY_VERIFY_TOKEN);
    private static keyRefresh = String(process.env.KEY_REFRESH_TOKEN);
    private static salt = String(process.env.SALT_FOR_HASH);

    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, Security.salt);
    }

    public static async compareHashAndPassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    public static generateUuid() {
        return v4();
    }

    public static login(accountId: Id, isAdmin: boolean) {
        return jwt.sign(
            {
                accountId,
                isAdmin
            },
            Security.keyVerify,
            {
                expiresIn: 60 * 60 * 365
            }
        );
    }
}
