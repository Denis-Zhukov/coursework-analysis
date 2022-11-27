import bcrypt from "bcrypt";
import {v4} from "uuid";
import * as dotenv from "dotenv";


dotenv.config();

export class Security {
    private static salt = String(process.env.SALT_FOR_HASH);

    public static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, Security.salt);
    }

    public static generateUuid() {
        return v4();
    }
}