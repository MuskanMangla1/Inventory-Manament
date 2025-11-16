import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "https://inventory-management-k328.onrender.com";

export default function EditQuantityModal({ open, onClose, product, onUpdated }) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!open || !product) return null;

  const updateQuantity = async (type) => {
    if (loading) return;
    try {
      setLoading(true);
      const payload = {
        id: product._id || product.id,
        type: type === "add" ? "added" : "subtracted",
        val: Number(amount),
      };
      await axios.post(`${BASE_URL}/product/update-quantity`, payload);
      alert("✅ Quantity updated!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Error updating quantity:", err);
      alert("Failed to update quantity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Quantity - {product.name}</h3>

        <input
          type="number"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Enter quantity amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={loading}
        />

        <div className="flex justify-between gap-3">
          <button
            onClick={() => updateQuantity("add")}
            disabled={loading}
            className={`flex-1 px-4 py-2 text-white rounded-lg ${loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          >
            {loading ? "Adding..." : "Add"}
          </button>
          <button
            onClick={() => updateQuantity("subtract")}
            disabled={loading}
            className={`flex-1 px-4 py-2 text-white rounded-lg ${loading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
          >
            {loading ? "Removing..." : "Subtract"}
          </button>
        </div>

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
