const request = require("supertest");
const { createAboutApp } = require("../../src/processes/about.process");
const { initDb, clearDb, closeDb } = require("./test-db");

describe("about process endpoint", () => {
  const app = createAboutApp();

  beforeAll(async () => {
    await initDb();
  });

  afterEach(async () => {
    await clearDb();
  });

  afterAll(async () => {
    await closeDb();
  });

  test("GET /api/about returns team members", async () => {
    const res = await request(app).get("/api/about");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("first_name");
    expect(res.body[0]).toHaveProperty("last_name");
  });
});
