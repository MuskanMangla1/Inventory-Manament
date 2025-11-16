import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Warehouse,
  ArrowLeftRight,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const menu = [
    { path: "/", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/products", name: "Products", icon: <Boxes size={20} /> },
    { path: "/stock", name: "Stock", icon: <ArrowLeftRight size={20} /> },
    { path: "/godowns", name: "Godowns", icon: <Warehouse size={20} /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 🌟 Mobile Header (only visible when sidebar is closed) */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-[50]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IM</span>
          </div>
          <span className="text-lg font-semibold text-gray-800">
            Inventory Management
          </span>
        </div>
      </div>

      {/* 🌟 Floating Menu Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed bottom-6 left-4 z-[60] bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-300 md:hidden"
        >
          <Menu size={22} />
        </button>
      )}

      {/* 🧱 Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IM</span>
            </div>
            <span className="text-xl font-semibold text-gray-800">
              Inventory Man
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-blue-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-all duration-200 
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={`${
                    isActive ? "text-blue-600" : "text-gray-500"
                  } transition-colors duration-200`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">JD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">Admin User</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔲 Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/10 md:hidden z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
