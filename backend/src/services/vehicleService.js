const db = require("../db/database");
const AppError = require("../utils/AppError");

function validateVehicleInput({ make, model, category, price, quantity }) {
  if (!make || !model || !category) {
    throw new AppError("make, model, and category are required", 400);
  }
  if (typeof price !== "number" || price < 0) {
    throw new AppError("price must be a non-negative number", 400);
  }
  if (typeof quantity !== "number" || quantity < 0) {
    throw new AppError("quantity must be a non-negative number", 400);
  }
}

function createVehicle(data) {
  validateVehicleInput(data);

  const { make, model, category, price, quantity } = data;
  const result = db
    .prepare("INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)")
    .run(make, model, category, price, quantity);

  return getVehicleById(Number(result.lastInsertRowid));
}

function getAllVehicles() {
  return db.prepare("SELECT * FROM vehicles").all();
}

function getVehicleById(id) {
  const vehicle = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(Number(id));
  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }
  return vehicle;
}

function searchVehicles(filters) {
  const { make, model, category, minPrice, maxPrice } = filters;

  let query = "SELECT * FROM vehicles WHERE 1=1";
  const params = [];

  if (make) {
    query += " AND LOWER(make) = LOWER(?)";
    params.push(make);
  }
  if (model) {
    query += " AND LOWER(model) = LOWER(?)";
    params.push(model);
  }
  if (category) {
    query += " AND LOWER(category) = LOWER(?)";
    params.push(category);
  }
  if (minPrice !== undefined) {
    query += " AND price >= ?";
    params.push(Number(minPrice));
  }
  if (maxPrice !== undefined) {
    query += " AND price <= ?";
    params.push(Number(maxPrice));
  }

  return db.prepare(query).all(...params);
}

function updateVehicle(id, data) {
  getVehicleById(id); // throws 404 if missing
  validateVehicleInput(data);

  const { make, model, category, price, quantity } = data;
  db.prepare(
    "UPDATE vehicles SET make = ?, model = ?, category = ?, price = ?, quantity = ? WHERE id = ?"
  ).run(make, model, category, price, quantity, Number(id));

  return getVehicleById(id);
}

function deleteVehicle(id) {
  getVehicleById(id); // throws 404 if missing
  db.prepare("DELETE FROM vehicles WHERE id = ?").run(Number(id));
  return { message: "Vehicle deleted successfully" };
}

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  validateVehicleInput
};
