const request = require("supertest");
const User = require("../../models/user.model");
const { createCostsApp } = require("../../src/processes/costs.process");
const { initDb, clearDb, closeDb } = require("./test-db");

describe("costs process endpoints", () => {
  const app = createCostsApp();

  beforeAll(async () => {
    await initDb();
  });

  beforeEach(async () => {
    await User.createUser({
      id: 123123,
      first_name: "mosh",
      last_name: "israeli",
      birthday: new Date("1990-01-01")
    });
  });

  afterEach(async () => {
    await clearDb();
  });

  afterAll(async () => {
    await closeDb();
  });

  test("POST /api/add adds a cost item", async () => {
    const res = await request(app).post("/api/add").send({
      userid: 123123,
      description: "milk",
      category: "food",
      sum: 8
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.userid).toBe(123123);
    expect(res.body.category).toBe("food");
  });

  test("POST /api/add rejects past month cost", async () => {
    const res = await request(app).post("/api/add").send({
      userid: 123123,
      description: "old",
      category: "food",
      sum: 4,
      createdAt: "2025-01-01T10:00:00.000Z"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.id).toBe("VALIDATION_ERROR");
  });

  test("GET /api/report returns grouped categories", async () => {
    await request(app).post("/api/add").send({
      userid: 123123,
      description: "basketball",
      category: "sports",
      sum: 20
    });

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;

    const res = await request(app).get(`/api/report?id=123123&year=${year}&month=${month}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.userid).toBe(123123);
    expect(Array.isArray(res.body.costs)).toBe(true);
    expect(res.body.costs.length).toBe(5);
  });
});
