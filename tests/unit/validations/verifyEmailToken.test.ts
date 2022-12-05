import * as dotenv from "dotenv";

dotenv.config();

process.env.USE = "MYSQL";

import {validateVerifyToken} from "../../../src/validations/registrationRequest.validations";

describe("positive testing", () => {
    test("token is valid", () => {
        const token = "ed49c412-65b7-42f8-87d8-e44a21253068";
        const {error} = validateVerifyToken(token);
        expect(error).not.toBeDefined();
    });
});

describe("negative testing", () => {
    test("token is invalid", () => {
        const token = "ed49c412-6b7-42f8-87d8-e44a21253068";
        const {error} = validateVerifyToken(token);
        expect(error).toBeDefined();
    });
    test("token is empty", () => {
        const token = "";
        const {error} = validateVerifyToken(token);
        expect(error).toBeDefined();
    });
});