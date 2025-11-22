import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Warehouse, MapPin, PlusCircle, Search } from "lucide-react";

const BASE_URL = "https://inventory-management-k328.onrender.com";

export default function Godowns() {
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newGodown, setNewGodown] = useState({ name: "", address: "" });
  const [creating, setCreating] = useState(false); // ✅ new state
  const navigate = useNavigate();

  const loadGodowns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/godown`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setGodowns(data);
    } catch (err) {
      console.error("Error fetching godowns:", err);
      alert("Failed to fetch godowns");
    } finally {
      setLoading(false);
    }
  };

  const createGodown = async () => {
    if (!newGodown.name.trim()) {
      alert("Godown name is required!");
      return;
    }

    try {
      setCreating(true); // ✅ disable button
      await axios.post(`${BASE_URL}/godown`, newGodown);
      alert("✅ Godown created successfully!");
      setShowModal(false);
      setNewGodown({ name: "", address: "" });
      loadGodowns();
    } catch (err) {
      console.error("Error creating godown:", err);
      alert("❌ Failed to create godown");
    } finally {
      setCreating(false); // ✅ re-enable button
    }
  };

  useEffect(() => {
    loadGodowns();
  }, []);

  const filtered = godowns.filter((g) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (g.name || "").toLowerCase().includes(q) ||
      (g.address || "").toLowerCase().includes(q)
    );
  });

  const handleCardClick = (id) => {
    navigate(`/godown/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 pt-18 md:pt-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between mb-10">
        <div className="sm:text-left mb-4 sm:mb-0">
          <h2 className="text-3xl font-bold text-gray-800">Godowns</h2>
          <p className="text-gray-500 mt-2">Manage your warehouse locations</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
  {/* Search Input */}
  <div className="w-full">
    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
    <input
      name="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search by name or location"
      className="pl-9 pr-4 py-2 w-full border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
    />
  </div>

  {/* Add Godown Button */}
  <button
    onClick={() => setShowModal(true)}
    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-200 w-full sm:w-auto"
  >
    <PlusCircle size={18} />
    Add Godown
  </button>
</div>

      </div>

      {/* Godown List */}
{loading ? (
  <p className="text-center text-gray-500 py-10">Loading godowns...</p>
) : filtered.length === 0 ? (
  <p className="text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-2xl py-6 shadow-sm">
    No godowns found.
  </p>
) : (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {filtered.map((g) => (
      <div
        key={g.id || g._id}
        onClick={() => handleCardClick(g.id || g._id)}
        className="group bg-white border border-gray-200 rounded-3xl shadow-md hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer p-6 flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Warehouse
              size={26}
              className="text-blue-600 group-hover:scale-110 transition-transform duration-300"
            />
            <h3 className="text-xl font-semibold text-gray-800">{g.name}</h3>
          </div>
          {g.address && (
            <div className="flex items-start gap-2 text-gray-500 mt-1">
              <MapPin size={18} className="mt-0.5 text-gray-400" />
              <p className="text-sm leading-snug">{g.address}</p>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
)}


      {/* Modal Popup */}
{showModal && (
  <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 transition-opacity duration-300">
    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative transform scale-100 transition-all duration-300">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-3">
        Add New Godown
      </h3>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Godown Name
          </label>
          <input
            type="text"
            value={newGodown.name}
            onChange={(e) =>
              setNewGodown({ ...newGodown, name: e.target.value })
            }
            placeholder="Enter godown name"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address (optional)
          </label>
          <input
            type="text"
            value={newGodown.address}
            onChange={(e) =>
              setNewGodown({ ...newGodown, address: e.target.value })
            }
            placeholder="Enter address"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none shadow-sm transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
        <button
          onClick={() => setShowModal(false)}
          disabled={creating} 
          className={`border border-gray-300 px-4 py-2 rounded-xl transition-all font-medium ${
            creating
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={createGodown}
          disabled={creating}
          className={`px-5 py-2 rounded-xl shadow-lg transition-all font-medium text-white ${
            creating
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:shadow-2xl"
          }`}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
