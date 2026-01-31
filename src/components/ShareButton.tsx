"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";

type ShareButtonProps = {
  label: string;
  copiedLabel: string;
};

const COPY_RESET_MS = 1600;

export default function ShareButton({ label, copiedLabel }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = window.setTimeout(() => setIsCopied(false), COPY_RESET_MS);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

  const copyToClipboard = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0f172a] hover:bg-slate-50 transition-colors"
      aria-live="polite"
    >
      <Share2 className="h-4 w-4 text-[#0ea5e9]" />
      <span>{isCopied ? copiedLabel : label}</span>
    </button>
  );
}
