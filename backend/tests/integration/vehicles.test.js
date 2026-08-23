const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/db/database");

const getToken = async (email = "vehicleuser@example.com") => {
  await request(app)
    .post("/api/auth/register")
    .send({ email, password: "password123" });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: "password123" });

  return res.body.token;
};

beforeEach(() => {
  db.exec("DELETE FROM users");
  db.exec("DELETE FROM vehicles");
});

describe("POST /api/vehicles", () => {
  it("should create a vehicle when authenticated", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: 22000, quantity: 5 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.make).toBe("Toyota");
  });

  it("should reject creation without a token", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: 22000, quantity: 5 });

    expect(res.statusCode).toBe(401);
  });

  it("should reject creation with a negative price", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: -500, quantity: 5 });

    expect(res.statusCode).toBe(400);
  });

  it("should reject creation with a negative quantity", async () => {
    const token = await getToken();

    const res = await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Toyota", model: "Corolla", category: "Sedan", price: 22000, quantity: -1 });

    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/vehicles", () => {
  it("should return an empty list when no vehicles exist", async () => {
    const token = await getToken();

    const res = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return all vehicles after creating one", async () => {
    const token = await getToken();

    await request(app)
      .post("/api/vehicles")
      .set("Authorization", `Bearer ${token}`)
      .send({ make: "Honda", model: "Civic", category: "Sedan", price: 21000, quantity: 3 });

    const res = await request(app)
      .get("/api/vehicles")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe("Civic");
  });

  it("should reject listing without a token", async () => {
    const res = await request(app).get("/api/vehicles");
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /api/vehicles/search", () => {
  const seedVehicles = async (token) => {
    const cars = [
      { make: "Toyota", model: "Corolla", category: "Sedan", price: 22000, quantity: 5 },
      { make: "Toyota", model: "RAV4", category: "SUV", price: 28000, quantity: 2 },
      { make: "Honda", model: "Civic", category: "Sedan", price: 21000, quantity: 4 },
      { make: "Ford", model: "Explorer", category: "SUV", price: 35000, quantity: 0 }
    ];
    for (const car of cars) {
      await request(app)
        .post("/api/vehicles")
        .set("Authorization", `Bearer ${token}`)
        .send(car);
    }
  };

  it("should filter by make", async () => {
    const token = await getToken();
    await seedVehicles(token);

    const res = await request(app)
      .get("/api/vehicles/search?make=Toyota")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.every(v => v.make === "Toyota")).toBe(true);
  });

  it("should filter by model", async () => {
    const token = await getToken();
    await seedVehicles(token);

    const res = await request(app)
      .get("/api/vehicles/search?model=Civic")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe("Civic");
  });

  it("should filter by category", async () => {
    const token = await getToken();
    await seedVehicles(token);

    const res = await request(app)
      .get("/api/vehicles/search?category=SUV")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body.every(v => v.category === "SUV")).toBe(true);
  });

  it("should filter by price range", async () => {
    const token = await getToken();
    await seedVehicles(token);

    const res = await request(app)
      .get("/api/vehicles/search?minPrice=25000&maxPrice=30000")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe("RAV4");
  });

  it("should combine multiple filters", async () => {
    const token = await getToken();
    await seedVehicles(token);

    const res = await request(app)
      .get("/api/vehicles/search?make=Toyota&category=SUV")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].model).toBe("RAV4");
  });

  it("should be case-insensitive on make/model/category", async () => {
    const token = await getToken();
    await seedVehicles(token);

    const res = await request(app)
      .get("/api/vehicles/search?make=toyota")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should return an empty array when nothing matches", async () => {
    const token = await getToken();
    await seedVehicles(token);

    const res = await request(app)
      .get("/api/vehicles/search?make=Ferrari")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should reject search without a token", async () => {
    const res = await request(app).get("/api/vehicles/search?make=Toyota");
    expect(res.statusCode).toBe(401);
  });
});
