const { createVehicle, getAllVehicles, searchVehicles } = require("../services/vehicleService");

function create(req, res) {
  try {
    const vehicle = createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

function list(req, res) {
  try {
    const vehicles = getAllVehicles();
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

function search(req, res) {
  try {
    const vehicles = searchVehicles(req.query);
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}

module.exports = { create, list, search };
