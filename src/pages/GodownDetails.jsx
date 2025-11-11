import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { PlusCircle, ArrowLeft, Pencil, BarChart3, Trash2 } from "lucide-react";

const BASE_URL = "https://inventory-management-k328.onrender.com";

export default function GodownDetails() {
  const { id } = useParams();
  const [godown, setGodown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editQuantityOpen, setEditQuantityOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    category: "",
    name: "",
    size: "",
    color: "",
    quantity: "",
  });

  // Load Godown Details
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

  // Add New Product
  const addProduct = async () => {
    if (!newProduct.name || !newProduct.category || !newProduct.size) {
      alert("Please fill all required fields (category, name, size)");
      return;
    }
    try {
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
      loadGodownDetails();
    } catch (err) {
      console.error("❌ Error adding product:", err);
      alert("Failed to add product");
    }
  };

  // Delete Product
  const handleDelete = async (pid) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${BASE_URL}/product/${pid}`);
      alert("🗑️ Product deleted successfully!");
      loadGodownDetails();
    } catch (err) {
      console.error("❌ Delete Error:", err);
      alert("Failed to delete product");
    }
  };

  // Update Quantity
  const handleUpdateQuantity = async (type, val) => {
    try {
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
    }
  };

  // Save Edited Product Details
  const handleSaveDetails = async () => {
    try {
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
      loadGodownDetails();
    } catch (err) {
      console.error("❌ Update Error:", err);
      alert("Failed to update product details");
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
          >
            <PlusCircle size={18} /> Add Product
          </button>

          <Link
            to="/godowns"
            className="flex items-center justify-center gap-2 text-blue-700 font-medium hover:text-blue-900 transition-all"
          >
            <ArrowLeft size={18} /> Back
          </Link>
        </div>
      </div>

      {/* Product Cards */}
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Products in this Godown
      </h3>

      {products.length === 0 ? (
        <p className="text-gray-500 italic">No products found in this godown.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => {
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
                    <h3 className="font-semibold text-lg text-gray-800 truncate">{p.name}</h3>
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
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Edit Details Button */}
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

                    {/* Edit Quantity Button */}
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

                    {/* Delete Button */}
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

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[95%] max-w-md">
            <h3 className="text-2xl font-semibold text-gray-800 mb-5">
              Add New Product
            </h3>

            <div className="space-y-3">
              {["category", "name", "size", "color", "quantity"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                    {field}{" "}
                    {["category", "name", "size", "quantity"].includes(field) && "*"}
                  </label>
                  <input
                    type={field === "quantity" ? "number" : "text"}
                    value={newProduct[field]}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        [field]: e.target.value,
                      })
                    }
                    placeholder={`Enter ${field}`}
                    className="border w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addProduct}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-800 transition-all"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Details Modal */}
      {editDetailsOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Edit Product Details - {selectedProduct.name}
            </h3>

            {["name", "category", "size", "color"].map((field) => (
              <div key={field} className="mb-3">
                <label className="text-sm text-gray-600 block mb-1 capitalize">
                  {field}
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={selectedProduct[field] || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      [field]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <div className="flex justify-between mt-5">
              <button
                onClick={() => setEditDetailsOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={handleSaveDetails}
                className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Quantity Modal */}
      {editQuantityOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Edit Quantity - {selectedProduct.name}
            </h3>

            <label className="text-sm text-gray-600 block mb-1">
              Quantity to Modify
            </label>
            <input
              type="number"
              min="1"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="Enter quantity"
              value={selectedProduct.editQuantity || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  editQuantity: Number(e.target.value),
                })
              }
            />

            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleUpdateQuantity("added", selectedProduct.editQuantity || 0)
                }
                className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
              >
                ➕ Add Quantity
              </button>
              <button
                onClick={() =>
                  handleUpdateQuantity("subtracted", selectedProduct.editQuantity || 0)
                }
                className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition"
              >
                ➖ Subtract Quantity
              </button>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={() => setEditQuantityOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
