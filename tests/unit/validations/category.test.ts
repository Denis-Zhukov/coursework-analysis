import * as dotenv from "dotenv";

dotenv.config();

process.env.USE = "MYSQL";

import {validateCategoryWithId} from "../../../src/validations/category.validations";
import {ICategory} from "../../../src/models/ICategory";

describe("positive testing", () => {
    test("category is valid", () => {
        const category: ICategory = {
            id: 1, name: "Сладкое",
        };

        const {error} = validateCategoryWithId(category);
        expect(error).not.toBeDefined();
    });
});


describe("negative testing", () => {
    test("category without name", () => {
        const category: ICategory = {
            id: 1, name: "",
        };

        const {error} = validateCategoryWithId(category);
        expect(error).toBeDefined();
    });
});