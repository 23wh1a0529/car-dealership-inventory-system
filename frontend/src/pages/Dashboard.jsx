import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllVehicles, searchVehicles, purchaseVehicle } from "../api/vehicles";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";

function Dashboard() {
  const { user, logout } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-canvas">
      <nav className="bg-surface px-6 py-4 flex items-center justify-between border-b border-teal/15">
        <span className="font-display text-teal text-xl font-semibold tracking-tight">
          AutoLedger
        </span>
        <div className="flex items-center gap-4">
          <span className="font-body text-ink/60 text-sm">
            {user?.email} {user?.role === "admin" ? "(Admin)" : ""}
          </span>
          <button
            onClick={logout}
            className="font-body text-sm text-signal border border-signal/30 rounded-lg px-3 py-1.5"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-semibold text-ink mb-6">
          Vehicle Inventory
        </h1>

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
                <VehicleCard vehicle={vehicle} onPurchase={handlePurchase} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;

