import * as dotenv from "dotenv";

dotenv.config();

process.env.USE = "MYSQL";

import {validateLimitStart} from "../../../src/validations/general.validations";


describe("Positive testing", () => {
    test("limit and start is valid (1, 5)", () => {
        const limit = 1;
        const start = 5;

        const data = {
            _limit: limit, _start: start,
        };
        const {error} = validateLimitStart(data);
        expect(error).not.toBeDefined();
    });
});


describe("Negative testing", () => {
    test("Limit and start is negative(-5, -5)", () => {
        const limit = 5;
        const start = 5;

        const {error} = validateLimitStart(start, limit);
        expect(error).toBeDefined();
    });

    test("Test with out limit (start = 5)", () => {
        const start = 5;
        const data = {
            _start: start,
        };
        const {error} = validateLimitStart(data);
        expect(error).toBeDefined();
    });

    test("Test with out start (limit = 5)", () => {
        const limit = 5;
        const data = {
            _limit: limit,
        };
        const {error} = validateLimitStart(data);
        expect(error).toBeDefined();
    });

    test("With out params", () => {
        const {error} = validateLimitStart({});
        expect(error).toBeDefined();
    })
});