import {validateLoginData} from "../../../src/validations/auth.validations";
import {ILoginData} from "../../../src/models/ILoginData";

describe("positive testing", () => {
    test("data is valid", () => {
        const data: ILoginData = {
            username: "Hachiko", password: "Coolandlager1~",
        };

        const {error} = validateLoginData(data);
        expect(error).not.toBeDefined();
    });
    test("data is valid, login has under-dash", () => {
        const data: ILoginData = {
            username: "Hach_iko", password: "Coolandlager1~",
        };

        const {error} = validateLoginData(data);
        expect(error).not.toBeDefined();
    });
});

describe("negative testing", () => {
    test("data without username", () => {
        const data: ILoginData = {
            username: "", password: "Coolandlager1~",
        };

        const {error} = validateLoginData(data);
        expect(error).toBeDefined();
    });

    test("data without password", () => {
        const data: ILoginData = {
            username: "Hachiko", password: "",
        };

        const {error} = validateLoginData(data);
        expect(error).toBeDefined();
    });
});