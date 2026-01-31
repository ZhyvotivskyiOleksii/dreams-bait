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

export default function BreadcrumbsBar({ items, className }: BreadcrumbsBarProps) {
  return (
    <div
      className={clsx(
        "sm:sticky sm:top-16 z-40 -mx-4 bg-slate-50 px-2 pt-2 pb-3 sm:pt-5 sm:pb-5 mb-3 sm:mb-6",
        className
      )}
    >
      <nav className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-[#3e3e3e]">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const content = item.isHome ? (
            <span className="inline-flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </span>
          ) : (
            <span>{item.label}</span>
          );

          return (
            <span key={`${item.label}-${index}`} className="flex items-center gap-2">
              {!isFirst && <ChevronRight className="h-4 w-4 text-slate-400" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-slate-700 transition-colors">
                  {content}
                </Link>
              ) : (
                <span className={index === items.length - 1 ? "text-slate-700" : undefined}>
                  {content}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </div>
  );
}
