import request from "./client";

export function getAllVehicles() {
  return request("/vehicles");
}

export function searchVehicles(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const query = params.toString();
  return request(`/vehicles/search${query ? `?${query}` : ""}`);
}

export function purchaseVehicle(id) {
  return request(`/vehicles/${id}/purchase`, { method: "POST" });
}

export function createVehicle(data) {
  return request("/vehicles", { method: "POST", body: JSON.stringify(data) });
}

export function updateVehicle(id, data) {
  return request(`/vehicles/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteVehicle(id) {
  return request(`/vehicles/${id}`, { method: "DELETE" });
}

export function restockVehicle(id, amount) {
  return request(`/vehicles/${id}/restock`, {
    method: "POST",
    body: JSON.stringify({ amount })
  });
}
