import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProductFilters from "../components/ProductFilters.jsx";

// Components
import ProductCard from "../components/ProductCard.jsx";
import AddProductModal from "../components/AddProductModal.jsx";
import TransactionsModal from "../components/TransactionsModal.jsx";
import EditDetailsModal from "../components/EditDetailsModal.jsx";
import EditQuantityModal from "../components/EditQuantityModal.jsx";

const BASE_URL = "https://inventory-management-k328.onrender.com";

export default function GodownDetails() {
  const { id } = useParams();
  const [godown, setGodown] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals & Selected Product
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [showEditQuantity, setShowEditQuantity] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false); // Add Product modal

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStock, setSelectedStock] = useState("");

  const loadGodownDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/godown/${id}`);
      setGodown(res.data?.data || res.data);
    } catch (err) {
      console.error("❌ Error loading godown:", err);
      alert("Failed to load godown details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGodownDetails();
  }, [id]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
  if (!godown) return <p className="p-6 text-center text-gray-500">Godown not found.</p>;

  const products = godown.products || [];
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    const qty = Number(p.quantity);
    const stockStatus = qty === 0 ? "out" : qty <= 5 ? "low" : "in";
    const matchesStock = selectedStock ? stockStatus === selectedStock : true;
    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/product`, { data: { id: productId } });
      alert("🗑️ Product deleted successfully!");
      loadGodownDetails();
    } catch (err) {
      console.error("❌ Delete Error:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 pt-18 md:pt-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow flex-wrap gap-2">
        <Link to="/godowns" className="flex items-center gap-2 text-blue-600 font-semibold">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">{godown.name}</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <ProductFilters
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  categoryFilter={selectedCategory}
  setCategoryFilter={setSelectedCategory}
  filter={selectedStock}
  setFilter={setSelectedStock}
  categories={categories}
/>
    {/* Add Product Button */}
       <button
  onClick={() => setShowAddProduct(true)}
  className="ml-auto w-full md:w-auto bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-200 flex-shrink-0"
>
  Add Product
</button>

      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
            onEditDetails={() => {
              setSelectedProduct(product);
              setShowEditDetails(true);
            }}
            onEditQuantity={() => {
              setSelectedProduct(product);
              setShowEditQuantity(true);
            }}
            onDelete={() => handleDelete(product.id || product._id)}
            onShowTransactions={() => {
              setSelectedProduct(product);
              setShowTransactions(true);
            }}
          />
        ))}
      </div>

      {/* Modals */}
      {selectedProduct && (
        <>
          <TransactionsModal
            open={showTransactions}
            onClose={() => setShowTransactions(false)}
            product={selectedProduct}
          />
          <EditDetailsModal
            open={showEditDetails}
            onClose={() => setShowEditDetails(false)}
            product={selectedProduct}
            onUpdated={loadGodownDetails}
          />
          <EditQuantityModal
            open={showEditQuantity}
            onClose={() => setShowEditQuantity(false)}
            product={selectedProduct}
            onUpdated={loadGodownDetails}
          />
        </>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        godowns={[godown]} // only current godown
        onAdded={loadGodownDetails}
        existingCategories={categories}
      />
    </div>
  );
}
