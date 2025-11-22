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
  // React-Select custom styles for better width and placeholder color
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "44px",
      borderColor: "#d1d5db", // gray-300
      boxShadow: "none",
      "&:hover": { borderColor: "#3b82f6" }, // blue-500
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6b7280", // gray-400
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* Search Input */}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search name or category"
        className="
          block w-full sm:w-60 md:w-72
          bg-white
          border border-gray-300
          rounded-md
          px-4 py-2
          text-gray-900
          placeholder-gray-400
          focus:outline-none
          focus:ring-2 focus:ring-blue-400
          focus:border-blue-400
          shadow-sm
          appearance-none
        "
      />

      {/* Category Filter */}
{/* Category Filter */}
<div className="w-full sm:w-60 md:w-72">
  <Select
    value={
      categoryFilter === "all"
        ? { label: "Search Categories", value: "all" }
        : { label: categoryFilter, value: categoryFilter }
    }
    onChange={(selected) =>
      setCategoryFilter(selected ? selected.value : "all")
    }
    options={[
      { label: "All Categories", value: "all" },
      ...categories.map((c) => ({
        label: c.charAt(0).toUpperCase() + c.slice(1),
        value: c,
      })),
    ]}
    className="w-full"
    classNamePrefix="react-select"
    styles={{
      control: (provided, state) => ({
        ...provided,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // 🔹 box shadow
        minHeight: "2.5rem", // 🔹 roughly py-2
        paddingTop: "0.25rem",
        paddingBottom: "0.25rem",
      }),
    }}
    isSearchable
    placeholder="Select category"
  />
</div>



      {/* Stock Filter */}
      <div className="relative w-full sm:w-40">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="
            block w-full
            bg-white
            border border-gray-300
            rounded-md
            px-4 py-2
            text-gray-900
            placeholder-gray-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-400
            focus:border-blue-400
            shadow-sm
            appearance-none
          "
        >
          <option value="" disabled hidden>
            Select filter
          </option>
          <option value="all">All</option>
          <option value="low">Low Stock (≤10)</option>
          <option value="out">Out of Stock</option>
        </select>

        {/* Dropdown arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
