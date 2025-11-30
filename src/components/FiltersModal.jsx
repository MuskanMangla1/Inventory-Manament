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
// Updated with 16px font-size to prevent mobile zoom
const selectStyles = {
  control: (base, state) => ({
    ...base,
    border: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    minHeight: "28px",
    cursor: "pointer",
    fontSize: "16px", // Prevent zoom on mobile
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
    fontSize: "16px", // Prevent zoom on mobile
    fontWeight: 500,
  }),
  input: (base) => ({
    ...base,
    color: "#374151",
    fontSize: "16px", // Prevent zoom on mobile
    margin: 0,
    padding: 0,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "16px", // Prevent zoom on mobile
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
    fontSize: "16px", // Prevent zoom on mobile
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
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (!categoryFilter || categoryFilter === "all") {
      return { label: "All Categories", value: "all" };
    }
    return { 
      label: categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1), 
      value: categoryFilter 
    };
  }, [categoryFilter]);

  const colorValue = useMemo(() => {
    if (!colorFilter || colorFilter === "all") {
      return { label: "All Colors", value: "all" };
    }
    return { 
      label: colorFilter.charAt(0).toUpperCase() + colorFilter.slice(1), 
      value: colorFilter 
    };
  }, [colorFilter]);

  const sizeValue = useMemo(() => {
    if (!sizeFilter || sizeFilter === "all") {
      return { label: "All Sizes", value: "all" };
    }
    return { 
      label: sizeFilter.charAt(0).toUpperCase() + sizeFilter.slice(1), 
      value: sizeFilter 
    };
  }, [sizeFilter]);

  const stockValue = useMemo(() => {
    if (stockFilter === "all" || !stockFilter) {
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
      document.addEventListener("touchstart", handleClickOutside);
      // Prevent body scroll when dropdown is open
      document.body.style.overflow = "hidden";
      // Prevent zoom on mobile
      document.body.style.touchAction = "pan-y";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    };
  }, [isOpen, onClose]);

  // Handle dropdown positioning to stay within viewport
  useEffect(() => {
    if (isOpen && dropdownRef.current && buttonRef.current) {
      const dropdown = dropdownRef.current;
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      if (isMobile) {
        // On mobile, make it full-width and centered
        dropdown.style.left = "50%";
        dropdown.style.transform = "translateX(-50%)";
        dropdown.style.width = "calc(100vw - 2rem)";
        dropdown.style.maxWidth = "calc(100vw - 2rem)";
      } else {
        // Desktop positioning
        dropdown.style.left = "0";
        dropdown.style.transform = "translateY(0)";
        const dropdownRect = dropdown.getBoundingClientRect();
        
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
    }
  }, [isOpen, isMobile]);

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

  const handleApply = useCallback((e) => {
    // Prevent zoom on mobile
    if (e) {
      e.preventDefault();
    }
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
        style={{ touchAction: 'manipulation', fontSize: '16px' }}
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

      {/* Premium Sliding Dropdown - Full width on mobile, normal on desktop */}
      <div
        ref={dropdownRef}
        className={`absolute top-16 z-50 transition-all duration-500 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        } ${
          isMobile 
            ? "left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)]" 
            : "left-0 w-80 sm:w-96"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-4 sm:p-5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-gray-200/60">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                <Filter size={18} className="text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
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
              style={{ touchAction: 'manipulation', fontSize: '16px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Filter Options - Scrollable container with max-height 60vh */}
          <div 
            ref={scrollContainerRef}
            className="space-y-2.5 max-h-[60vh] overflow-y-auto mb-4 pr-2
              [&::-webkit-scrollbar]:w-3 
              [&::-webkit-scrollbar]:h-3
              [&::-webkit-scrollbar-track]:bg-gray-100 
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-gray-400 
              [&::-webkit-scrollbar-thumb]:rounded-full 
              [&::-webkit-scrollbar-thumb]:hover:bg-gray-500
              [&::-webkit-scrollbar-thumb]:active:bg-gray-600
              scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y'
            }}
          >
            {/* Category Filter */}
            <FilterRow
              icon={Tag}
              label="Category"
              value={categoryValue}
              onChange={handleCategoryChange}
              options={categoryOptions}
              active={categoryFilter !== "all" && categoryFilter}
            />

            {/* Color Filter */}
            <FilterRow
              icon={Palette}
              label="Color"
              value={colorValue}
              onChange={handleColorChange}
              options={colorOptions}
              active={colorFilter !== "all" && colorFilter}
            />

            {/* Size Filter */}
            <FilterRow
              icon={Ruler}
              label="Size"
              value={sizeValue}
              onChange={handleSizeChange}
              options={sizeOptions}
              active={sizeFilter !== "all" && sizeFilter}
            />

            {/* Stock Filter */}
            <FilterRow
              icon={Package}
              label="Stock Status"
              value={stockValue}
              onChange={handleStockChange}
              options={stockOptions}
              active={stockFilter !== "all" && stockFilter}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-md active:scale-95"
              style={{ touchAction: 'manipulation', fontSize: '16px' }}
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
              style={{ touchAction: 'manipulation', fontSize: '16px' }}
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