import type { Metadata } from "next";
import { Russo_One, Montserrat } from "next/font/google";
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
  title: "Iarosław Romanevich: Big dreams bait - Professional Carp Fishing Equipment",
  description:
    "The best selection of carp fishing gear. Rods, reels, bait and accessories from leading brands.",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const locale = params.locale ?? "en";

  return (
    <html lang={locale} className={`${russoOne.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full max-w-[100vw]">{children}</body>
    </html>
  );
}
