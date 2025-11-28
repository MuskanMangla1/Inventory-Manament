import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://inventorymanagementnode.onrender.com";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 space-y-5 animate-slide-up">
        <h3 className="text-2xl font-bold text-gray-800 text-center">Edit Product Details</h3>

        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1 font-medium">Product Name</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-md text-gray-800"
            placeholder="Name"
            value={form.name}
            disabled={loading}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1 font-medium">Category</label>
          <input
            list="category-list"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-md text-gray-800"
            placeholder="Category"
            value={form.category}
            disabled={loading}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </div>

        {/* Size */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1 font-medium">Size</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-md text-gray-800"
            placeholder="Size"
            value={form.size}
            disabled={loading}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
          />
        </div>

        {/* Color */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-700 mb-1 font-medium">Color</label>
          <input
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-md text-gray-800"
            placeholder="Color"
            value={form.color}
            disabled={loading}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
              loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200 shadow-sm"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-5 py-3 text-white rounded-xl font-semibold transition-all duration-200 shadow-md ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
