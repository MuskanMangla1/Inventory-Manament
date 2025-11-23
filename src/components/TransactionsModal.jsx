import React from "react";

export default function TransactionsModal({ open, onClose, product }) {
  if (!open || !product) return null;

  const transactions = product.transitions || [];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity md:pl-60">
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl p-6 relative border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-6">
          <div>
              <h2 className="md:text-3xl font-bold text-gray-800 tracking-wide flex flex-col md:flex-row md:gap-2">
              <span>🧾 Transaction History —</span> <span className="text-blue-600">{product.name}</span>
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition text-2xl font-bold">✕</button>
        </div>

        {/* Content */}
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No transactions yet for this product.</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[65vh] space-y-4 pr-2">
            {[...transactions].reverse().map((t, i) => (
              <div
                key={t.id || i}
                className={`flex items-center justify-between rounded-2xl p-2 px-5 shadow-md border transition-all duration-300 ${
                  t.type === "added" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex flex-col">
                  <p className="text-gray-700 md:text-lg font-semibold">
                    <span className={`${t.type === "added" ? "text-green-700" : "text-red-700"} capitalize font-bold`}>
                      {t.type}
                    </span>
                  </p>
                  <p className="text-gray-600 text-base">
                    Quantity: <span className="font-semibold text-gray-800 mt-1">{t.quantity}</span>
                  </p>
                  <p className="text-gray-500 text-sm font-mono mt-1 truncate">{new Date(t.created_at).toLocaleDateString("en-GB")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
