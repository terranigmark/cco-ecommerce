"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DICTS, type Dict } from "@/lib/i18n";
import { MOQ_BEER, MOQ_GLASS } from "@/lib/catalog";
import { PRODUCTS_BY_ID } from "@/lib/products";
import { cartStore, prefsStore } from "@/lib/stores";
import type {
  CartLine,
  Lang,
  Product,
  ProductFormat,
  Theme,
  View,
} from "@/lib/types";

type Prefs = {
  theme: Theme;
  lang: Lang;
  view: View;
  t: Dict;
  toggleTheme: () => void;
  toggleLang: () => void;
  setView: (v: View) => void;
};

const PrefsContext = createContext<Prefs | null>(null);

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside Providers");
  return ctx;
}

type ResolvedLine = {
  key: string;
  product: Product;
  format: ProductFormat;
  qty: number;
  pieces: number;
  total: number;
};

type Moq = {
  title: string;
  count: number;
  min: number;
  ok: boolean;
  pct: string;
  color: string;
  msg: string;
};

type Cart = {
  items: Record<string, CartLine>;
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  moqs: Moq[];
  qtyOf: (productId: string, formatId: string) => number;
  setQty: (product: Product, format: ProductFormat, qty: number) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<Cart | null>(null);

export function useCart(): Cart {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside Providers");
  return ctx;
}

const lineKey = (pid: string, fid: string) => `${pid}:${fid}`;

export function Providers({ children }: { children: ReactNode }) {
  const { theme, lang, view } = useSyncExternalStore(
    prefsStore.subscribe,
    prefsStore.getSnapshot,
    prefsStore.getServerSnapshot,
  );
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
  }, [theme, lang]);

  const setQty = useCallback(
    (product: Product, format: ProductFormat, qty: number) => {
      const next = Math.max(0, Math.round(qty || 0));
      const key = lineKey(product.id, format.id);
      cartStore.update((prev) => {
        const copy = { ...prev };
        if (next === 0) delete copy[key];
        else copy[key] = { pid: product.id, fid: format.id, qty: next };
        return copy;
      });
    },
    [],
  );

  const t = DICTS[lang];

  const lines = useMemo<ResolvedLine[]>(
    () =>
      Object.entries(items)
        .map(([key, line]) => {
          const product = PRODUCTS_BY_ID[line.pid];
          const format = product?.formats.find((f) => f.id === line.fid);
          if (!product || !format) return null;
          return {
            key,
            product,
            format,
            qty: line.qty,
            pieces: line.qty * format.unit,
            total: line.qty * format.price,
          };
        })
        .filter((l): l is ResolvedLine => l !== null),
    [items],
  );

  const count = lines.reduce((a, l) => a + l.pieces, 0);
  const subtotal = lines.reduce((a, l) => a + l.total, 0);

  const moqs = useMemo<Moq[]>(() => {
    const piecesOf = (kind: string) =>
      lines
        .filter((l) => l.product.kind === kind)
        .reduce((a, l) => a + l.pieces, 0);
    const make = (pieces: number, min: number, title: string): Moq => {
      const ok = pieces >= min;
      return {
        title,
        count: pieces,
        min,
        ok,
        pct: Math.min(100, Math.round((pieces / min) * 100)) + "%",
        color: ok ? "var(--ok)" : "var(--warn)",
        msg: ok ? t.moqOk : t.moqNeed(min - pieces, min),
      };
    };
    const beer = piecesOf("beer");
    const glass = piecesOf("glass");
    return [
      ...(beer > 0 ? [make(beer, MOQ_BEER, t.moqBeer)] : []),
      ...(glass > 0 ? [make(glass, MOQ_GLASS, t.moqGlass)] : []),
    ];
  }, [lines, t]);

  const prefs = useMemo<Prefs>(
    () => ({
      theme,
      lang,
      view,
      t,
      toggleTheme: () =>
        prefsStore.update((p) => ({
          ...p,
          theme: p.theme === "dark" ? "light" : "dark",
        })),
      toggleLang: () =>
        prefsStore.update((p) => ({ ...p, lang: p.lang === "es" ? "en" : "es" })),
      setView: (next: View) => prefsStore.update((p) => ({ ...p, view: next })),
    }),
    [theme, lang, view, t],
  );

  const cart = useMemo<Cart>(
    () => ({
      items,
      lines,
      count,
      subtotal,
      moqs,
      qtyOf: (pid, fid) => items[lineKey(pid, fid)]?.qty ?? 0,
      setQty,
      clear: () => cartStore.set({}),
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [items, lines, count, subtotal, moqs, setQty, drawerOpen],
  );

  return (
    <PrefsContext.Provider value={prefs}>
      <CartContext.Provider value={cart}>{children}</CartContext.Provider>
    </PrefsContext.Provider>
  );
}
