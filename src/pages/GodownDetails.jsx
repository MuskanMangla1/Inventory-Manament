import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { PlusCircle } from "lucide-react";

import ProductCard from "../components/ProductCard.jsx";
import AddProductModal from "../components/AddProductModal.jsx";
import TransactionsModal from "../components/TransactionsModal.jsx";
import EditDetailsModal from "../components/EditDetailsModal.jsx";
import EditQuantityModal from "../components/EditQuantityModal.jsx";
import ProductFilters from "../components/ProductFilters.jsx";
import FiltersModal from "../components/FiltersModal.jsx";

const BASE_URL = "https://inventorymanagementnode.onrender.com";

export default function GodownDetails() {
  const { id } = useParams();
  const [godown, setGodown] = useState(null);
  const [loading, setLoading] = useState(true);

  // Product Actions
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [showEditDetails, setShowEditDetails] = useState(false);
  const [showEditQuantity, setShowEditQuantity] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStock, setSelectedStock] = useState("all");

  // NEW FILTER STATES
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  
  // FiltersModal state
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
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

    loadGodownDetails();
  }, [id]);

  if (loading) return <p className="p-6 text-center text-gray-500">Loading...</p>;
  if (!godown) return <p className="p-6 text-center text-gray-500">Godown not found.</p>;

  const products = godown.products || [];

  // Unique Categories
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  // NEW: Unique Colors & Sizes
  const colors = [...new Set(products.map((p) => p.color).filter(Boolean))];
  const sizes = [...new Set(products.map((p) => p.size).filter(Boolean))];

  // APPLY FILTERS
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesColor = selectedColor === "all" || p.color === selectedColor;
    const matchesSize = selectedSize === "all" || p.size === selectedSize;

    const qty = Number(p.quantity);
    const stockStatus = qty === 0 ? "out" : qty <= 10 ? "low" : "in";
    const matchesStock = selectedStock === "all" || stockStatus === selectedStock;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesColor &&
      matchesSize &&
      matchesStock
    );
  });

  // Reset filters function
  const resetFilters = () => {
    setSelectedCategory("all");
    setSelectedColor("all");
    setSelectedSize("all");
    setSelectedStock("all");
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${BASE_URL}/product`, { data: { id: productId } });
      alert("🗑️ Product deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("❌ Delete Error:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 pt-18 md:pt-2">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow flex-wrap">
        <Link
          to="/godowns"
          className="inline-flex items-center justify-center px-3 py-2 text-black font-bold text-lg rounded-lg bg-blue-50 hover:bg-blue-100 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          ←
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-800">{godown.name}</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end mb-6 w-full gap-4">
        <div className="flex items-center gap-3 w-full">
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={selectedCategory}
            setCategoryFilter={setSelectedCategory}
            filter={selectedStock}
            setFilter={setSelectedStock}
            categories={categories}
            colors={colors}
            sizes={sizes}
            colorFilter={selectedColor}
            setColorFilter={setSelectedColor}
            sizeFilter={selectedSize}
            setSizeFilter={setSelectedSize}
          />
          <FiltersModal
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            categories={categories}
            colors={colors}
            sizes={sizes}
            categoryFilter={selectedCategory}
            setCategoryFilter={setSelectedCategory}
            colorFilter={selectedColor}
            setColorFilter={setSelectedColor}
            sizeFilter={selectedSize}
            setSizeFilter={setSelectedSize}
            stockFilter={selectedStock}
            setStockFilter={setSelectedStock}
            resetFilters={resetFilters}
          />
        </div>

        <button
          onClick={() => setShowAddProduct(true)}
          className="w-full md:w-50 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-200 font-semibold flex items-center justify-center"
        >
          <PlusCircle size={18} />
          Add Product
        </button>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-10 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      )}

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
          />
          <EditQuantityModal
            open={showEditQuantity}
            onClose={() => setShowEditQuantity(false)}
            product={selectedProduct}
          />
        </>
      )}

      <AddProductModal
        open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        godowns={[godown]}
        onAdded={() => window.location.reload()}
        existingCategories={categories}
      />
    </div>
  );
}