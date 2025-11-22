import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";
import AddProductModal from "../components/AddProductModal.jsx";
import EditDetailsModal from "../components/EditDetailsModal.jsx";
import EditQuantityModal from "../components/EditQuantityModal.jsx";
import TransactionsModal from "../components/TransactionsModal.jsx";
import ProductFilters from "../components/ProductFilters.jsx";

const BASE_URL = "https://inventory-management-k328.onrender.com";

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
      const pData = Array.isArray(pRes.data) ? pRes.data : pRes.data?.data || [];
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
      await axios.delete(`${BASE_URL}/product`, { data: { id } });
      alert("🗑️ Product deleted successfully!");
      load();
    } catch (err) {
      console.error("❌ Delete Error:", err);
      alert("Failed to delete product");
    }
  };

  const categoriesFromProducts = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  );

  // Apply filters
  const filtered = products.filter((p) => {
    const nameMatch = q
      ? (p.name || "").toLowerCase().includes(q.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(q.toLowerCase())
      : true;

    if (!nameMatch) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (filter === "low") return Number(p.quantity) <= 10;
    if (filter === "out") return Number(p.quantity) === 0;
    if (filter === "in") return Number(p.quantity) > 0;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 pt-18 md:pt-2">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Products</h2>
          <p className="text-gray-500 mt-2">Manage your product inventory efficiently</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <ProductFilters
            searchTerm={q}
            setSearchTerm={setQ}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            filter={filter}
            setFilter={setFilter}
            categories={categoriesFromProducts}
          />

          <button
  onClick={() => setModalOpen(true)}
  className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all duration-200"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard
              key={p._id || p.id}
              product={p}
              onEditDetails={(product) => {
                setSelectedProduct(product);
                setEditDetailsOpen(true);
              }}
              onEditQuantity={(product) => {
                setSelectedProduct(product);
                setEditQuantityOpen(true);
              }}
              onDelete={handleDelete}
              onShowTransactions={(product) => {
                setSelectedProduct(product);
                setShowTransactions(true);
              }}
            />
          ))}
        </div>
      )}

      <AddProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        godowns={godowns}
        onAdded={load}
        existingCategories={categoriesFromProducts}
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
