"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { supabase } from "@/lib/supabaseClient";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "dreams-bait-cart";

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

export function CartProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAuthed, setIsAuthed] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [toast, setToast] = useState<{ id: number; name: string } | null>(null);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isActive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isActive) return;
      const session = data.session;
      setIsAuthed(Boolean(session));
      setUserId(session?.user?.id ?? null);
      setIsReady(true);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!isActive) return;
        setIsAuthed(Boolean(session));
        setUserId(session?.user?.id ?? null);
        setIsReady(true);
      }
    );
    return () => {
      isActive = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isReady || isAuthed || !hasLoadedStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write errors
    }
  }, [items, isAuthed, isReady, hasLoadedStorage]);

  useEffect(() => {
    if (!isReady) return;
    if (isAuthed) {
      const loadFromDb = async () => {
        if (!userId) return;
        const { data, error } = await supabase
          .from("cart_items")
          .select("product_id, name, image_url, price, qty")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error || !data) return;
        const mapped = data.map((row) => ({
          id: row.product_id ?? row.name,
          name: row.name,
          price: Number(row.price),
          image: row.image_url ?? "",
          qty: row.qty,
        }));
        setItems(mapped);
      };

      const syncGuest = async () => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (!stored) return;
          const parsed = JSON.parse(stored) as CartItem[];
          if (!Array.isArray(parsed) || parsed.length === 0) return;
          const payload = parsed.map((item) => ({
            user_id: userId,
            product_id: isUuid(item.id) ? item.id : null,
            name: item.name,
            image_url: item.image,
            price: item.price,
            qty: item.qty,
          }));
          await supabase
            .from("cart_items")
            .upsert(payload, { onConflict: "user_id,product_id" });
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore sync errors
        }
      };

      syncGuest().then(loadFromDb);
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as CartItem[];
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
        setHasLoadedStorage(true);
      } catch {
        // Ignore storage parsing errors
        setHasLoadedStorage(true);
      }
    }
  }, [isAuthed, isReady, userId]);

  const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      const next = existing
        ? prev.map((entry) =>
            entry.id === item.id ? { ...entry, qty: entry.qty + qty } : entry
          )
        : [...prev, { ...item, qty }];

      if (isAuthed && userId) {
        const nextQty = existing ? existing.qty + qty : qty;
        supabase.from("cart_items").upsert(
          {
            user_id: userId,
            product_id: isUuid(item.id) ? item.id : null,
            name: item.name,
            image_url: item.image,
            price: item.price,
            qty: nextQty,
          },
          { onConflict: "user_id,product_id" }
        );
      } else {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          setHasLoadedStorage(true);
        } catch {
          // Ignore storage write errors
        }
      }
      return next;
    });

    const nextToast = { id: Date.now(), name: item.name };
    setToast(nextToast);
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  const removeItem: CartContextValue["removeItem"] = (id) => {
    setItems((prev) => {
      const next = prev.filter((entry) => entry.id !== id);
      if (isAuthed && userId) {
        supabase
          .from("cart_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", isUuid(id) ? id : null);
      }
      return next;
    });
  };

  const updateQty: CartContextValue["updateQty"] = (id, qty) => {
    setItems((prev) => {
      const next = prev
        .map((entry) => (entry.id === id ? { ...entry, qty } : entry))
        .filter((entry) => entry.qty > 0);
      if (isAuthed && userId) {
        if (qty <= 0) {
          supabase
            .from("cart_items")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", isUuid(id) ? id : null);
        } else {
          supabase
            .from("cart_items")
            .update({ qty })
            .eq("user_id", userId)
            .eq("product_id", isUuid(id) ? id : null);
        }
      }
      return next;
    });
  };

  const clear = () => {
    setItems([]);
    if (isAuthed && userId) {
      supabase.from("cart_items").delete().eq("user_id", userId);
    } else {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
    }
  };

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);
    return { items, itemCount, total, addItem, removeItem, updateQty, clear };
  }, [items]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast && (
        <div className="fixed top-24 right-6 z-[70] flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {t("cart.added")}
            </div>
            <div className="text-xs text-slate-500 line-clamp-1">{toast.name}</div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
