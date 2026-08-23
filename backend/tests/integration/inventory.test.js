const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/db/database");

const getToken = async (email = "buyer@example.com") => {
  await request(app)
    .post("/api/auth/register")
    .send({ email, password: "password123" });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "password123" });

  return res.body.token;
};

const getAdminToken = async (email = "invadmin@example.com") => {
  await request(app)
    .post("/api/auth/register")
    .send({ email, password: "password123" });

  db.prepare("UPDATE users SET role = ? WHERE email = ?").run("admin", email);

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "password123" });

  return res.body.token;
};

const createVehicle = async (token, quantity = 3) => {
  const res = await request(app)
    .post("/api/vehicles")
    .set("Authorization", `Bearer ${token}`)
    .send({ make: "Kia", model: "Seltos", category: "SUV", price: 24000, quantity });
  return res.body.id;
};

beforeEach(() => {
  db.exec("DELETE FROM users");
  db.exec("DELETE FROM vehicles");
});

describe("POST /api/vehicles/:id/purchase", () => {
  it("should decrease quantity by 1 on successful purchase", async () => {
    const token = await getToken();
    const id = await createVehicle(token, 3);

    const res = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(2);
  });

  it("should reject purchase when quantity is already 0", async () => {
    const token = await getToken();
    const id = await createVehicle(token, 0);

    const res = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);

    const check = db.prepare("SELECT quantity FROM vehicles WHERE id = ?").get(id);
    expect(check.quantity).toBe(0); // never goes negative
  });

  it("should return 404 when purchasing a non-existent vehicle", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/vehicles/99999/purchase")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });

  it("should reject purchase without a token", async () => {
    const res = await request(app).post("/api/vehicles/1/purchase");
    expect(res.statusCode).toBe(401);
  });

  it("should never let quantity drop below zero across repeated purchases", async () => {
    const token = await getToken();
    const id = await createVehicle(token, 1);

    await request(app).post(`/api/vehicles/${id}/purchase`).set("Authorization", `Bearer ${token}`);
    const secondAttempt = await request(app)
      .post(`/api/vehicles/${id}/purchase`)
      .set("Authorization", `Bearer ${token}`);

    expect(secondAttempt.statusCode).toBe(400);

    const check = db.prepare("SELECT quantity FROM vehicles WHERE id = ?").get(id);
    expect(check.quantity).toBe(0);
  });
});

describe("POST /api/vehicles/:id/restock", () => {
  it("should allow an admin to increase quantity", async () => {
    const adminToken = await getAdminToken();
    const id = await createVehicle(adminToken, 2);

    const res = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.quantity).toBe(7);
  });

  it("should reject restock by a non-admin user", async () => {
    const adminToken = await getAdminToken();
    const id = await createVehicle(adminToken, 2);
    const userToken = await getToken("nonadmin@example.com");

    const res = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(403);
  });

  it("should reject a restock amount of zero or negative", async () => {
    const adminToken = await getAdminToken();
    const id = await createVehicle(adminToken, 2);

    const res = await request(app)
      .post(`/api/vehicles/${id}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: -3 });

    expect(res.statusCode).toBe(400);
  });

  it("should return 404 when restocking a non-existent vehicle", async () => {
    const adminToken = await getAdminToken();

    const res = await request(app)
      .post("/api/vehicles/99999/restock")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ amount: 5 });

    expect(res.statusCode).toBe(404);
  });

  it("should reject restock without a token", async () => {
    const res = await request(app).post("/api/vehicles/1/restock").send({ amount: 5 });
    expect(res.statusCode).toBe(401);
  });
});
