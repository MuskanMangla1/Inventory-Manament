import React from "react";
import { Pencil, Trash2, BarChart3 } from "lucide-react";

export default function ProductCard({ product, onEditDetails, onEditQuantity, onDelete, onShowTransactions }) {
  const qty = Number(product.quantity);
  const status =
    qty === 0
      ? { text: "Out of Stock", color: "bg-red-100 text-red-800" }
      : qty <= 5
      ? { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" }
      : { text: "In Stock", color: "bg-green-100 text-green-800" };

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 hover:-translate-y-1">
      <div onClick={() => onShowTransactions(product)} className="cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
            <p className="text-sm text-gray-500 truncate">
              {product.category} • {product.size}
            </p>
            <p className="text-xs text-gray-600 mt-1">Color: {product.color || "-"}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
            {status.text}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEditDetails(product)}
            className="p-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition transform hover:scale-110"
            title="Edit Details"
          >
            <Pencil className="w-5 h-5" />
          </button>

          <button
            onClick={() => onEditQuantity(product)}
            className="p-2 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition transform hover:scale-110"
            title="Edit Quantity"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(product._id || product.id)}
            className="p-2 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition transform hover:scale-110"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-blue-900">{product.quantity}</div>
          <div className="text-xs text-gray-500 uppercase">Qty</div>
        </div>
      </div>
    </div>
  );
}
