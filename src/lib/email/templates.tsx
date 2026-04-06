import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

const main = {
  backgroundColor: "#f4ece0",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  margin: "24px auto",
  padding: "40px",
  maxWidth: "560px",
};

const logo = {
  color: "#ff723b",
  fontSize: "24px",
  fontWeight: "900",
  marginBottom: "24px",
};

const heading = {
  color: "#1a0c06",
  fontSize: "22px",
  fontWeight: "800",
  lineHeight: "1.3",
};

const paragraph = {
  color: "#6b625e",
  fontSize: "15px",
  lineHeight: "1.6",
};

const highlightBox = {
  backgroundColor: "#fff7e1",
  borderRadius: "12px",
  padding: "16px",
  margin: "20px 0",
};

const cta = {
  backgroundColor: "#ff723b",
  borderRadius: "20px",
  color: "#ffffff",
  display: "block",
  fontSize: "15px",
  fontWeight: "700",
  padding: "14px 28px",
  textDecoration: "none",
  textAlign: "center" as const,
};

const footer = {
  color: "#9ca4ab",
  fontSize: "12px",
  textAlign: "center" as const,
  marginTop: "24px",
};

interface OrderInfo {
  orderNumber: string;
  storyTitle: string;
  childName: string;
  productType: string;
  amountCents: number;
  customerEmail: string;
  sessionId?: string;
  pdfUrl?: string;
}

export function OrderConfirmationEmail({ order }: { order: OrderInfo }) {
  const amount = (order.amountCents / 100).toFixed(2);
  const productLabel = order.productType === "digital" ? "Дигитален PDF" : "Твърда корица";

  return (
    <Html lang="bg">
      <Head />
      <Preview>Поръчка {order.orderNumber} е потвърдена ✓</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>HeroBook</Text>

          <Heading style={heading}>
            Поръчката ви е потвърдена! 🎉
          </Heading>

          <Text style={paragraph}>
            Здравейте! Получихме вашата поръчка за персонализирана книжка за{" "}
            <strong>{order.childName}</strong>. Вече работим по нея!
          </Text>

          <Section style={highlightBox}>
            <Text style={{ ...paragraph, color: "#3c3a39", margin: "0 0 8px" }}>
              <strong>Номер на поръчка:</strong> {order.orderNumber}
            </Text>
            <Text style={{ ...paragraph, color: "#3c3a39", margin: "0 0 8px" }}>
              <strong>Книжка:</strong> {order.storyTitle}
            </Text>
            <Text style={{ ...paragraph, color: "#3c3a39", margin: "0 0 8px" }}>
              <strong>Тип:</strong> {productLabel}
            </Text>
            <Text style={{ ...paragraph, color: "#3c3a39", margin: "0" }}>
              <strong>Сума:</strong> €{amount}
            </Text>
          </Section>

          <Text style={paragraph}>
            {order.productType === "digital"
              ? "Ще получите имейл с линк за изтегляне след като книжката е готова (обикновено до 30 минути)."
              : "Ще получите имейл с номер за проследяване след изпращане на книжката (3–5 работни дни)."}
          </Text>

          <Hr style={{ borderColor: "#e8ddd0", margin: "24px 0" }} />

          <Text style={footer}>
            🇧🇬 Произведено в България с ❤️{"\n"}
            herobook.bg · Безплатна доставка · 30 дни гаранция{"\n\n"}
            Ако имате въпроси, пишете ни на info@herobook.bg
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function BookReadyEmail({ order }: { order: OrderInfo }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://herobook.bg";

  // pdfUrl is a pre-resolved 7-day signed URL set by sendBookReady().
  // Fall back to dashboard if somehow missing.
  const downloadUrl = order.pdfUrl && !order.pdfUrl.startsWith("supabase-storage:")
    ? order.pdfUrl
    : order.sessionId
      ? `${appUrl}/order/success?session_id=${order.sessionId}&email=${encodeURIComponent(order.customerEmail)}`
      : `${appUrl}/dashboard`;

  return (
    <Html lang="bg">
      <Head />
      <Preview>Книжката на {order.childName} е готова за изтегляне! 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>HeroBook</Text>

          <Heading style={heading}>
            Книжката на {order.childName} е готова! 🎉
          </Heading>

          <Text style={paragraph}>
            Вълнуващо! Персонализираната книжка „{order.storyTitle}" е готова.
            Кликнете на бутона по-долу, за да я изтеглите.
          </Text>

          <Button href={downloadUrl} style={cta}>
            📄 Изтегли книжката (PDF)
          </Button>

          <Text style={{ ...paragraph, marginTop: "20px" }}>
            Препоръчваме да отпечатате книжката на качествена хартия за
            най-добри резултати, или да я четете на таблет или компютър.
          </Text>

          <Hr style={{ borderColor: "#e8ddd0", margin: "24px 0" }} />

          <Text style={footer}>
            🇧🇬 Произведено в България с ❤️{"\n"}
            herobook.bg · Поръчка: {order.orderNumber}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
