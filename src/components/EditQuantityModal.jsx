import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "https://inventorymanagementnode.onrender.com";

export default function EditQuantityModal({ open, onClose, product, onUpdated }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open || !product) return null;

  const updateQuantity = async (type) => {
    if (loading || !amount || Number(amount) <= 0) {
      alert("🚫 Please enter a valid positive number.");
      return;
    }

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
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-slide-up">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Edit Quantity</h3>
        <p className="text-gray-600 mb-4 text-center font-medium">{product.name}</p>

        <input
          type="number"
          min="1"
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 shadow-md text-gray-800"
          placeholder="Enter quantity amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
        />

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => updateQuantity("add")}
            disabled={loading}
            className={`flex-1 px-5 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-md ${
              loading ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Adding..." : "Add"}
          </button>
          <button
            onClick={() => updateQuantity("subtract")}
            disabled={loading}
            className={`flex-1 px-5 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-md ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Removing..." : "Subtract"}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
              loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200 shadow-sm"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
