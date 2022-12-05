import * as dotenv from "dotenv";

dotenv.config();

process.env.USE = "MYSQL";

import {validateProductWithId} from "../../../src/validations/product.validations";
import {IProduct} from "../../../src/models/IProduct";

describe("positive testing", () => {
    test("valid product with one category", () => {
        const product: IProduct = {
            id: 1, name: "Молоко", description: "Вкусное", categories: ["Сладкое"],
        };

        const {error} = validateProductWithId(product);
        expect(error).not.toBeDefined();
    });

    test("valid product with some categories", () => {
        const product: IProduct = {
            id: 1, name: "Молоко", description: "Вкусное", categories: ["Сладкое", "Жидкое", "Вкусное"],
        };

        const {error} = validateProductWithId(product);
        expect(error).not.toBeDefined();
    });
});


describe("negative testing", () => {
    test("product with no category", () => {
        const product: IProduct = {
            id: 1, name: "Молоко", description: "Вкусное", categories: [],
        };

        const {error} = validateProductWithId(product);
        expect(error).toBeDefined();
    });

    test("product without description", () => {
        const product: IProduct = {
            id: 1, name: "Молоко", description: "", categories: ["1"],
        };

        const {error} = validateProductWithId(product);
        expect(error).toBeDefined();
    });

    test("product without name", () => {
        const product: IProduct = {
            id: 1, name: "", description: "Some", categories: ["2"],
        };

        const {error} = validateProductWithId(product);
        expect(error).toBeDefined();
    });
});