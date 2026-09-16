import { createClientStore } from "./client-store";
import type { CartLine, Lang, Theme, View } from "./types";

export type Prefs = { theme: Theme; lang: Lang; view: View };
export type OrderSnapshot = {
  id: string;
  subtotal: number;
  pieces: number;
  pay: "transfer" | "cash";
  quoteShipping: boolean;
};

export const DEFAULT_PREFS: Prefs = {
  theme: "dark",
  lang: "es",
  view: "grid",
};

export const prefsStore = createClientStore<Prefs>(
  () => localStorage,
  "cco.prefs",
  DEFAULT_PREFS,
  (raw) => {
    if (!raw || typeof raw !== "object") return null;
    const p = raw as Partial<Prefs>;
    return {
      theme: p.theme === "light" ? "light" : "dark",
      lang: p.lang === "en" ? "en" : "es",
      view: p.view === "table" ? "table" : "grid",
    };
  },
);

export const EMPTY_CART: Record<string, CartLine> = {};

export const cartStore = createClientStore<Record<string, CartLine>>(
  () => localStorage,
  "cco.cart",
  EMPTY_CART,
  (raw) => {
    if (!raw || typeof raw !== "object") return null;
    const entries = Object.entries(raw as Record<string, CartLine>).filter(
      ([, line]) =>
        line &&
        typeof line.pid === "string" &&
        typeof line.fid === "string" &&
        typeof line.qty === "number",
    );
    return Object.fromEntries(entries);
  },
);

export const orderStore = createClientStore<OrderSnapshot | null>(
  () => sessionStorage,
  "cco.lastOrder",
  null,
  (raw) =>
    raw && typeof raw === "object" && typeof (raw as OrderSnapshot).id === "string"
      ? (raw as OrderSnapshot)
      : null,
);
