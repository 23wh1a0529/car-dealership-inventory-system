const request = require("supertest");
const app = require("../../src/app");

describe("POST /api/auth/register", () => {
  it("should register a new user and return 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).not.toHaveProperty("password");
  });

  it("should reject registration with a duplicate email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "dupe@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "dupe@example.com", password: "password123" });

    expect(res.statusCode).toBe(409);
  });

  it("should reject a password shorter than 6 characters", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "short@example.com", password: "123" });

    expect(res.statusCode).toBe(400);
  });
});
