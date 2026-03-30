"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface AdminOrder {
  id: string;
  order_number: string;
  story_title: string;
  child_name: string;
  customer_email: string;
  product_type: "digital" | "physical";
  status: string;
  amount_cents: number;
  currency: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  paid: "Платена",
  generating: "Генерира се",
  complete: "Завършена",
  shipped: "Изпратена",
  delivered: "Доставена",
  refunded: "Върната",
};

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-blue-100 text-blue-700",
  generating: "bg-yellow-100 text-yellow-700",
  complete: "bg-green-100 text-green-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  refunded: "bg-red-100 text-red-700",
};

function formatEur(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      status,
      type,
    });
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page, search, status, type]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-brown">Поръчки</h1>
        <p className="text-gray-500 text-sm mt-1">{total} общо</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Търси поръчка, имейл, дете..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchInput);
                setPage(1);
              }
            }}
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          />
        </div>

        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
        >
          <option value="all">Всички статуси</option>
          <option value="paid">Платена</option>
          <option value="generating">Генерира се</option>
          <option value="complete">Завършена</option>
          <option value="shipped">Изпратена</option>
          <option value="delivered">Доставена</option>
          <option value="refunded">Върната</option>
        </select>

        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
        >
          <option value="all">Всички типове</option>
          <option value="digital">Дигитален</option>
          <option value="physical">Физически</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Зарежда се...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Няма намерени поръчки.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 font-medium text-gray-500 text-xs">Номер</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs">Дете / Книга</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs">Клиент</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs">Тип</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs">Сума</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs">Статус</th>
                <th className="px-4 py-3 font-medium text-gray-500 text-xs">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs text-brand-orange hover:underline"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-brown">{order.child_name}</p>
                    <p className="text-gray-400 text-xs truncate max-w-[180px]">{order.story_title}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{order.customer_email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-gray-600">
                      {order.product_type === "digital" ? "Дигитален" : "Физически"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-brown">
                    {formatEur(order.amount_cents)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400 text-xs">
            Страница {page} от {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
