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

  return (
    <>
      <Header />
      <main className="flex-1 min-w-0 w-full overflow-x-hidden">{children}</main>
      {!hideFooter && <Footer />}
      <ChatWidget />
    </>
  );
}
