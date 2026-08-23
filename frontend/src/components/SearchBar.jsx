import { useState } from "react";

function SearchBar({ onSearch, onReset }) {
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    category: "",
    minPrice: "",
    maxPrice: ""
  });

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(filters);
  }

  function handleReset() {
    setFilters({ make: "", model: "", category: "", minPrice: "", maxPrice: "" });
    onReset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-xl border border-ink/10 p-4 mb-8 flex flex-wrap gap-3 items-end"
    >
      <div className="flex-1 min-w-[120px]">
        <label className="font-body text-xs text-ink/50 block mb-1">Make</label>
        <input
          name="make"
          value={filters.make}
          onChange={handleChange}
          placeholder="Toyota"
          className="w-full rounded-lg border border-ink/15 px-3 py-1.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
      </div>
      <div className="flex-1 min-w-[120px]">
        <label className="font-body text-xs text-ink/50 block mb-1">Model</label>
        <input
          name="model"
          value={filters.model}
          onChange={handleChange}
          placeholder="Corolla"
          className="w-full rounded-lg border border-ink/15 px-3 py-1.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
      </div>
      <div className="flex-1 min-w-[120px]">
        <label className="font-body text-xs text-ink/50 block mb-1">Category</label>
        <input
          name="category"
          value={filters.category}
          onChange={handleChange}
          placeholder="Sedan"
          className="w-full rounded-lg border border-ink/15 px-3 py-1.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
      </div>
      <div className="w-24">
        <label className="font-body text-xs text-ink/50 block mb-1">Min (Rs)</label>
        <input
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleChange}
          className="w-full rounded-lg border border-ink/15 px-3 py-1.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
      </div>
      <div className="w-24">
        <label className="font-body text-xs text-ink/50 block mb-1">Max (Rs)</label>
        <input
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleChange}
          className="w-full rounded-lg border border-ink/15 px-3 py-1.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal/40"
        />
      </div>
      <button
        type="submit"
        className="bg-teal text-white font-body font-medium text-sm px-4 py-1.5 rounded-lg transition-colors duration-150 hover:bg-teal/90"
      >
        Search
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="text-ink/50 font-body text-sm px-2 py-1.5"
      >
        Reset
      </button>
    </form>
  );
}

export default SearchBar;
