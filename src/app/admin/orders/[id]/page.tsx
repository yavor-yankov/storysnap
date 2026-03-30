"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Package, BookOpen, Mail, MapPin, Hash } from "lucide-react";

interface AdminOrder {
  id: string;
  order_number: string;
  story_title: string;
  story_slug: string;
  child_name: string;
  customer_email: string;
  product_type: "digital" | "physical";
  status: string;
  amount_cents: number;
  currency: string;
  pdf_url: string | null;
  tracking_number: string | null;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    postal_code: string;
    phone: string;
  } | null;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = [
  { value: "paid", label: "Платена" },
  { value: "generating", label: "Генерира се" },
  { value: "complete", label: "Завършена" },
  { value: "shipped", label: "Изпратена" },
  { value: "delivered", label: "Доставена" },
  { value: "refunded", label: "Върната" },
];

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
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d);
        setStatus(d.status ?? "");
        setTracking(d.tracking_number ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const body: Record<string, string> = { status };
      if (tracking) body.tracking_number = tracking;

      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Грешка при запазване");
      setSaved(true);
      setOrder((prev) => prev ? { ...prev, status, tracking_number: tracking || prev.tracking_number } : prev);
    } catch {
      setError("Неуспешно запазване. Опитайте отново.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-gray-400 text-sm">Зарежда се...</div>;
  }

  if (!order) {
    return (
      <div className="p-8">
        <p className="text-red-500 text-sm">Поръчката не е намерена.</p>
        <Link href="/admin/orders" className="text-brand-orange text-sm hover:underline mt-2 inline-block">
          ← Назад към поръчки
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/orders"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-brown">{order.order_number}</h1>
          <p className="text-gray-400 text-xs mt-0.5">Създадена {formatDate(order.created_at)}</p>
        </div>
        <span
          className={`ml-auto text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}
        >
          {STATUS_OPTIONS.find((s) => s.value === order.status)?.label ?? order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order info */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-brand-brown text-sm">Детайли за поръчката</h2>

          <InfoRow icon={<BookOpen className="h-4 w-4" />} label="Книга" value={order.story_title} />
          <InfoRow icon={<Hash className="h-4 w-4" />} label="Дете" value={order.child_name} />
          <InfoRow
            icon={<Package className="h-4 w-4" />}
            label="Тип"
            value={order.product_type === "digital" ? "Дигитален PDF" : "Физическа книга"}
          />
          <InfoRow
            icon={<Mail className="h-4 w-4" />}
            label="Имейл"
            value={order.customer_email}
          />

          <div className="pt-2 border-t border-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Сума</span>
              <span className="font-bold text-brand-brown">{formatEur(order.amount_cents)}</span>
            </div>
          </div>

          {order.pdf_url && (
            <a
              href={order.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-sm text-brand-orange hover:underline font-medium"
            >
              Изтегли PDF
            </a>
          )}
        </div>

        {/* Shipping */}
        {order.shipping_address && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <h2 className="font-semibold text-brand-brown text-sm">Адрес за доставка</h2>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-medium text-brand-brown">{order.shipping_address.name}</p>
              <p>{order.shipping_address.street}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.phone}</p>
            </div>
            {order.tracking_number && (
              <div className="pt-2 border-t border-gray-50">
                <p className="text-xs text-gray-500">Номер за проследяване</p>
                <p className="font-mono text-sm text-brand-brown mt-1">{order.tracking_number}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-semibold text-brand-brown text-sm">Актуализиране</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 font-medium mb-1.5">Статус</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {order.product_type === "physical" && (
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">
                Номер за проследяване
              </label>
              <input
                type="text"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="напр. 1234567890"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
              />
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}
        {saved && <p className="text-emerald-600 text-xs">Промените са запазени.</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-brand-orange text-white rounded-lg text-sm font-semibold hover:bg-brand-orange/90 transition-colors disabled:opacity-60"
        >
          {saving ? "Запазва се..." : "Запази промените"}
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm text-brand-brown font-medium">{value}</p>
      </div>
    </div>
  );
}
