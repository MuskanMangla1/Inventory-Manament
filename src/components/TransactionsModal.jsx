import React from "react";

export default function TransactionsModal({ open, onClose, product }) {
  if (!open || !product) return null;

  const transactions = product.transitions || [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
            🧾 Transaction History — <span className="text-blue-600">{product.name}</span>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition text-2xl font-bold">✕</button>
        </div>

        {/* Content */}
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No transactions yet for this product.</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[65vh] space-y-4 pr-2">
            {transactions.map((t, i) => (
              <div
                key={t.id || i}
                className={`flex items-center justify-between rounded-2xl p-5 shadow-md border transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                  t.type === "added" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex flex-col">
                  <p className="text-gray-700 text-lg font-semibold">
                    <span className={`${t.type === "added" ? "text-green-700" : "text-red-700"} capitalize font-bold`}>
                      {t.type}
                    </span>
                  </p>
                  <p className="text-gray-600 text-base mt-1">
                    Quantity: <span className="font-semibold text-gray-800">{t.quantity}</span>
                  </p>
                  <p className="text-gray-500 text-sm font-mono mt-1 truncate">{new Date(t.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow hover:bg-blue-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
