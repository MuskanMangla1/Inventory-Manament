import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Select from "react-select";
import { 
  X, 
  Tag, 
  Palette, 
  Ruler, 
  Package, 
  RotateCcw,
  Check,
  Filter
} from "lucide-react";

// Memoized React-Select styles - defined outside component to prevent recreation
const selectStyles = {
  control: (base, state) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    minHeight: "28px",
    cursor: "pointer",
    "&:hover": {
      border: "none",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
  }),
  singleValue: (base, state) => ({
    ...base,
    color: state.selectProps.isActive ? "#2563eb" : "#6b7280",
    fontSize: "0.875rem",
    fontWeight: 500,
  }),
  input: (base) => ({
    ...base,
    color: "#374151",
    fontSize: "0.875rem",
    margin: 0,
    padding: 0,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "0.875rem",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#9ca3af",
    padding: "4px",
    "&:hover": {
      color: "#6b7280",
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb",
    marginTop: "4px",
    zIndex: 9999,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: "4px",
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: "0.5rem",
    margin: "4px",
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#eff6ff"
      : "transparent",
    color: state.isSelected ? "white" : "#374151",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: state.isSelected ? "#3b82f6" : "#eff6ff",
    },
  }),
};

// Memoized FilterRow component to prevent unnecessary re-renders
const FilterRow = React.memo(({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  options, 
  active = false 
}) => {
  return (
    <div
      className={`group relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
        active
          ? "bg-blue-50 border border-blue-200/50"
          : "bg-white/80 hover:bg-white border border-transparent hover:border-gray-200"
      } shadow-sm hover:shadow-md`}
    >
      {/* Icon */}
      <div
        className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
          active
            ? "bg-blue-500 text-white shadow-md"
            : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
        }`}
      >
        <Icon size={18} />
      </div>

      {/* Label and Value */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-700 mb-0.5">
          {label}
        </div>
        <Select
          value={value}
          onChange={onChange}
          options={options}
          className="react-select-container"
          classNamePrefix="react-select"
          isSearchable={true}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          isActive={active}
          styles={selectStyles}
          placeholder="Search or select..."
          noOptionsMessage={({ inputValue }) => 
            inputValue ? `No results for "${inputValue}"` : "No options available"
          }
        />
      </div>

      {/* Active indicator */}
      {active && (
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.label === nextProps.label &&
    prevProps.active === nextProps.active &&
    prevProps.value?.value === nextProps.value?.value &&
    prevProps.options === nextProps.options &&
    prevProps.onChange === nextProps.onChange
  );
});

FilterRow.displayName = "FilterRow";

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Sync internal state with external open prop
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  // Calculate applied filters count
  const appliedFiltersCount = useMemo(() => {
    let count = 0;
    if (categoryFilter && categoryFilter !== "all") count++;
    if (colorFilter && colorFilter !== "all") count++;
    if (sizeFilter && sizeFilter !== "all") count++;
    if (stockFilter && stockFilter !== "all") count++;
    return count;
  }, [categoryFilter, colorFilter, sizeFilter, stockFilter]);

  // Memoize formatOptions function results
  const categoryOptions = useMemo(() => {
    const formatOptions = (arr) =>
      arr.map((el) => ({
        label: el.charAt(0).toUpperCase() + el.slice(1),
        value: el,
      }));
    return [
      { label: "All Categories", value: "all" },
      ...formatOptions(categories),
    ];
  }, [categories]);

  const colorOptions = useMemo(() => {
    const formatOptions = (arr) =>
      arr.map((el) => ({
        label: el.charAt(0).toUpperCase() + el.slice(1),
        value: el,
      }));
    return [
      { label: "All Colors", value: "all" },
      ...formatOptions(colors),
    ];
  }, [colors]);

  const sizeOptions = useMemo(() => {
    const formatOptions = (arr) =>
      arr.map((el) => ({
        label: el.charAt(0).toUpperCase() + el.slice(1),
        value: el,
      }));
    return [
      { label: "All Sizes", value: "all" },
      ...formatOptions(sizes),
    ];
  }, [sizes]);

  const stockOptions = useMemo(() => [
    { label: "All Stock", value: "all" },
    { label: "Low Stock (≤10)", value: "low" },
    { label: "Out of Stock", value: "out" },
  ], []);

  // Memoize value objects to prevent unnecessary re-renders
  const categoryValue = useMemo(() => {
    return categoryFilter === "all"
      ? { label: "All Categories", value: "all" }
      : { label: categoryFilter, value: categoryFilter };
  }, [categoryFilter]);

  const colorValue = useMemo(() => {
    return colorFilter === "all"
      ? { label: "All Colors", value: "all" }
      : { label: colorFilter, value: colorFilter };
  }, [colorFilter]);

  const sizeValue = useMemo(() => {
    return sizeFilter === "all"
      ? { label: "All Sizes", value: "all" }
      : { label: sizeFilter, value: sizeFilter };
  }, [sizeFilter]);

  const stockValue = useMemo(() => {
    if (stockFilter === "all") {
      return { label: "All Stock", value: "all" };
    } else if (stockFilter === "low") {
      return { label: "Low Stock (≤10)", value: "low" };
    } else {
      return { label: "Out of Stock", value: "out" };
    }
  }, [stockFilter]);

  // Memoize onChange handlers with useCallback
  const handleCategoryChange = useCallback((val) => {
    setCategoryFilter(val?.value || "all");
  }, [setCategoryFilter]);

  const handleColorChange = useCallback((val) => {
    setColorFilter(val?.value || "all");
  }, [setColorFilter]);

  const handleSizeChange = useCallback((val) => {
    setSizeFilter(val?.value || "all");
  }, [setSizeFilter]);

  const handleStockChange = useCallback((val) => {
    setStockFilter(val?.value || "all");
  }, [setStockFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        buttonRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle dropdown positioning to stay within viewport
  useEffect(() => {
    if (isOpen && dropdownRef.current && buttonRef.current) {
      const dropdown = dropdownRef.current;
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Check if dropdown goes below viewport
      if (rect.bottom + dropdownRect.height > viewportHeight) {
        dropdown.style.maxHeight = `${viewportHeight - rect.bottom - 20}px`;
      }

      // Check if dropdown goes to the right of viewport
      if (rect.left + dropdownRect.width > viewportWidth) {
        dropdown.style.right = "0";
        dropdown.style.left = "auto";
      }
    }
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      if (!newState && onClose) {
        onClose();
      }
      return newState;
    });
  }, [onClose]);

  const handleReset = useCallback(() => {
    if (resetFilters) resetFilters();
  }, [resetFilters]);

  const handleApply = useCallback(() => {
    setIsOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  return (
    <div className="relative" ref={buttonRef}>
      {/* Filter Count Badge */}
      {appliedFiltersCount > 0 && (
        <div className="absolute -top-2 -right-2 z-20 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg transition-all duration-300 animate-pulse">
          {appliedFiltersCount}
        </div>
      )}

      {/* Premium Hamburger Icon Button */}
      <button
        onClick={toggleDropdown}
        className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 via-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group border border-gray-700/50"
        aria-label="Toggle filters"
      >
        {/* Animated Hamburger Lines */}
        <div className="relative w-5 h-4 flex flex-col justify-between">
          <span
            className={`absolute top-0 left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          <span
            className={`absolute top-1.5 left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${
              isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
            }`}
          />
          <span
            className={`absolute top-3 left-0 w-full h-0.5 bg-white rounded-full transition-all duration-300 ease-out ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </div>
      </button>

      {/* Premium Sliding Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute top-16 left-0 w-80 sm:w-96 z-50 transition-all duration-500 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(-16px)",
        }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200/60">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Filter size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Filters
              </h2>
              {appliedFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {appliedFiltersCount} active
                </span>
              )}
            </div>
            <button
              onClick={toggleDropdown}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>

          {/* Filter Options - List Row Style */}
          <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1 mb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
            {/* Category Filter */}
            <FilterRow
              icon={Tag}
              label="Category"
              value={categoryValue}
              onChange={handleCategoryChange}
              options={categoryOptions}
              active={categoryFilter !== "all"}
            />

            {/* Color Filter */}
            <FilterRow
              icon={Palette}
              label="Color"
              value={colorValue}
              onChange={handleColorChange}
              options={colorOptions}
              active={colorFilter !== "all"}
            />

            {/* Size Filter */}
            <FilterRow
              icon={Ruler}
              label="Size"
              value={sizeValue}
              onChange={handleSizeChange}
              options={sizeOptions}
              active={sizeFilter !== "all"}
            />

            {/* Stock Filter */}
            <FilterRow
              icon={Package}
              label="Stock Status"
              value={stockValue}
              onChange={handleStockChange}
              options={stockOptions}
              active={stockFilter !== "all"}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <Check size={16} />
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
