import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const BASE_URL = "https://inventorymanagementnode.onrender.com";

// ✅ Define your manual categories here
const categoriesList = ["Tank", "Sink", "ManHole", "PVC Pipe", "CPVC Pipe", "UPVC Pipe", "Paint", "Sistan", "Garden Pipe", "Fitting" , "Drum" , "Roll Pipe" , "Seat Cover" , "Fan" , "Fevicol"];

export default function AddProductModal({ open, onClose, godowns, onAdded }) {
  // Map the manual array to react-select format
  const categoryOptions = categoriesList.map((cat) => ({ value: cat, label: cat }));

  const [form, setForm] = useState({
    name: "",
    category: "",
    size: "",
    color: "",
    quantity: null,
    godownId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (godowns?.length) {
      const gid = godowns[0].id || godowns[0]._id;
      setForm((f) => ({ ...f, godownId: gid }));
    }
  }, [godowns]);

  if (!open) return null;

  const handleAdd = async () => {
    if (loading) return;
    if (!form.name.trim() || !form.category.trim())
      return alert("Please enter product name and category");
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/godown/${form.godownId}/add-product`, form);
      alert("✅ Product added successfully!");
      onAdded();
      onClose();
    } catch (err) {
      console.error("❌ Add Product Error:", err);
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "2.5rem",
      padding: "0.25rem 0.5rem",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(59,130,246,0.3)"
        : "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 text-center">Add New Product</h3>

        {/* Godown */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Godown</label>
          <select
            value={form.godownId}
            onChange={(e) => setForm({ ...form, godownId: e.target.value })}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm"
          >
            {godowns.map((g) => (
              <option key={g.id || g._id} value={g.id || g._id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Name</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm"
            placeholder="Enter product name"
            value={form.name}
            disabled={loading}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Category</label>
          <Select
            className="w-full"
            classNamePrefix="react-select"
            options={categoryOptions}
            onChange={(selected) => setForm({ ...form, category: selected.value })}
            isDisabled={loading}
            placeholder="Select category"
            styles={customSelectStyles}
          />
        </div>

        {/* Size */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Size</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm"
            placeholder="Enter size"
            value={form.size}
            disabled={loading}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          />
        </div>

        {/* Color */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Color</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm"
            placeholder="Enter color"
            value={form.color}
            disabled={loading}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min={0}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm"
            placeholder="Enter quantity"
            value={form.quantity}
            disabled={loading}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            disabled={loading}
            onClick={onClose}
            className={`px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 ${
              loading ? "cursor-not-allowed bg-gray-300" : ""
            }`}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleAdd}
            className={`px-4 py-2 rounded-lg text-white bg-blue-900 hover:bg-blue-800 ${
              loading ? "cursor-not-allowed bg-blue-400" : ""
            }`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
