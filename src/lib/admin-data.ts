// Shared mock order data for admin (dev mode)
// In production, all reads come from Supabase

export interface AdminOrder {
  id: string;
  order_number: string;
  story_title: string;
  story_slug: string;
  child_name: string;
  customer_email: string;
  product_type: "digital" | "physical";
  status: "paid" | "generating" | "complete" | "shipped" | "delivered" | "refunded";
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

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    order_number: "BK-20260330-0001",
    story_title: "Космическото приключение",
    story_slug: "kosmichesko-priklyuchenie",
    child_name: "Никола",
    customer_email: "maria.todorova@gmail.com",
    product_type: "digital",
    status: "complete",
    amount_cents: 990,
    currency: "EUR",
    pdf_url: null,
    tracking_number: null,
    shipping_address: null,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-2",
    order_number: "BK-20260330-0002",
    story_title: "Суперхеройски ден",
    story_slug: "supergerojski-den",
    child_name: "Ивана",
    customer_email: "ivan.petrov@abv.bg",
    product_type: "physical",
    status: "paid",
    amount_cents: 3400,
    currency: "EUR",
    pdf_url: null,
    tracking_number: null,
    shipping_address: {
      name: "Иван Петров",
      street: "ул. Витоша 12, ет. 3",
      city: "Пловдив",
      postal_code: "4000",
      phone: "+359 88 123 4567",
    },
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-3",
    order_number: "BK-20260329-0003",
    story_title: "Принцесата от Изгрева",
    story_slug: "printsesata-ot-izgreva",
    child_name: "Елена",
    customer_email: "snezhana@yahoo.com",
    product_type: "physical",
    status: "shipped",
    amount_cents: 3400,
    currency: "EUR",
    pdf_url: null,
    tracking_number: "1234567890",
    shipping_address: {
      name: "Снежана Димитрова",
      street: "бул. Сливница 45",
      city: "Варна",
      postal_code: "9000",
      phone: "+359 87 987 6543",
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-4",
    order_number: "BK-20260329-0004",
    story_title: "Динозавърът приятел",
    story_slug: "dinozavarat-priyatel",
    child_name: "Борис",
    customer_email: "ana.koleva@gmail.com",
    product_type: "digital",
    status: "complete",
    amount_cents: 990,
    currency: "EUR",
    pdf_url: null,
    tracking_number: null,
    shipping_address: null,
    created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1.4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-5",
    order_number: "BK-20260328-0005",
    story_title: "Пиратите на Черно море",
    story_slug: "piratite-na-cherno-more",
    child_name: "Мартин",
    customer_email: "plamen.s@mail.bg",
    product_type: "physical",
    status: "delivered",
    amount_cents: 3400,
    currency: "EUR",
    pdf_url: null,
    tracking_number: "9876543210",
    shipping_address: {
      name: "Пламен Стоянов",
      street: "ул. Хан Омуртаг 7",
      city: "Бургас",
      postal_code: "8000",
      phone: "+359 89 555 1234",
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-6",
    order_number: "BK-20260327-0006",
    story_title: "В джунглата на приятелите",
    story_slug: "v-dzhunglata-na-priyatelite",
    child_name: "Зара",
    customer_email: "diana.koleva@gmail.com",
    product_type: "digital",
    status: "complete",
    amount_cents: 990,
    currency: "EUR",
    pdf_url: null,
    tracking_number: null,
    shipping_address: null,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function computeAnalytics(orders: AdminOrder[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  const ordersToday = orders.filter((o) => new Date(o.created_at) >= todayStart);
  const ordersThisWeek = orders.filter((o) => new Date(o.created_at) >= weekStart);

  const revenueTotal = orders.reduce((s, o) => s + o.amount_cents, 0);
  const revenueToday = ordersToday.reduce((s, o) => s + o.amount_cents, 0);

  const digitalCount = orders.filter((o) => o.product_type === "digital").length;
  const physicalCount = orders.filter((o) => o.product_type === "physical").length;

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Daily revenue for last 7 days
  const dailyRevenue: { date: string; revenue: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayStart);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    const dayOrders = orders.filter((o) => {
      const t = new Date(o.created_at);
      return t >= d && t < next;
    });
    dailyRevenue.push({
      date: d.toLocaleDateString("bg-BG", { weekday: "short", day: "numeric" }),
      revenue: dayOrders.reduce((s, o) => s + o.amount_cents, 0),
      orders: dayOrders.length,
    });
  }

  return {
    ordersTotal: orders.length,
    ordersToday: ordersToday.length,
    ordersThisWeek: ordersThisWeek.length,
    revenueTotal,
    revenueToday,
    digitalCount,
    physicalCount,
    statusCounts,
    dailyRevenue,
  };
}
