/* eslint-disable no-undef */
/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/tests/jest.setup.ts"],
  testMatch: ["**/*.spec.ts"],
};
