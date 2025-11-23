import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Stock from "./pages/Stock";
import Godowns from "./pages/Godowns";
import GodownDetails from "./pages/GodownDetails";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 h-screen overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/godowns" element={<Godowns />} />
            <Route path="/godown/:id" element={<GodownDetails />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
