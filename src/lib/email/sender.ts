import { Resend } from "resend";
import { OrderConfirmationEmail, BookReadyEmail } from "./templates";
import { resolveSignedPdfUrl } from "@/lib/pdf/signed-url";
import React from "react";

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === "re_...") return null;
  return new Resend(apiKey);
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "HeroBook <noreply@herobook.bg>";

interface OrderInfo {
  orderNumber: string;
  storyTitle: string;
  childName: string;
  productType: string;
  amountCents: number;
  customerEmail: string;
  sessionId?: string;
  pdfUrl?: string;
  status?: string;
}

export async function sendOrderConfirmation({ order }: { order: OrderInfo }) {
  const resend = getResend();
  if (!resend) {
    console.log(`[DEV] Order confirmation email to ${order.customerEmail}`, order.orderNumber);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `Поръчка ${order.orderNumber} — потвърдена ✓`,
    react: React.createElement(OrderConfirmationEmail, { order }),
  });
}

export async function sendBookReady({ order }: { order: OrderInfo }) {
  // Resolve a 7-day signed URL so the email button is a direct download link.
  const directPdfUrl = await resolveSignedPdfUrl(
    order.pdfUrl ?? null,
    7 * 24 * 3600, // 7 days
    order.childName,
    order.storyTitle
  );

  const orderWithDirectUrl = { ...order, pdfUrl: directPdfUrl ?? order.pdfUrl };

  const resend = getResend();
  if (!resend) {
    console.log(`[DEV] Book ready email to ${order.customerEmail}`, directPdfUrl ?? order.pdfUrl);
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: order.customerEmail,
    subject: `Книжката на ${order.childName} е готова! 🎉`,
    react: React.createElement(BookReadyEmail, { order: orderWithDirectUrl }),
  });
}
