import Link from "next/link";
import { BookOpen, Download, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { resolveSignedPdfUrl } from "@/lib/pdf/signed-url";
import { redirect } from "next/navigation";

// Status badge config
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid:       { label: "Платено",       color: "bg-blue-100 text-blue-700" },
  generating: { label: "Генерира се...", color: "bg-amber-100 text-amber-700" },
  complete:   { label: "Готово",         color: "bg-green-100 text-green-700" },
  shipped:    { label: "Изпратено",      color: "bg-teal-100 text-teal-700" },
  delivered:  { label: "Доставено",      color: "bg-green-100 text-green-700" },
  refunded:   { label: "Върнато",        color: "bg-gray-100 text-gray-500" },
  failed:     { label: "Грешка",         color: "bg-red-100 text-red-600" },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isSupabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");

  if (isSupabaseConfigured && !user) {
    redirect("/auth/login");
  }

  // Fetch real orders by customer_email (works for guest checkouts too)
  type Order = {
    id: string;
    order_number: string;
    story_id: string;
    child_name: string;
    product_type: string;
    status: string;
    amount_cents: number;
    currency: string;
    pdf_url: string | null;
    created_at: string;
    storyTitle?: string;
    signedPdfUrl?: string | null;
  };

  let orders: Order[] = [];

  if (isSupabaseConfigured && user) {
    // Use service client to bypass RLS — guest orders have user_id=NULL
    // so the normal user-session query returns nothing. We guard by email.
    const service = createServiceClient();
    const { data } = await service
      .from("orders")
      .select("id, order_number, story_id, child_name, product_type, status, amount_cents, currency, pdf_url, created_at")
      .eq("customer_email", user.email!.toLowerCase())
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      // Fetch story titles in one query
      const storyIds = [...new Set(data.map((o) => o.story_id).filter(Boolean))];
      const { data: stories } = await service
        .from("stories")
        .select("id, title")
        .in("id", storyIds);

      const storyMap = Object.fromEntries((stories ?? []).map((s) => [s.id, s.title]));

      // Resolve signed URLs for complete digital orders
      orders = await Promise.all(
        data.map(async (o) => {
          const storyTitle = storyMap[o.story_id] ?? "Книжка";
          const signedPdfUrl =
            o.product_type === "digital" && o.status === "complete" && o.pdf_url
              ? await resolveSignedPdfUrl(o.pdf_url, 3600, o.child_name, storyTitle)
              : null;
          return { ...o, storyTitle, signedPdfUrl };
        })
      );
    }
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.amount_cents, 0);
  const completedCount = orders.filter(
    (o) => o.status === "complete" || o.status === "delivered"
  ).length;

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
            { label: "Поръчки",           value: orders.length,                                icon: BookOpen },
            { label: "Завършени",          value: completedCount,                               icon: Package },
            { label: "Общо изразходвани",  value: `€${(totalSpent / 100).toFixed(2)}`,          icon: ShoppingBag },
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
                        {order.storyTitle ?? "Книжка"}
                      </p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-brand-brown-body">
                      За: <strong>{order.child_name ?? "-"}</strong>
                      {" · "}
                      {isDigital ? "PDF" : "Твърда корица"}
                      {" · "}
                      №{order.order_number ?? order.id}
                    </p>
                    <p className="text-xs text-brand-brown-body/70">{date}</p>
                  </div>

                  {/* Amount + actions */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <p className="font-black text-brand-brown">
                      €{(order.amount_cents / 100).toFixed(2)}
                    </p>

                    {isDigital && order.status === "complete" && order.signedPdfUrl && (
                      <a href={order.signedPdfUrl} download>
                        <Button
                          size="sm"
                          className="gap-1.5 rounded-xl bg-brand-orange text-xs font-bold text-white hover:bg-brand-orange-hover"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Изтегли PDF
                        </Button>
                      </a>
                    )}

                    {isDigital && order.status === "complete" && !order.signedPdfUrl && (
                      <span className="text-xs text-brand-brown-body/60">
                        Провери имейла си
                      </span>
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
      </div>
    </div>
  );
}
