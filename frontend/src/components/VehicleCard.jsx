import { useState } from "react";

function stockColor(quantity) {
  if (quantity === 0) return "bg-signal";
  if (quantity <= 2) return "bg-gold";
  return "bg-turquoise";
}

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function VehicleCard({ vehicle, isAdmin, onPurchase, onEdit, onDelete, onRestock }) {
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");
  const [restockAmount, setRestockAmount] = useState("");
  const [restocking, setRestocking] = useState(false);
  const barWidth = Math.min(100, (vehicle.quantity / 10) * 100);

  async function handlePurchase() {
    setError("");
    setPurchasing(true);
    try {
      await onPurchase(vehicle.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestock() {
    if (!restockAmount || Number(restockAmount) <= 0) return;
    setRestocking(true);
    setError("");
    try {
      await onRestock(vehicle.id, Number(restockAmount));
      setRestockAmount("");
    } catch (err) {
      setError(err.message);
    } finally {
      setRestocking(false);
    }
  }

  function handleDelete() {
    if (window.confirm(`Delete ${vehicle.make} ${vehicle.model}? This can't be undone.`)) {
      onDelete(vehicle.id);
    }
  }

  return (
    <div className="bg-surface rounded-xl p-5 shadow-sm border border-ink/10 relative flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <span className="absolute top-4 right-4 font-mono text-xs text-ink/40 uppercase tracking-wide">
        STK #{String(vehicle.id).padStart(4, "0")}
      </span>

      <span className="font-body text-xs text-teal font-medium uppercase tracking-wide mb-1">
        {vehicle.category}
      </span>
      <h3 className="font-display text-lg font-semibold text-ink mb-1">
        {vehicle.make} {vehicle.model}
      </h3>
      <p className="font-mono text-2xl text-ink font-medium mb-3">
        {formatINR(vehicle.price)}
      </p>

      <div className="mb-1 flex items-center justify-between">
        <span className="font-body text-xs text-ink/50">
          {vehicle.quantity === 0 ? "Out of stock" : `${vehicle.quantity} in stock`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-ink/10 overflow-hidden mb-4">
        <div
          className={`h-full ${stockColor(vehicle.quantity)} transition-all duration-300`}
          style={{ width: `${barWidth}%` }}
        ></div>
      </div>

      {error && <p className="font-body text-xs text-signal mb-2">{error}</p>}

      <button
        onClick={handlePurchase}
        disabled={vehicle.quantity === 0 || purchasing}
        className="bg-gold text-white font-body font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 hover:bg-gold/90"
      >
        {purchasing ? "Processing..." : vehicle.quantity === 0 ? "Out of stock" : "Purchase"}
      </button>

      {isAdmin && (
        <div className="mt-4 pt-4 border-t border-ink/10">
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="flex-1 text-xs font-body text-teal border border-teal/30 rounded-lg py-1.5 transition-colors duration-150 hover:bg-teal/5"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 text-xs font-body text-signal border border-signal/30 rounded-lg py-1.5 transition-colors duration-150 hover:bg-signal/5"
            >
              Delete
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              placeholder="Restock qty"
              value={restockAmount}
              onChange={(e) => setRestockAmount(e.target.value)}
              className="flex-1 rounded-lg border border-ink/15 px-2 py-1.5 font-body text-xs text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
            />
            <button
              onClick={handleRestock}
              disabled={restocking}
              className="text-xs font-body text-white bg-pine bg-teal px-3 py-1.5 rounded-lg disabled:opacity-50"
            >
              {restocking ? "..." : "Restock"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleCard;
