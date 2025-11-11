import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 , PlusCircle} from "lucide-react";

const BASE_URL = "https://inventory-management-k328.onrender.com";

// -------------------- ADD PRODUCT MODAL --------------------
function AddProductModal({ open, onClose, godowns, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    size: "",
    color: "",
    quantity: 1,
    godownId: "",
  });

  useEffect(() => {
    if (godowns?.length) {
      const gid = godowns[0].id || godowns[0]._id;
      setForm((f) => ({ ...f, godownId: gid }));
    }
  }, [godowns]);

  if (!open) return null;

  const handleAdd = async () => {
    try {
      if (!form.name || !form.category) {
        alert("Please enter name and category");
        return;
      }
      await axios.post(`${BASE_URL}/godown/${form.godownId}/add-product`, form);
      alert("✅ Product added successfully!");
      onAdded();
      onClose();
    } catch (err) {
      console.error("❌ Add Product Error:", err);
      alert("Failed to add product");
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
          className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          {godowns.map((g) => (
            <option key={g.id || g._id} value={g.id || g._id}>
              {g.name}
            </option>
          ))}
        </select>

        {["name", "category", "size", "color"].map((field) => (
          <input
            key={field}
            className="w-full border rounded-lg px-3 py-2 mb-3"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}

        <input
          type="number"
          min="0"
          className="w-full border rounded-lg px-3 py-2 mb-4"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: Number(e.target.value) })
          }
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            onClick={handleAdd}
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------- EDIT PRODUCT MODAL --------------------
// -------------------- EDIT PRODUCT MODAL --------------------
function EditProductModal({ open, onClose, product, onUpdated }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    size: "",
    color: "",
    quantity: 0,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        size: product.size || "",
        color: product.color || "",
        quantity: 0, // quantity input for add/subtract starts at 0
      });
    }
  }, [product]);

  if (!open || !product) return null;

  const handleQuantityUpdate = async (type) => {
    try {
      let newQuantity = Number(form.quantity);
      if (type === "add") newQuantity = product.quantity + newQuantity;
      else if (type === "subtract") newQuantity = product.quantity - newQuantity;

      if (newQuantity < 0) {
        alert("❌ Quantity cannot go below 0");
        return;
      }

      await axios.patch(`${BASE_URL}/product/update`, {
        id: product._id || product.id,
        quantity: newQuantity,
      });

      alert("✅ Quantity updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Quantity Update Error:", err);
      alert("Failed to update quantity");
    }
  };

  const handleDetailsUpdate = async () => {
    try {
      await axios.patch(`${BASE_URL}/product/update`, {
        id: product._id || product.id,
        name: form.name,
        category: form.category,
        size: form.size,
        color: form.color,
      });
      alert("✅ Product details updated successfully!");
      onUpdated();
      onClose();
    } catch (err) {
      console.error("❌ Details Update Error:", err);
      alert("Failed to update product details");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Edit Product - {product.name}
        </h3>

        {/* Editable Fields */}
        {["name", "category", "size", "color"].map((field) => (
          <div key={field} className="mb-3">
            <label className="text-sm text-gray-600 block mb-1 capitalize">
              {field}
            </label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          </div>
        ))}

        <button
          onClick={handleDetailsUpdate}
          className="w-full mb-4 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
        >
          Update Product Details
        </button>

        {/* Quantity Field */}
        <div className="mb-3">
          <label className="text-sm text-gray-600 block mb-1">
            Quantity to Modify
          </label>
          <input
            type="number"
            min="0"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Enter quantity"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: Number(e.target.value) })
            }
          />
        </div>

        {/* Add / Subtract Quantity Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => handleQuantityUpdate("add")}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
          >
            ➕ Add Quantity
          </button>
          <button
            onClick={() => handleQuantityUpdate("subtract")}
            className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition"
          >
            ➖ Subtract Quantity
          </button>
        </div>

        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            onClick={onClose}
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
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header Section */}
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

      {/* Product Grid */}
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

                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        setSelectedProduct(p);
                        setEditOpen(true);
                      }}
                      className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition transform hover:scale-110"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
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
      />

      <EditProductModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        product={selectedProduct}
        onUpdated={load}
      />
    </div>
  );
}
