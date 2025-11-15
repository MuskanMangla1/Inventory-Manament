import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { PlusCircle, ArrowLeft, Pencil, BarChart3, Trash2 } from "lucide-react";

const BASE_URL = "https://inventory-management-k328.onrender.com";

// -------------------- TRANSACTIONS MODAL --------------------
function TransactionsModal({ open, onClose, product }) {
  if (!open || !product) return null;

  const transactions = product.transitions || [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
            🧾 Transaction History —{" "}
            <span className="text-blue-600">{product.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No transactions yet for this product.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[65vh] space-y-4 pr-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className={`flex items-center justify-between rounded-2xl p-5 shadow-md border transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                  t.type === "added"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex flex-col">
                  <p className="text-gray-700 text-lg font-semibold">
                    <span
                      className={`${
                        t.type === "added" ? "text-green-700" : "text-red-700"
                      } capitalize font-bold`}
                    >
                      {t.type}
                    </span>
                  </p>
                  <p className="text-gray-600 text-base mt-1">
                    Quantity:{" "}
                    <span className="font-semibold text-gray-800">
                      {t.quantity}
                    </span>
                  </p>
                  <p className="text-gray-500 text-sm font-mono mt-1 truncate">
                    Transaction ID: {t.id}
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    t.type === "added"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {t.type === "added" ? "Stock In" : "Stock Out"}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow hover:bg-blue-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GodownDetails() {
  const { id } = useParams();
  const [godown, setGodown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editQuantityOpen, setEditQuantityOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionState, setActionState] = useState({
    type: "", // "adding" | "saving" | "removing" | "addingProduct"
    loading: false,
  });
  const [newProduct, setNewProduct] = useState({
    category: "",
    name: "",
    size: "",
    color: "",
    quantity: "",
  });
  const categories =
  godown && godown.products
    ? [...new Set(godown.products.map((p) => p.category))]
    : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStock, setSelectedStock] = useState("");
  const [showTransactions, setShowTransactions] = useState(false);

  const loadGodownDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/godown/${id}`);
      const data = res.data?.data || res.data;
      setGodown(data);
    } catch (err) {
      console.error("❌ Error fetching godown details:", err);
      alert("Failed to load godown details");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.size) {
      alert("Please fill all required fields (category, name, size)");
      return;
    }
    try {
      setActionState({ type: "addingProduct", loading: true });
      await axios.post(`${BASE_URL}/godown/${id}/add-product`, newProduct);
      alert("✅ Product added successfully!");
      setShowModal(false);
      setNewProduct({
        category: "",
        name: "",
        size: "",
        color: "",
        quantity: "",
      });
      await loadGodownDetails();
    } catch (err) {
      console.error("❌ Error adding product:", err);
      alert("Failed to add product");
    } finally {
      setActionState({ type: "", loading: false });
    }
  };

  const handleDelete = async (pid) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setActionState({ type: "removing", loading: true });
      await axios.delete(`${BASE_URL}/product`, { data: { id: pid } });
      alert("🗑️ Product deleted successfully!");
      loadGodownDetails();
    } catch (err) {
      console.error("❌ Delete Error:", err);
      alert("Failed to delete product");
    } finally {
      setActionState({ type: "", loading: false });
    }
  };

  const handleUpdateQuantity = async (type, val) => {
    if (!val || Number(val) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    try {
      setActionState({ type, loading: true });
      await axios.post(`${BASE_URL}/product/update-quantity`, {
        id: selectedProduct._id || selectedProduct.id,
        type,
        val: Number(val),
      });
      alert("✅ Quantity updated successfully!");
      loadGodownDetails();
      setEditQuantityOpen(false);
    } catch (err) {
      console.error("❌ Update Error:", err);
      alert("Failed to update quantity");
    } finally {
      setActionState({ type: "", loading: false });
    }
  };

  const handleSaveDetails = async () => {
    try {
      setActionState({ type: "saving", loading: true });
      const updatedData = {
        id: selectedProduct._id || selectedProduct.id,
        name: selectedProduct.name,
        category: selectedProduct.category,
        size: selectedProduct.size,
        color: selectedProduct.color,
      };
      await axios.patch(`${BASE_URL}/product/update`, updatedData);
      alert("✅ Product details updated successfully!");
      setEditDetailsOpen(false);
      await loadGodownDetails();
    } catch (err) {
      console.error("❌ Update Error:", err);
      alert("Failed to update product details");
    } finally {
      setActionState({ type: "", loading: false });
    }
  };

  useEffect(() => {
    loadGodownDetails();
  }, [id]);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600 text-lg animate-pulse">
        Loading details...
      </p>
    );

  if (!godown)
    return (
      <div className="p-6 text-gray-500">
        <Link
          to="/godowns"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </Link>
        <p className="mt-2">No details found for this godown.</p>
      </div>
    );

  const products = godown.products || [];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const qty = Number(p.quantity);
    const stockStatus = qty === 0 ? "out" : qty <= 5 ? "low" : "in";
    const matchesStock = selectedStock ? stockStatus === selectedStock : true;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 pt-18 md:pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {godown.name}
          </h2>
          <p className="text-gray-500">{godown.address || "No address available"}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowModal(true)}
            disabled={actionState.loading && actionState.type === "addingProduct"}
            className={`flex items-center justify-center gap-2 text-white px-5 py-2.5 rounded-xl shadow transition-all duration-200 ${
              actionState.loading && actionState.type === "addingProduct"
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {actionState.loading && actionState.type === "addingProduct" ? (
              "Adding..."
            ) : (
              <>
                <PlusCircle size={18} /> Add Product
              </>
            )}
          </button>

          <Link
            to="/godowns"
            className="flex items-center justify-center gap-2 text-blue-700 font-medium hover:text-blue-900 transition-all"
          >
            <ArrowLeft size={18} /> Back
          </Link>
        </div>
      </div>

      {/* Product List */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Products in this Godown
      </h3>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 italic">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredProducts.map((p) => {
            const qty = Number(p.quantity);
            const status =
              qty === 0
                ? { text: "Out of Stock", color: "bg-red-100 text-red-800" }
                : qty <= 5
                ? { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
                : { text: "In Stock", color: "bg-green-100 text-green-800" };

            return (
              <div
                key={p._id || p.id}
                onClick={() => {
                  setSelectedProduct(p);
                  setShowTransactions(true);
                }}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 hover:-translate-y-1 w-full"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {p.category} • {p.size}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Color: {p.color || "-"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}
                  >
                    {status.text}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div
                    className={`flex gap-2 transition-all duration-300 ${
                      actionState.loading ? "opacity-50 scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    {/* Edit Details */}
                    <button
                      disabled={actionState.loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(p);
                        setEditDetailsOpen(true);
                      }}
                      className={`p-2 rounded-full bg-blue-50 text-blue-700 transition transform
                        ${
                          actionState.loading
                            ? "cursor-not-allowed"
                            : "hover:bg-blue-100 hover:scale-110"
                        }`}
                      title="Edit Details"
                    >
                      {actionState.type === "saving" ? (
                        <span className="text-sm font-medium animate-pulse">Saving...</span>
                      ) : (
                        <Pencil className="w-5 h-5" />
                      )}
                    </button>

                    {/* Edit Quantity */}
                    <button
                      disabled={actionState.loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(p);
                        setEditQuantityOpen(true);
                      }}
                      className={`p-2 rounded-full bg-indigo-50 text-indigo-700 transition transform
                        ${
                          actionState.loading
                            ? "cursor-not-allowed"
                            : "hover:bg-indigo-100 hover:scale-110"
                        }`}
                      title="Edit Quantity"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>

                    {/* Delete */}
                    <button
                      disabled={actionState.loading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(p._id || p.id);
                      }}
                      className={`p-2 rounded-full bg-red-50 text-red-700 transition transform
                        ${
                          actionState.loading
                            ? "cursor-not-allowed"
                            : "hover:bg-red-100 hover:scale-110"
                        }`}
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-right transition-all duration-300">
                    <div className="text-3xl font-bold text-blue-900">{p.quantity}</div>
                    <div className="text-xs text-gray-500 uppercase">Qty</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TRANSACTIONS MODAL */}
      <TransactionsModal
        open={showTransactions}
        onClose={() => setShowTransactions(false)}
        product={selectedProduct}
      />

      {/* -------------------- EDIT DETAILS MODAL -------------------- */}
      {/* -------------------- EDIT QUANTITY MODAL -------------------- */}
{editQuantityOpen && selectedProduct && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📊 Update Quantity — {selectedProduct.name}
      </h2>

      <input
        id="quantity-input"
        type="number"
        min="1"
        placeholder="Enter quantity"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-5"
      />

      <div className="flex justify-between">
        <button
          disabled={actionState.loading}
          onClick={() => {
            const val = document.getElementById("quantity-input").value;
            handleUpdateQuantity("added", val);
          }}
          className={`px-5 py-2 rounded-lg text-white transition ${
            actionState.loading
              ? "bg-green-400 cursor-not-allowed opacity-70"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {actionState.type === "added" ? "Adding..." : "Add"}
        </button>

        <button
          disabled={actionState.loading}
          onClick={() => {
            const val = document.getElementById("quantity-input").value;
            handleUpdateQuantity("removed", val);
          }}
          className={`px-5 py-2 rounded-lg text-white transition ${
            actionState.loading
              ? "bg-red-400 cursor-not-allowed opacity-70"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {actionState.type === "removed" ? "Removing..." : "Remove"}
        </button>

        <button
          onClick={() => setEditQuantityOpen(false)}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{/* -------------------- ADD PRODUCT MODAL -------------------- */}
{showModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">➕ Add New Product</h2>

      <input
        list="category-list"
        type="text"
        placeholder="Category"
        value={newProduct.category}
        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
        className="w-full mb-3 border border-gray-300 rounded-lg px-3 py-2"
      />
      <datalist id="category-list">
        {categories.map((cat, i) => (
          <option key={i} value={cat} />
        ))}
      </datalist>

      <input
        type="text"
        placeholder="Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        className="w-full mb-3 border border-gray-300 rounded-lg px-3 py-2"
      />

      <input
        type="text"
        placeholder="Size"
        value={newProduct.size}
        onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
        className="w-full mb-3 border border-gray-300 rounded-lg px-3 py-2"
      />

      <input
        type="text"
        placeholder="Color (optional)"
        value={newProduct.color}
        onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
        className="w-full mb-3 border border-gray-300 rounded-lg px-3 py-2"
      />

      <input
        type="number"
        placeholder="Quantity (optional)"
        value={newProduct.quantity}
        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        className="w-full mb-5 border border-gray-300 rounded-lg px-3 py-2"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowModal(false)}
          className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          onClick={addProduct}
          disabled={actionState.loading && actionState.type === "addingProduct"}
          className={`px-5 py-2 rounded-lg text-white ${
            actionState.loading && actionState.type === "addingProduct"
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {actionState.loading && actionState.type === "addingProduct"
            ? "Adding..."
            : "Add Product"}
        </button>
      </div>
    </div>
  </div>
)}

</div>
);
}