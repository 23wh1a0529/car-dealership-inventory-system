require("dotenv").config();
const db = require("./database");
const bcrypt = require("bcryptjs");

db.exec("DELETE FROM vehicles");
db.exec("DELETE FROM users");

const adminPassword = bcrypt.hashSync("admin123", 10);
db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)")
  .run("admin@autoledger.com", adminPassword, "admin");

const userPassword = bcrypt.hashSync("user123", 10);
db.prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)")
  .run("buyer@autoledger.com", userPassword, "user");

const vehicles = [
  ["Toyota", "Corolla", "Sedan", 1850000, 5],
  ["Toyota", "Fortuner", "SUV", 4200000, 2],
  ["Honda", "City", "Sedan", 1350000, 6],
  ["Honda", "CR-V", "SUV", 3600000, 0],
  ["Hyundai", "Creta", "SUV", 1450000, 4],
  ["Maruti Suzuki", "Swift", "Hatchback", 750000, 8],
  ["Tata", "Nexon", "SUV", 1200000, 3],
  ["Mahindra", "Thar", "SUV", 1650000, 1],
  ["Kia", "Seltos", "SUV", 1550000, 5],
  ["Ford", "Endeavour", "SUV", 3800000, 0]
];

const insert = db.prepare(
  "INSERT INTO vehicles (make, model, category, price, quantity) VALUES (?, ?, ?, ?, ?)"
);
vehicles.forEach((v) => insert.run(...v));

console.log("Seed complete:");
console.log("  Admin login -> admin@autoledger.com / admin123");
console.log("  User login  -> buyer@autoledger.com / user123");
console.log(`  ${vehicles.length} vehicles inserted`);
