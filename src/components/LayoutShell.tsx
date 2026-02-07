"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "./ChatWidget";

type LayoutShellProps = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const hideFooter = pathname?.includes("/auth") || pathname?.includes("/admin") || pathname?.includes("/account");
  const showMobileNav = pathname && !pathname.includes("/auth") && !pathname.includes("/admin");

  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col">
      <Header />
      <main className={`min-h-0 flex-1 w-full min-w-0 overflow-x-hidden overflow-y-auto pt-[52px] sm:pt-16 ${showMobileNav ? "pb-16 sm:pb-0" : ""}`}>{children}</main>
      {!hideFooter && <Footer />}
      <ChatWidget />
    </div>
  );
}
