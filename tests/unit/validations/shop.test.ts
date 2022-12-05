import * as dotenv from "dotenv";
import {validateShop} from "../../../src/validations/shop.validations";

dotenv.config();

process.env.USE = "MYSQL";

describe("positive testing", () => {
    test("shop is valid", () => {
        
    });
});