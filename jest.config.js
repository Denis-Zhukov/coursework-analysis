process.env.NODE_ENV = "UNITTEST";
module.exports = {
    clearMocks: true,
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    preset: "ts-jest",
};