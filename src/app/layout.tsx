import type { Metadata } from "next";
import { Russo_One, Montserrat } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const russoOne = Russo_One({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dreams Bait - Professional Carp Fishing Equipment",
  description:
    "The best selection of carp fishing gear. Rods, reels, bait and accessories from leading brands.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${russoOne.variable} ${montserrat.variable}`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
