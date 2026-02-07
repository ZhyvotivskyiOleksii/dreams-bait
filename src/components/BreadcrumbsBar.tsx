"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import clsx from "clsx";

type BreadcrumbItem = {
  label: string;
  href?: string;
  isHome?: boolean;
};

type BreadcrumbsBarProps = {
  items: BreadcrumbItem[];
  className?: string;
};

const HEADER_HEIGHT = 52; // фактична висота хедера на мобільному (py-2 + ряд ~52px)
// Висота смуги: padding 0.75rem зверху + знизу + ряд тексту ≈ 48px
const BAR_HEIGHT = 48;

export default function BreadcrumbsBar({ items, className }: BreadcrumbsBarProps) {
  return (
    <>
      {/* Фіксована смуга одразу під хедером, без відступу */}
      <div
        className={clsx(
          "fixed left-0 right-0 z-40 bg-white border-b border-slate-200 min-w-0 overflow-hidden top-[52px] sm:top-16",
          className
        )}
      >
        <div
          className="container mx-auto px-4 flex items-center min-h-[40px]"
          style={{ paddingTop: "0.75rem", paddingBottom: "0.75rem" }}
        >
          <nav className="flex flex-nowrap items-center gap-2 text-[13px] font-medium text-slate-900 min-w-0 overflow-hidden leading-none">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const content = item.isHome ? (
            <span className="inline-flex items-center gap-1 flex-shrink-0 leading-none">
              <Home className="h-4 w-4 flex-shrink-0 text-slate-700" />
              <span className="hidden sm:inline leading-none">{item.label}</span>
            </span>
          ) : (
            <span className="leading-none">{item.label}</span>
          );

          const isLast = index === items.length - 1;
          return (
            <span
              key={`${item.label}-${index}`}
              className={clsx(
                "inline-flex items-center gap-2 flex-shrink-0 min-h-[1em]",
                isLast && "min-w-0 flex-shrink overflow-hidden"
              )}
            >
              {!isFirst && <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-600" />}
              {item.href ? (
                <Link href={item.href} className="inline-flex items-center text-slate-800 hover:text-slate-950 transition-colors leading-none">
                  {content}
                </Link>
              ) : (
                <span
                  className={clsx("inline-flex items-center", isLast && "truncate min-w-0 text-slate-950 font-semibold leading-none")}
                  title={isLast ? item.label : undefined}
                >
                  {content}
                </span>
              )}
            </span>
          );
        })}
          </nav>
        </div>
      </div>
      {/* Spacer тільки під смугу крихт: main вже має pt під хедер, тому не дублюємо HEADER_HEIGHT */}
      <div className="min-w-0 overflow-hidden mb-0 sm:mb-6" style={{ height: BAR_HEIGHT }} aria-hidden />
    </>
  );
}
