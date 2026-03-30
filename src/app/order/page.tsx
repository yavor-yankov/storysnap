"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Truck, RefreshCcw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getStoryBySlug } from "@/lib/stories";

type ProductType = "digital" | "physical";

const PRICES: Record<ProductType, { amount: number; label: string; description: string }> = {
  digital: {
    amount: 990,
    label: "Дигитален PDF",
    description: "Изтеглете книжката веднага след плащане.",
  },
  physical: {
    amount: 3400,
    label: "Твърда корица",
    description: "Доставка до 3–5 работни дни с Еконт/Спиди.",
  },
};

function OrderPageInner() {
  const searchParams = useSearchParams();
  const storySlug = searchParams.get("story") ?? "";
  const productType = (searchParams.get("type") ?? "digital") as ProductType;
  const story = getStoryBySlug(storySlug);

  const price = PRICES[productType];

  const [form, setForm] = useState({
    email: "",
    childName: "",
    // Physical only
    recipientName: "",
    street: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate(): boolean {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Въведете валиден имейл адрес.");
      return false;
    }
    if (!form.childName.trim()) {
      setError("Въведете името на детето.");
      return false;
    }
    if (productType === "physical") {
      if (!form.recipientName.trim() || !form.street.trim() || !form.city.trim() || !form.phone.trim()) {
        setError("Попълнете всички полета за доставка.");
        return false;
      }
    }
    setError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storySlug,
          productType,
          email: form.email,
          childName: form.childName,
          shippingAddress:
            productType === "physical"
              ? {
                  name: form.recipientName,
                  street: form.street,
                  city: form.city,
                  postalCode: form.postalCode,
                  phone: form.phone,
                }
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Нещо се обърка. Опитайте отново.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Нещо се обърка. Опитайте отново.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-beige py-10">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <h1 className="mb-2 text-2xl font-black text-brand-brown">
            Финализирайте поръчката
          </h1>
          <p className="text-sm text-brand-brown-body">
            Сигурно плащане с Stripe — приемаме карти и наложен платеж.
          </p>

          {/* Order summary card */}
          <div className="mt-6 rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
            <div className="flex items-center gap-3">
              <div className="h-14 w-10 shrink-0 rounded-[6px] bg-gradient-to-br from-brand-orange/70 to-brand-gold" />
              <div className="flex-1">
                <p className="font-black text-brand-brown">{story?.title ?? storySlug}</p>
                <p className="text-sm text-brand-brown-body">{price.label}</p>
              </div>
              <p className="text-xl font-black text-brand-brown">
                €{(price.amount / 100).toFixed(2)}
              </p>
            </div>
            <p className="mt-3 text-xs text-brand-brown-body">{price.description}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
              <h2 className="mb-4 font-extrabold text-brand-brown">Данни</h2>
              <div className="space-y-3">
                <div>
                  <Label className="font-semibold text-brand-brown-sub">Имейл за доставка</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="vashiyat@email.com"
                    required
                    className="mt-1.5 rounded-xl border-brand-brown/20 focus:border-brand-orange"
                  />
                </div>
                <div>
                  <Label className="font-semibold text-brand-brown-sub">Името на детето</Label>
                  <Input
                    type="text"
                    value={form.childName}
                    onChange={(e) => setField("childName", e.target.value)}
                    placeholder="Ивана, Никола..."
                    required
                    className="mt-1.5 rounded-xl border-brand-brown/20 focus:border-brand-orange"
                  />
                </div>
              </div>
            </div>

            {/* Shipping — physical only */}
            {productType === "physical" && (
              <div className="rounded-2xl bg-white p-5 shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
                <h2 className="mb-4 font-extrabold text-brand-brown">Адрес за доставка</h2>
                <div className="space-y-3">
                  {[
                    { field: "recipientName", label: "Получател", placeholder: "Иван Петров" },
                    { field: "phone", label: "Телефон", placeholder: "+359 88 888 8888" },
                    { field: "street", label: "Улица и номер", placeholder: "ул. Витоша 12, ет. 3" },
                    { field: "city", label: "Град", placeholder: "София" },
                    { field: "postalCode", label: "Пощенски код", placeholder: "1000" },
                  ].map(({ field, label, placeholder }) => (
                    <div key={field}>
                      <Label className="font-semibold text-brand-brown-sub">{label}</Label>
                      <Input
                        value={form[field as keyof typeof form]}
                        onChange={(e) => setField(field, e.target.value)}
                        placeholder={placeholder}
                        required
                        className="mt-1.5 rounded-xl border-brand-brown/20 focus:border-brand-orange"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-13 w-full rounded-[20px] bg-brand-orange text-base font-bold text-white shadow-none transition-all duration-200 hover:bg-brand-orange-hover hover:shadow-lg disabled:opacity-60"
            >
              {loading ? "Пренасочване към плащане..." : `Плати €${(price.amount / 100).toFixed(2)} → Stripe`}
            </Button>
          </form>

          {/* Trust */}
          <div className="mt-6 flex flex-wrap justify-center gap-5">
            {[
              { icon: Shield, text: "Защитено плащане" },
              { icon: RefreshCcw, text: "30 дни гаранция" },
              { icon: Truck, text: "Безплатна доставка" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-brand-brown-body" />
                <span className="text-xs font-semibold text-brand-brown-body">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderPageInner />
    </Suspense>
  );
}
