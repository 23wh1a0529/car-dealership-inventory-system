import { useState, useEffect } from "react";

const CATEGORIES = ["Sedan", "SUV", "Hatchback", "Truck", "Coupe", "Van"];

function VehicleFormModal({ vehicle, onClose, onSave }) {
  const isEdit = Boolean(vehicle);
  const [form, setForm] = useState({
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    category: vehicle?.category || CATEGORIES[0],
    price: vehicle?.price || "",
    quantity: vehicle?.quantity ?? ""
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSave({
        make: form.make,
        model: form.model,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity)
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center px-4 z-50">
      <div className="bg-surface rounded-xl shadow-lg border border-ink/10 p-6 w-full max-w-md">
        <h2 className="font-display text-xl font-semibold text-ink mb-4">
          {isEdit ? "Edit Vehicle" : "Add Vehicle"}
        </h2>

        {error && (
          <div className="bg-signal/10 border border-signal/30 text-signal text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-ink/60 block mb-1">Make</label>
              <input
                name="make"
                required
                value={form.make}
                onChange={handleChange}
                className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
              />
            </div>
            <div>
              <label className="font-body text-xs text-ink/60 block mb-1">Model</label>
              <input
                name="model"
                required
                value={form.model}
                onChange={handleChange}
                className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
              />
            </div>
          </div>

          <div>
            <label className="font-body text-xs text-ink/60 block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-body text-xs text-ink/60 block mb-1">Price (Rs)</label>
              <input
                name="price"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
              />
            </div>
            <div>
              <label className="font-body text-xs text-ink/60 block mb-1">Quantity</label>
              <input
                name="quantity"
                type="number"
                min="0"
                required
                value={form.quantity}
                onChange={handleChange}
                className="w-full rounded-lg border border-ink/15 px-3 py-2 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-teal text-white font-body font-medium text-sm py-2 rounded-lg disabled:opacity-60 transition-colors duration-150 hover:bg-teal/90"
            >
              {saving ? "Saving..." : isEdit ? "Save changes" : "Add vehicle"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-body text-sm text-ink/60 border border-ink/15 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehicleFormModal;
