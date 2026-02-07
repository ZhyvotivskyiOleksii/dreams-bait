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

const HEADER_HEIGHT = 52; // фактична висота хедера на мобільному (py-2 + ряд ~52px), без щілини
const BAR_HEIGHT = 40;   // breadcrumbs bar height

export default function BreadcrumbsBar({ items, className }: BreadcrumbsBarProps) {
  return (
    <>
      {/* Фіксована смуга одразу під хедером, без відступу */}
      <div
        className={clsx(
          "fixed left-0 right-0 z-40 bg-white border-b border-slate-200 min-w-0 overflow-hidden",
          className
        )}
        style={{ top: HEADER_HEIGHT }}
      >
        <div className="container mx-auto px-4 pt-2 pb-3 sm:pt-3 sm:pb-3 min-h-[40px] flex items-center">
          <nav className="flex flex-nowrap items-center gap-2 text-[13px] font-medium text-slate-900 min-w-0 overflow-hidden">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const content = item.isHome ? (
            <span className="inline-flex items-center gap-1 flex-shrink-0">
              <Home className="h-4 w-4 text-slate-700" />
              <span className="hidden sm:inline">{item.label}</span>
            </span>
          ) : (
            <span>{item.label}</span>
          );

          const isLast = index === items.length - 1;
          return (
            <span
              key={`${item.label}-${index}`}
              className={clsx(
                "flex items-center gap-2 flex-shrink-0",
                isLast && "min-w-0 flex-shrink overflow-hidden"
              )}
            >
              {!isFirst && <ChevronRight className="h-4 w-4 text-slate-600 flex-shrink-0" />}
              {item.href ? (
                <Link href={item.href} className="text-slate-800 hover:text-slate-950 transition-colors">
                  {content}
                </Link>
              ) : (
                <span
                  className={clsx(isLast && "block truncate min-w-0 text-slate-950 font-semibold")}
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
      {/* Spacer щоб контент не заходив під фіксовані хедер і крошки */}
      <div className="min-w-0 overflow-hidden mb-3 sm:mb-6" style={{ height: HEADER_HEIGHT + BAR_HEIGHT }} aria-hidden />
    </>
  );
}
