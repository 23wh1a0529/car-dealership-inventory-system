import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import {
  getAllVehicles,
  searchVehicles,
  purchaseVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  restockVehicle
} from "../api/vehicles";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";
import VehicleFormModal from "../components/VehicleFormModal";

function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  async function loadVehicles() {
    setLoading(true);
    setError("");
    try {
      const data = await getAllVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  async function handleSearch(filters) {
    setLoading(true);
    setError("");
    try {
      const data = await searchVehicles(filters);
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(id) {
    const updated = await purchaseVehicle(id);
    setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
  }

  async function handleRestock(id, amount) {
    const updated = await restockVehicle(id, amount);
    setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
  }

  async function handleDelete(id) {
    await deleteVehicle(id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }

  function openAddModal() {
    setEditingVehicle(null);
    setModalOpen(true);
  }

  function openEditModal(vehicle) {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  }

  async function handleSave(data) {
    if (editingVehicle) {
      const updated = await updateVehicle(editingVehicle.id, data);
      setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    } else {
      const created = await createVehicle(data);
      setVehicles((prev) => [...prev, created]);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <nav className="bg-surface px-6 py-4 flex items-center justify-between border-b border-teal/15">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <span className="font-body text-ink/60 text-sm">
            {user?.email} {isAdmin ? "(Admin)" : ""}
          </span>
          <button
            onClick={logout}
            className="font-body text-sm text-signal border border-signal/30 rounded-lg px-3 py-1.5 transition-colors duration-150 hover:bg-signal/5"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Vehicle Inventory</h1>
          {isAdmin && (
            <button
              onClick={openAddModal}
              className="bg-teal text-white font-body font-medium text-sm px-4 py-2 rounded-lg transition-colors duration-150 hover:bg-teal/90"
            >
              + Add Vehicle
            </button>
          )}
        </div>

        <SearchBar onSearch={handleSearch} onReset={loadVehicles} />

        {error && (
          <div className="bg-signal/10 border border-signal/30 text-signal text-sm rounded-lg px-3 py-2 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <p className="font-body text-ink/50">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-display text-lg text-ink/70 mb-1">No vehicles found</p>
            <p className="font-body text-sm text-ink/50">
              Try adjusting your filters, or reset to see the full inventory.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((vehicle, i) => (
              <div key={vehicle.id} className="fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
                <VehicleCard
                  vehicle={vehicle}
                  isAdmin={isAdmin}
                  onPurchase={handlePurchase}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                  onRestock={handleRestock}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <VehicleFormModal
          vehicle={editingVehicle}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Dashboard;

