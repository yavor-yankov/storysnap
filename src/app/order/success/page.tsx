"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Download, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderData {
  orderNumber: string;
  storyTitle: string;
  childName: string;
  productType: string;
  amountCents: number;
  status: string;
  pdfUrl?: string;
}

function SuccessPageInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") ?? "";
  const [order, setOrder] = useState<OrderData | null>(null);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    let tries = 0;
    const maxTries = 30; // poll for up to 30 seconds

    const interval = setInterval(async () => {
      tries++;
      try {
        const res = await fetch(`/api/orders/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
          if (data.status === "complete" || data.status === "failed" || tries >= maxTries) {
            clearInterval(interval);
            setPolling(false);
          }
        }
      } catch {
        if (tries >= maxTries) {
          clearInterval(interval);
          setPolling(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const isDigital = order?.productType === "digital";
  const isComplete = order?.status === "complete";

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-brand-beige px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white p-8 text-center shadow-[0_8px_32px_rgba(17,24,39,0.1)]"
        >
          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-brand-brown">
            Плащането е успешно! 🎉
          </h1>
          <p className="mt-2 text-brand-brown-body">
            {order
              ? `Поръчка ${order.orderNumber} е потвърдена.`
              : "Вашата поръчка е потвърдена."}
          </p>

          {/* Order details */}
          {order && (
            <div className="mt-6 rounded-2xl bg-brand-beige/60 p-4 text-left">
              <div className="space-y-2">
                {[
                  ["Книжка", order.storyTitle],
                  ["За", order.childName],
                  ["Тип", order.productType === "digital" ? "Дигитален PDF" : "Твърда корица"],
                  ["Сума", `€${(order.amountCents / 100).toFixed(2)}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="font-semibold text-brand-brown-body">{label}:</span>
                    <span className="font-bold text-brand-brown-sub">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="mt-6">
            {isDigital && polling && (
              <div className="flex items-center justify-center gap-2 text-sm text-brand-brown-body">
                <Loader2 className="h-4 w-4 animate-spin text-brand-orange" />
                Генерираме книжката...
              </div>
            )}

            {isDigital && isComplete && order?.pdfUrl && !order.pdfUrl.startsWith("mock:") && (
              <a href={order.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full gap-2 rounded-[20px] bg-brand-orange font-bold text-white hover:bg-brand-orange-hover">
                  <Download className="h-4 w-4" />
                  Изтегли книжката (PDF)
                </Button>
              </a>
            )}

            {isDigital && isComplete && (!order?.pdfUrl || order.pdfUrl.startsWith("mock:")) && (
              <div className="rounded-xl bg-brand-yellow-light p-4 text-sm">
                <p className="font-semibold text-brand-brown">
                  📬 Проверете имейла си!
                </p>
                <p className="mt-1 text-brand-brown-body">
                  Изпратихме книжката на вашия имейл. Моля, проверете и папката
                  „Спам".
                </p>
              </div>
            )}

            {!isDigital && (
              <div className="rounded-xl bg-brand-teal-light p-4 text-sm">
                <p className="font-semibold text-brand-teal">
                  📦 Подготвяме за изпращане
                </p>
                <p className="mt-1 text-brand-brown-body">
                  Ще получите имейл с номер за проследяване до 1–2 работни дни.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="w-full gap-2 rounded-[20px] border-brand-orange/40 font-semibold text-brand-orange hover:border-brand-orange hover:bg-brand-orange/5"
              >
                Виж всички поръчки
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/stories">
              <Button
                variant="ghost"
                className="w-full rounded-[20px] font-semibold text-brand-brown-body hover:bg-brand-gold/20"
              >
                Направи още книжка
              </Button>
            </Link>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-brand-brown-body">
          🇧🇬 Произведено в България с ❤️ · 30 дни гаранция · info@herobook.bg
        </p>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense>
      <SuccessPageInner />
    </Suspense>
  );
}
