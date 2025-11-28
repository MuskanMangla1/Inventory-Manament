import React from "react";
import Select from "react-select";

export default function FiltersModal({
  open,
  onClose,
  categories = [],
  colors = [],
  sizes = [],
  categoryFilter,
  setCategoryFilter,
  colorFilter,
  setColorFilter,
  sizeFilter,
  setSizeFilter,
  stockFilter,
  setStockFilter,
  resetFilters,
}) {
  if (!open) return null;

  const formatOptions = (arr) =>
    arr.map((el) => ({
      label: el.charAt(0).toUpperCase() + el.slice(1),
      value: el   ,
    }));

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}          // ← BACKDROP CLICK closes modal
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}   // ← MODAL click will NOT close
      >
        <h2 className="text-xl font-bold mb-4">Filters</h2>

        {/* Category */}
        <label className="font-medium">Category</label>
        <Select
          value={
            categoryFilter === "all"
              ? { label: "All Categories", value: "all" }
              : { label: categoryFilter, value: categoryFilter }
          }
          onChange={(val) => setCategoryFilter(val?.value || "all")}
          options={[{ label: "All Categories", value: "all" }, ...formatOptions(categories)]}
          className="mb-4"
        />

        {/* Color */}
        <label className="font-medium">Color</label>
        <Select
          value={
            colorFilter === "all"
              ? { label: "All Colors", value: "all" }
              : { label: colorFilter, value: colorFilter }
          }
          onChange={(val) => setColorFilter(val?.value || "all")}
          options={[{ label: "All Colors", value: "all" }, ...formatOptions(colors)]}
          className="mb-4"
        />

        {/* Size */}
        <label className="font-medium">Size</label>
        <Select
          value={
            sizeFilter === "all"
              ? { label: "All Sizes", value: "all" }
              : { label: sizeFilter, value: sizeFilter }
          }
          onChange={(val) => setSizeFilter(val?.value || "all")}
          options={[{ label: "All Sizes", value: "all" }, ...formatOptions(sizes)]}
          className="mb-4"
        />

        {/* Stock */}
        <label className="font-medium">Stock Status</label>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="block w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
        >
          <option value="all">All</option>
          <option value="low">Low Stock (≤10)</option>
          <option value="out">Out of Stock</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Reset
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
