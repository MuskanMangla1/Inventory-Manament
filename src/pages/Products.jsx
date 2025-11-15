import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, PlusCircle, BarChart3 } from "lucide-react";

const BASE_URL = "https://inventory-management-k328.onrender.com";

// -------------------- ADD PRODUCT MODAL --------------------
function AddProductModal({ open, onClose, godowns, onAdded, existingCategories }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    size: "",
    color: "",
    quantity: 1,
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
    if (!form.name.trim() || !form.category.trim()) {
      alert("Please enter product name and category");
      return;
    }
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Add New Product
        </h3>

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

        {/* Name Input */}
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Name"
          value={form.name}
          disabled={loading}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Category Input with Datalist */}
        <input
          list="category-list"
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Category"
          value={form.category}
          disabled={loading}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <datalist id="category-list">
          {existingCategories.map((cat, i) => (
            <option key={i} value={cat} />
          ))}
        </datalist>

        {/* Size & Color */}
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Size"
          value={form.size}
          disabled={loading}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          placeholder="Color"
          value={form.color}
          disabled={loading}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />

        <input
          type="number"
          min="0"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Quantity"
          value={form.quantity}
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, quantity: Number(e.target.value) })
          }
        />

        <div className="flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleAdd}
            className={`px-4 py-2 text-white rounded-lg transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-900 hover:bg-blue-800"
            }`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------- EDIT DETAILS MODAL --------------------
function EditDetailsModal({ open, onClose, product, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    size: "",
    color: "",
  });
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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Edit Product Details
        </h3>

        {["name", "category", "size", "color"].map((field) => (
          <input
            key={field}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            disabled={loading}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------- EDIT QUANTITY MODAL --------------------
function EditQuantityModal({ open, onClose, product, onUpdated }) {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!open || !product) return null;

  const updateQuantity = async (type) => {
    if (loading) return;
    try {
      setLoading(true);
      let newQty =
        type === "add"
          ? product.quantity + Number(amount)
          : product.quantity - Number(amount);

      if (newQty < 0) {
        alert("❌ Quantity cannot go below 0");
        return;
      }

      await axios.patch(`${BASE_URL}/product/update`, {
        id: product._id || product.id,
        quantity: newQty,
      });

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
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Edit Quantity - {product.name}
        </h3>

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
            className={`flex-1 px-4 py-2 text-white rounded-lg ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Adding..." : "Add"}
          </button>
          <button
            onClick={() => updateQuantity("subtract")}
            disabled={loading}
            className={`flex-1 px-4 py-2 text-white rounded-lg ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Removing..." : "Subtract"}
          </button>
        </div>

        <div className="text-right mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className={`px-4 py-2 rounded-lg ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

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
            {transactions.map((t, i) => (
              <div
                key={t.id || i}
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

// -------------------- MAIN COMPONENT --------------------
export default function Products() {
  const [products, setProducts] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editQuantityOpen, setEditQuantityOpen] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [pRes, gRes] = await Promise.all([
        axios.get(`${BASE_URL}/product`),
        axios.get(`${BASE_URL}/godown`),
      ]);

      const pData = Array.isArray(pRes.data)
        ? pRes.data
        : pRes.data?.data || [];
      const gData = Array.isArray(gRes.data)
        ? gRes.data
        : gRes.data?.godowns || gRes.data?.data || [];

      setProducts(pData);
      setGodowns(gData);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/product/${id}`);
      alert("🗑️ Product deleted successfully!");
      load();
    } catch (err) {
      console.error("❌ Delete Error:", err);
      alert("Failed to delete product");
    }
  };

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  const filtered = products.filter((p) => {
    const nameMatch = q
      ? (p.name || "").toLowerCase().includes(q.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(q.toLowerCase())
      : true;
    if (!nameMatch) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (filter === "low") return Number(p.quantity) <= 5;
    if (filter === "out") return Number(p.quantity) === 0;
    if (filter === "in") return Number(p.quantity) > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 pt-18 md:pt-2">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-500 mt-2">
            Manage your product inventory easily
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or category"
            className="border rounded-lg px-3 py-2 w-full sm:w-48 md:w-56 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 w-full sm:w-40 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="all">All</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock (≤5)</option>
            <option value="out">Out of Stock</option>
          </select>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
          >
            <PlusCircle size={18} />
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500 text-center">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => {
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
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 hover:-translate-y-1"
              >
                <div
                  onClick={() => {
                    setSelectedProduct(p);
                    setShowTransactions(true);
                  }}
                  className="cursor-pointer"
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
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setEditDetailsOpen(true);
                      }}
                      className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition transform hover:scale-110"
                      title="Edit Details"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setEditQuantityOpen(true);
                      }}
                      className="p-2 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition transform hover:scale-110"
                      title="Edit Quantity"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(p._id || p.id)}
                      className="p-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition transform hover:scale-110"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-900">
                      {p.quantity}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">Qty</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        godowns={godowns}
        onAdded={load}
        existingCategories={categories}
      />

      <EditDetailsModal
        open={editDetailsOpen}
        onClose={() => setEditDetailsOpen(false)}
        product={selectedProduct}
        onUpdated={load}
      />

      <EditQuantityModal
        open={editQuantityOpen}
        onClose={() => setEditQuantityOpen(false)}
        product={selectedProduct}
        onUpdated={load}
      />

      <TransactionsModal
        open={showTransactions}
        onClose={() => setShowTransactions(false)}
        product={selectedProduct}
      />
    </div>
  );
}
