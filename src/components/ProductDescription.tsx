"use client";

import { useState } from "react";
import clsx from "clsx";

type ProductDescriptionProps = {
  title: string;
  description: string;
  moreLabel: string;
  lessLabel: string;
  showTitle?: boolean;
};

export default function ProductDescription({
  title,
  description,
  moreLabel,
  lessLabel,
  showTitle = true,
}: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      {showTitle && (
        <h2 className="text-lg font-heading text-slate-900">{title}</h2>
      )}
      <div className={clsx("relative", showTitle ? "mt-3" : "mt-0")}>
        <p
          className={clsx(
            "text-sm leading-relaxed text-slate-600 transition-all",
            isExpanded ? "" : "max-h-32 overflow-hidden"
          )}
        >
          {description}
        </p>
        {!isExpanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-white/0" />
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="mt-4 w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
      >
        {isExpanded ? lessLabel : moreLabel}
      </button>
    </div>
  );
}
