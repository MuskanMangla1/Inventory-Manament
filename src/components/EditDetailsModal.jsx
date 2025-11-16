import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://inventory-management-k328.onrender.com";

export default function EditDetailsModal({ open, onClose, product, onUpdated }) {
  const [form, setForm] = useState({ name: "", category: "", size: "", color: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        size: product.size || "",
        color: product.color || "",
      });
    }
  }, [product]);

  if (!open || !product) return null;

  const handleUpdate = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await axios.patch(`${BASE_URL}/product/update`, {
        id: product._id || product.id,
        ...form,
      });
      alert("✅ Product details updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Error updating details:", err);
      alert("Failed to update product details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Product Details</h3>

        {/* Name */}
        <label className="text-sm text-gray-600 mb-1 block">Product Name</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Name"
          value={form.name}
          disabled={loading}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Category */}
        <label className="text-sm text-gray-600 mb-1 block">Category</label>
        <input
          list="category-list"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Category"
          value={form.category}
          disabled={loading}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        {/* Size */}
        <label className="text-sm text-gray-600 mb-1 block">Size</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Size"
          value={form.size}
          disabled={loading}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />

        {/* Color */}
        <label className="text-sm text-gray-600 mb-1 block">Color</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Color"
          value={form.color}
          disabled={loading}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
