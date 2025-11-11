import React from "react";
import { Bell, User } from "lucide-react";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <h1 className="text-xl font-semibold text-primary">Inventory Management</h1>
      <div className="flex items-center gap-4">
        <Bell className="text-gray-600 cursor-pointer hover:text-primary" />
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          <User className="text-gray-600" />
          <span className="text-sm font-medium">Muskan</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
