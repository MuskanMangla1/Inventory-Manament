import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

const BASE_URL = "https://inventory-management-k328.onrender.com";

export default function AddProductModal({ open, onClose, godowns, onAdded, existingCategories }) {
  const categoryOptions = existingCategories.map((cat) => ({ value: cat, label: cat }));
  const [form, setForm] = useState({ name: "", category: "", size: "", color: "", quantity: 1, godownId: "" });
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
    if (!form.name.trim() || !form.category.trim()) return alert("Please enter product name and category");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Product</h3>

        {/* Godown */}
        <label className="text-sm text-gray-600 mb-1 block">Godown</label>
        <select
          value={form.godownId}
          onChange={(e) => setForm({ ...form, godownId: e.target.value })}
          disabled={loading}
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          {godowns.map((g) => (
            <option key={g.id || g._id} value={g.id || g._id}>
              {g.name}
            </option>
          ))}
        </select>

        {/* Name */}
        <label className="text-sm text-gray-600 mb-1 block">Name</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Enter product name"
          value={form.name}
          disabled={loading}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Category */}
        <label className="text-sm text-gray-600 mb-1 block">Category</label>
        <Select
          className="mb-3"
          classNamePrefix="react-select"
          options={categoryOptions}
          onChange={(selected) => setForm({ ...form, category: selected.value })}
          isDisabled={loading}
          placeholder="Select category"
        />

        {/* Size */}
        <label className="text-sm text-gray-600 mb-1 block">Size</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Enter size"
          value={form.size}
          disabled={loading}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />

        {/* Color */}
        <label className="text-sm text-gray-600 mb-1 block">Color</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Enter color"
          value={form.color}
          disabled={loading}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />

        {/* Quantity */}
        <label className="text-sm text-gray-600 mb-1 block">Quantity</label>
        <input
          type="number"
          min="0"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Enter quantity"
          value={form.quantity}
          disabled={loading}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
        />

        <div className="flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleAdd}
            className={`px-4 py-2 text-white rounded-lg ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"}`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
