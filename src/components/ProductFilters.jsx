import React from "react";
import Select from "react-select";

export default function ProductFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  filter,
  setFilter,
  categories = [],
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search name or category"
        className="border rounded-lg px-3 py-2 w-full sm:w-48 md:w-56 focus:ring-2 focus:ring-blue-400 outline-none"
      />

      {/* Category Filter */}
      <Select
        value={
          categoryFilter === "all"
            ? { label: "Search Categories", value: "all" }
            : { label: categoryFilter, value: categoryFilter }
        }
        onChange={(selected) => setCategoryFilter(selected ? selected.value : "all")}
        options={[
          { label: "All Categories", value: "all" },
          ...categories.map((c) => ({
            label: c.charAt(0).toUpperCase() + c.slice(1),
            value: c,
          })),
        ]}
        className="w-full sm:w-50"
        classNamePrefix="react-select"
        isSearchable
        placeholder="Select category"
      />

      {/* Stock Filter */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border rounded-lg px-3 py-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 outline-none"
      >
        <option value="all">All</option>
        <option value="in">In Stock</option>
        <option value="low">Low Stock (≤10)</option>
        <option value="out">Out of Stock</option>
      </select>
    </div>
  );
}
