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

function VehicleCard({ vehicle, onPurchase }) {
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");
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
        className="mt-auto bg-gold text-white font-body font-medium text-sm px-4 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150 hover:bg-gold/90"
      >
        {purchasing ? "Processing..." : vehicle.quantity === 0 ? "Out of stock" : "Purchase"}
      </button>
    </div>
  );
}

export default VehicleCard;
