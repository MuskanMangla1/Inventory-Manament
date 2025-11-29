import React from "react";

export default function ProductFilters({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {/* SEARCH BAR */}
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search name or category"
        className="block w-full sm:w-60 md:w-72 bg-white border border-gray-300
        rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
