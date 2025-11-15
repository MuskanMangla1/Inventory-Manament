import React, { useEffect, useState } from "react";
import {
  Boxes,
  Warehouse,
  Package,
  AlertTriangle,
  PlusCircle,
  BarChart2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import axios from "axios";

const BASE_URL = "https://inventory-management-k328.onrender.com";

// -------------------- DASHBOARD COMPONENT --------------------
export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [pRes, gRes] = await Promise.all([
        axios.get(`${BASE_URL}/product`),
        axios.get(`${BASE_URL}/godown`),
      ]);
      setProducts(pRes.data?.data || pRes.data || []);
      setGodowns(gRes.data?.godowns || gRes.data?.data || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-lg text-gray-600">
        ⏳ Loading your smart dashboard...
      </div>
    );

  // -------------------- METRICS --------------------
  const totalStock = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);
  const lowStockCount = products.filter((p) => Number(p.quantity) <= 5).length;

  const categoryData = Object.entries(
    products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + (Number(p.quantity) || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

  const recentTransactions = [
    { id: 1, product: "Shoes", type: "Added", quantity: 40, date: "2025-11-10" },
    { id: 2, product: "T-shirt", type: "Removed", quantity: 10, date: "2025-11-09" },
    { id: 3, product: "Watch", type: "Added", quantity: 5, date: "2025-11-08" },
  ];

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-2 pt-18 md:pt-2">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h2>
        <p className="text-gray-500 mt-2">Real-time insights into your stock and activity</p>
      </header>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KpiCard title="Total Products" value={products.length} icon={<Boxes />} color="blue" />
        <KpiCard title="Total Godowns" value={godowns.length} icon={<Warehouse />} color="green" />
        <KpiCard title="Total Stock" value={totalStock} icon={<Package />} color="yellow" />
        <KpiCard title="Low Stock Alerts" value={lowStockCount} icon={<AlertTriangle />} color="red" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <ChartCard title="Category-wise Stock" icon={<BarChart2 className="text-blue-600" />}>
          {categoryData.length === 0 ? (
            <EmptyData text="No stock data available" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} barSize={50}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Godown-wise Distribution" icon={<BarChart2 className="text-green-600" />}>
          {godowns.length === 0 ? (
            <EmptyData text="No godown data available" />
          ) : (
            <div className=""> {/* Add padding here */}
  <ResponsiveContainer width="100%" height={300}  className="p-4">
    <PieChart>
      <Pie
        data={godowns.map((g, i) => ({ name: g.name, value: i + 1 }))}
        dataKey="value"
        outerRadius={120}
        label
      >
        {godowns.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</div>

          )}
        </ChartCard>
      </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-10 hover:shadow-lg transition">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">🧾 Recent Transactions</h3>

  {/* Table view for medium and larger screens */}
  <div className="overflow-x-auto hidden sm:block">
    <table className="w-full text-sm">
      <thead className="bg-gray-100 text-gray-700 rounded-lg">
        <tr>
          <th className="py-3 px-4 text-left">#</th>
          <th className="py-3 px-4 text-left">Product</th>
          <th className="py-3 px-4 text-left">Type</th>
          <th className="py-3 px-4 text-left">Quantity</th>
          <th className="py-3 px-4 text-left">Date</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {recentTransactions.map((t, i) => (
          <tr
            key={t.id}
            className={`transition ${
              t.type === "Added" ? "hover:bg-green-50" : "hover:bg-red-50"
            }`}
          >
            <td className="py-3 px-4 font-medium text-gray-700">{i + 1}</td>
            <td className="py-3 px-4">{t.product}</td>
            <td
              className={`py-3 px-4 font-semibold ${
                t.type === "Added" ? "text-green-700" : "text-red-700"
              }`}
            >
              {t.type}
            </td>
            <td className="py-3 px-4">{t.quantity}</td>
            <td className="py-3 px-4 text-gray-500">{t.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Card view for small screens */}
  <div className="sm:hidden space-y-4">
    {recentTransactions.map((t, i) => (
      <div
        key={t.id}
        className={`border rounded-lg p-4 ${
          t.type === "Added" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex justify-between">
          <span
            className={`text-sm font-semibold ${
              t.type === "Added" ? "text-green-700" : "text-red-700"
            }`}
          >
            {t.type}
          </span>
        </div>
        <p className="mt-2 text-gray-600">
          <strong>Product:</strong> {t.product}
        </p>
        <p className="text-gray-600">
          <strong>Quantity:</strong> {t.quantity}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Date:</strong> {t.date}
        </p>
      </div>
    ))}
  </div>
</div>

    </div>
  );
}

// -------------------- REUSABLE COMPONENTS --------------------
function KpiCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    yellow: "text-yellow-600 bg-yellow-100",
    red: "text-red-600 bg-red-100",
  };

  return (
    <div className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorMap[color]} group-hover:scale-110 transition`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function EmptyData({ text }) {
  return <p className="text-gray-400 text-center py-10">{text}</p>;
}
