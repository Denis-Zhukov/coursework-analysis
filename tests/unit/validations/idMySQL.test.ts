import * as dotenv from "dotenv";

dotenv.config();

process.env.USE = "MYSQL";

import {validateId} from "../../../src/validations/general.validations";


describe("positive testing", () => {
    test("id is valid", () => {
        const {error} = validateId(1);
        expect(error).not.toBeDefined();
    });
});

describe("negative testing", () => {
    test("id is negative", () => {
        const {error} = validateId(-50);
        expect(error).toBeDefined();
    });
    test("id is 1", () => {
        const {error} = validateId(-1);
        expect(error).toBeDefined();
    });
    test("id is 0", () => {
        const {error} = validateId(0);
        expect(error).toBeDefined();
    });
});