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
  const vehicle = db.prepare("SELECT * FROM vehicles WHERE id = ?").get(id);
  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }
  return vehicle;
}

module.exports = { createVehicle, getAllVehicles, getVehicleById, validateVehicleInput };
