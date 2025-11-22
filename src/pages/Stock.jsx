// src/pages/Stock.jsx
import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Package,
  Tag,
  Palette,
  Layers,
} from "lucide-react";

const BASE_URL = "https://inventory-management-k328.onrender.com";

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // ✅ new state to block buttons

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/product`);
      const data = res.data?.data || res.data || [];
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSelect = (id) => {
    const prod = products.find((p) => p.id === id || p._id === id);
    setSelected(prod);
  };

  const updateStock = async (type) => {
    if (!selected || !quantity || Number(quantity) <= 0) {
      alert("Please select a product and enter a valid quantity");
      return;
    }

    try {
      setUpdating(true); // ✅ disable buttons
      await axios.post(`${BASE_URL}/product/update-quantity`, {
        id: selected._id || selected.id,
        type,
        val: Number(quantity),
      });

      setRecent((r) => [
        {
          id: Date.now(),
          name: selected.name,
          type,
          val: quantity,
          at: new Date().toISOString(),
        },
        ...r,
      ]);

      await loadProducts();
      setQuantity("");
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert("Stock update failed");
    } finally {
      setUpdating(false); // ✅ re-enable buttons
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 pt-18 md:pt-2">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stock Management</h1>
        <p className="text-gray-500 mt-2">
          Record stock movements and track inventory transactions
        </p>
      </div>

      {/* Main Form Section */}
      <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-lg p-10">
        {loading ? (
          <p className="text-center text-gray-500 py-8">
            Loading products...
          </p>
        ) : (
          <div className="space-y-6">
            {/* Product Select */}
            {/* Product Select */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Select Product
  </label>
  <Select
    options={products.map((p) => ({
      value: p._id || p.id,
      label: `${p.name} — ${p.size} — ${p.color}`,
    }))}
    value={
      selected
        ? {
            value: selected._id || selected.id,
            label: `${selected.name} — ${selected.size}`,
          }
        : null
    }
    onChange={(option) => handleSelect(option.value)}
    placeholder="Search a product..."
    className="react-select-container"
    classNamePrefix="react-select"
    isSearchable
  />
</div>


            {/* Product Info */}
            {selected && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <Package className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">
                      {selected.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="text-green-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-semibold text-gray-800">
                      {selected.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Palette className="text-purple-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-semibold text-gray-800">
                      {selected.color || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Layers className="text-yellow-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Available Quantity</p>
                    <p className="font-semibold text-gray-800">
                      {selected.quantity}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => updateStock("added")}
                disabled={updating}
                className={`w-full sm:w-1/2 py-3 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  updating
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {updating ? (
                  <>
                    <ArrowUpCircle size={20} /> Adding...
                  </>
                ) : (
                  <>
                    <ArrowUpCircle size={20} /> Add Stock
                  </>
                )}
              </button>

              <button
                onClick={() => updateStock("subtracted")}
                disabled={updating}
                className={`w-full sm:w-1/2 py-3 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  updating
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {updating ? (
                  <>
                    <ArrowDownCircle size={20} /> Removing...
                  </>
                ) : (
                  <>
                    <ArrowDownCircle size={20} /> Remove Stock
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="w-full mt-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Recent Transactions
        </h3>

        {recent.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 border border-gray-200 p-5 rounded-lg text-center">
            No recent transactions this session.
          </p>
        ) : (
          <div className="space-y-4">
            {recent.map((t) => (
              <div
                key={t.id}
                className={`flex justify-between items-center p-4 rounded-lg border shadow-sm ${
                  t.type === "added"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div>
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div
                    className={`text-sm ${
                      t.type === "added" ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {t.type === "added" ? "Stock In" : "Stock Out"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">{t.val}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(t.at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
