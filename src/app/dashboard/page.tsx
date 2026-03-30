import Link from "next/link";
import { BookOpen, Download, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Status badge config
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid: { label: "Платено", color: "bg-blue-100 text-blue-700" },
  generating: { label: "Генерира се...", color: "bg-amber-100 text-amber-700" },
  complete: { label: "Готово", color: "bg-green-100 text-green-700" },
  shipped: { label: "Изпратено", color: "bg-teal-100 text-teal-700" },
  delivered: { label: "Доставено", color: "bg-green-100 text-green-700" },
  refunded: { label: "Върнато", color: "bg-gray-100 text-gray-500" },
};

// Mock orders for dev (no Supabase configured)
const MOCK_ORDERS = [
  {
    id: "demo-1",
    order_number: "BK-20260330-0001",
    story_title: "Космическото приключение",
    child_name: "Никола",
    product_type: "digital",
    status: "complete",
    amount_cents: 990,
    currency: "EUR",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    pdf_url: null,
  },
  {
    id: "demo-2",
    order_number: "BK-20260325-0002",
    story_title: "Суперхеройски ден",
    child_name: "Ивана",
    product_type: "physical",
    status: "shipped",
    amount_cents: 3400,
    currency: "EUR",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    pdf_url: null,
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If Supabase is configured and user is not logged in, redirect
  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

  if (isSupabaseConfigured && !user) {
    redirect("/auth/login");
  }

  // Fetch orders (mock in dev)
  let orders = MOCK_ORDERS;
  if (isSupabaseConfigured && user) {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) orders = data;
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.amount_cents, 0);
  const completedCount = orders.filter((o) => o.status === "complete" || o.status === "delivered").length;

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-brand-brown">Моите книжки</h1>
            <p className="mt-1 text-brand-brown-body">
              {user ? `Здравейте, ${user.email}` : "Преглед на вашите поръчки"}
            </p>
          </div>
          <Link href="/stories">
            <Button className="gap-2 rounded-[20px] bg-brand-orange font-bold text-white hover:bg-brand-orange-hover">
              <ShoppingBag className="h-4 w-4" />
              Нова книжка
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Поръчки", value: orders.length, icon: BookOpen },
            { label: "Завършени", value: completedCount, icon: Package },
            {
              label: "Общо изразходвани",
              value: `€${(totalSpent / 100).toFixed(2)}`,
              icon: ShoppingBag,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(17,24,39,0.07)]"
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/10">
                <Icon className="h-5 w-5 text-brand-orange" />
              </div>
              <p className="text-2xl font-black text-brand-brown">{value}</p>
              <p className="text-sm text-brand-brown-body">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white py-16 text-center shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-brand-gold/60" />
            <p className="text-lg font-bold text-brand-brown">Нямате поръчки все още</p>
            <p className="mt-2 text-sm text-brand-brown-body">
              Изберете книжка и направете детето си герой!
            </p>
            <Link href="/stories" className="mt-6 inline-block">
              <Button className="rounded-[20px] bg-brand-orange font-bold text-white hover:bg-brand-orange-hover">
                Виж книжките
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.paid;
              const isDigital = order.product_type === "digital";
              const date = new Date(order.created_at).toLocaleDateString("bg-BG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <div
                  key={order.id}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_12px_rgba(17,24,39,0.07)] sm:flex-row sm:items-center"
                >
                  {/* Book cover */}
                  <div className="h-14 w-10 shrink-0 rounded-[6px] bg-gradient-to-br from-brand-orange/70 to-brand-gold shadow-sm" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-extrabold text-brand-brown truncate">
                        {(order as { story_title?: string }).story_title ?? "Книжка"}
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-brand-brown-body">
                      За: <strong>{(order as { child_name?: string }).child_name ?? "-"}</strong>
                      {" · "}
                      {isDigital ? "PDF" : "Твърда корица"}
                      {" · "}
                      №{(order as { order_number?: string }).order_number ?? order.id}
                    </p>
                    <p className="text-xs text-brand-brown-body/70">{date}</p>
                  </div>

                  {/* Amount + actions */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <p className="font-black text-brand-brown">
                      €{(order.amount_cents / 100).toFixed(2)}
                    </p>
                    {isDigital && order.status === "complete" && order.pdf_url && (
                      <a href={order.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          className="gap-1.5 rounded-xl bg-brand-orange text-xs font-bold text-white hover:bg-brand-orange-hover"
                        >
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </Button>
                      </a>
                    )}
                    {order.status === "generating" && (
                      <span className="text-xs font-semibold text-amber-600">
                        Генерира се...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dev notice */}
        {!isSupabaseConfigured && (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
            <p className="font-bold text-amber-800">Режим на разработка</p>
            <p className="mt-1 text-amber-700">
              Показват се примерни поръчки. Свържете Supabase в{" "}
              <code className="rounded bg-amber-100 px-1 font-mono text-xs">.env.local</code>{" "}
              за реални данни.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
