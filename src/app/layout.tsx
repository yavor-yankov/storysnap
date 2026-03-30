import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeroBook — Направи детето си героя на своята книжка",
  description:
    "Персонализирани детски книжки с лицето на вашето дете. Качете снимка, изберете история и получете вълшебна книжка, в която вашето дете е главният герой.",
  keywords: [
    "персонализирана детска книжка",
    "детски книжки с лицето на детето",
    "подарък за дете",
    "произведено в България",
  ],
  openGraph: {
    title: "HeroBook — Направи детето си героя на своята книжка",
    description:
      "Персонализирани детски книжки с лицето на вашето дете. Вълшебен подарък, произведен в България.",
    locale: "bg_BG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" className={`${nunito.variable} ${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
