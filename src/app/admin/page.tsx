"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ShoppingCart, Euro, BookOpen, Package } from "lucide-react";

interface Analytics {
  ordersTotal: number;
  ordersToday: number;
  ordersThisWeek: number;
  revenueTotal: number;
  revenueToday: number;
  digitalCount: number;
  physicalCount: number;
  statusCounts: Record<string, number>;
  dailyRevenue: { date: string; revenue: number; orders: number }[];
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

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-gray-400 text-sm">Зарежда се...</div>
    );
  }

  if (!data) {
    return <div className="p-8 text-red-500 text-sm">Грешка при зареждане.</div>;
  }

  const maxRevenue = Math.max(...data.dailyRevenue.map((d) => d.revenue), 1);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-brand-brown">Табло</h1>
        <p className="text-gray-500 text-sm mt-1">Преглед на продажбите и поръчките</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ShoppingCart className="h-5 w-5 text-brand-orange" />}
          label="Поръчки днес"
          value={String(data.ordersToday)}
          sub={`${data.ordersThisWeek} тази седмица`}
        />
        <StatCard
          icon={<Euro className="h-5 w-5 text-brand-orange" />}
          label="Приход днес"
          value={formatEur(data.revenueToday)}
          sub={`Общо ${formatEur(data.revenueTotal)}`}
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-brand-orange" />}
          label="Дигитални"
          value={String(data.digitalCount)}
          sub={`${data.ordersTotal} всичко`}
        />
        <StatCard
          icon={<Package className="h-5 w-5 text-brand-orange" />}
          label="Физически"
          value={String(data.physicalCount)}
          sub={`${data.ordersTotal} всичко`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-4 w-4 text-brand-orange" />
            <h2 className="font-semibold text-brand-brown text-sm">Приход — последните 7 дни</h2>
          </div>
          <div className="flex items-end gap-3 h-40">
            {data.dailyRevenue.map((day) => {
              const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: 120 }}>
                    <div
                      className="w-full bg-brand-orange/80 rounded-t-md transition-all"
                      style={{ height: `${height}%`, minHeight: day.revenue > 0 ? 4 : 0 }}
                      title={formatEur(day.revenue)}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 text-center leading-tight">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-brand-brown text-sm mb-4">Статуси</h2>
          <div className="space-y-2">
            {Object.entries(data.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {STATUS_LABELS[status] ?? status}
                </span>
                <span className="text-sm font-semibold text-brand-brown">{count}</span>
              </div>
            ))}
            {Object.keys(data.statusCounts).length === 0 && (
              <p className="text-gray-400 text-sm">Няма данни</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-brand-brown">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
