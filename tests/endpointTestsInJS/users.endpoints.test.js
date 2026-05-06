const request = require("supertest");
const User = require("../../models/user.model");
const { createUsersApp } = require("../../src/processes/users.process");
const { initDb, clearDb, closeDb } = require("./test-db");

describe("users process endpoints", () => {
  const app = createUsersApp();

  beforeAll(async () => {
    await initDb();
  });

  afterEach(async () => {
    await clearDb();
  });

  afterAll(async () => {
    await closeDb();
  });

  test("POST /api/add adds a user", async () => {
    const res = await request(app).post("/api/add").send({
      id: 111111,
      first_name: "john",
      last_name: "doe",
      birthday: "1999-01-01"
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe(111111);
    expect(res.body.first_name).toBe("john");
  });

  test("GET /api/users returns all users", async () => {
    await User.createUser({
      id: 123123,
      first_name: "mosh",
      last_name: "israeli",
      birthday: new Date("1990-01-01")
    });

    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].id).toBe(123123);
  });

  test("GET /api/users/:id returns user details with total", async () => {
    await User.createUser({
      id: 123123,
      first_name: "mosh",
      last_name: "israeli",
      birthday: new Date("1990-01-01")
    });

    const res = await request(app).get("/api/users/123123");
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(123123);
    expect(res.body.first_name).toBe("mosh");
    expect(res.body).toHaveProperty("total");
  });
});
