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
