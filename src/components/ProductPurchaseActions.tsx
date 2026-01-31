"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "./CartProvider";

type ProductPurchaseActionsProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  addLabel: string;
  buyNowLabel: string;
  cartUrl: string;
  isDisabled?: boolean;
};

export default function ProductPurchaseActions({
  product,
  addLabel,
  buyNowLabel,
  cartUrl,
  isDisabled = false,
}: ProductPurchaseActionsProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    if (isDisabled) return;
    addItem(product);
  };

  const handleBuyNow = () => {
    if (isDisabled) return;
    addItem(product);
    router.push(cartUrl);
  };

  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleAdd}
        disabled={isDisabled}
        className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 font-semibold transition-colors ${
          isDisabled
            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
            : "bg-[#7dd3fc] text-black hover:bg-[#f5c542]"
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        {addLabel}
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={isDisabled}
        className={`flex-1 inline-flex items-center justify-center rounded-full border py-3 font-semibold transition-colors ${
          isDisabled
            ? "border-slate-200 text-slate-400 cursor-not-allowed"
            : "border-[#7dd3fc] text-[#0f0f0f] hover:bg-[#7dd3fc]/20"
        }`}
      >
        {buyNowLabel}
      </button>
    </div>
  );
}
