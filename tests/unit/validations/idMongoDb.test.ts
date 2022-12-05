import * as dotenv from "dotenv";

dotenv.config();

process.env.USE = "MONGODB";

import {validateId} from "../../../src/validations/general.validations";
import {Id} from "../../../src/types/types";


describe("positive testing", () => {
    test("id is valid", () => {
        const id: Id = "507f1f77bcf86cd799439011";
        const {error} = validateId(id);
        expect(error).not.toBeDefined();
    });
});

describe("negative testing", () => {
    test("id is negative", () => {
        const {error} = validateId(-50);
        expect(error).toBeDefined();
    });
    test("id isn't correct length", () => {
        const id: Id = "507f1f77bcf86cd79439011";
        const {error} = validateId(id);
        expect(error).toBeDefined();
    });
    test("id have incorrect letter length", () => {
        const id: Id = "507f1f77bcf86od79439011";
        const {error} = validateId(id);
        expect(error).toBeDefined();
    });
    test("id is number", () => {
        const id: Id = 5;
        const {error} = validateId(id);
        expect(error).toBeDefined();
    });
});