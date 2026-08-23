const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/db/database");

beforeEach(() => {
  db.exec("DELETE FROM users");
});

describe("POST /api/auth/login", () => {
  const registerTestUser = async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "login@example.com", password: "password123" });
  };

  it("should log in with correct credentials and return a token", async () => {
    await registerTestUser();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("should reject login with wrong password", async () => {
    await registerTestUser();

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
  });

  it("should reject login for a non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password123" });

    expect(res.statusCode).toBe(401);
  });
});
