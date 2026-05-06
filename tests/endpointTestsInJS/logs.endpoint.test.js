const request = require("supertest");
const { createLogsApp } = require("../../src/processes/logs.process");
const { initDb, clearDb, closeDb } = require("./test-db");

describe("logs process endpoint", () => {
  const app = createLogsApp();

  beforeAll(async () => {
    await initDb();
  });

  afterEach(async () => {
    await clearDb();
  });

  afterAll(async () => {
    await closeDb();
  });

  test("GET /api/logs returns logs collection documents", async () => {
    const res = await request(app).get("/api/logs");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
