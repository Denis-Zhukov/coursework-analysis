import request from "supertest";
import {app} from "../src/app";

describe("POST /", () => {
    describe("Check the functionality", () => {
        test("Server should return response 200", async () => {
            const response = await request(app).get("/").send();
            expect(response.statusCode).toBe(200);
        });
    });
});