"use client";

import { useCart, usePrefs } from "@/components/providers";
import { Thumb } from "@/components/ui/thumb";
import { BEST_SELLER_IDS } from "@/lib/catalog";
import { PRODUCTS_BY_ID, localized, money, pad } from "@/lib/products";

export function BestSellers() {
  const { t, lang } = usePrefs();
  const { qtyOf, setQty, openDrawer } = useCart();

  const products = BEST_SELLER_IDS.map((id) => PRODUCTS_BY_ID[id]).filter(Boolean);

  return (
    <section className="border-b" style={{ borderColor: "var(--ink)" }}>
      <div className="flex flex-wrap items-baseline justify-between gap-3 px-4 pt-5 pb-2">
        <h2 className="display m-0 text-[40px] leading-[0.9] tracking-[-0.03em] md:text-[56px]">
          {t.bestSellers}
        </h2>
        <span className="kicker">{t.receiptHead}</span>
      </div>

      {products.map((p, i) => {
        const format = p.formats[0];
        const qty = qtyOf(p.id, format.id);
        return (
          <div
            key={p.id}
            className="row-link tint grid grid-cols-[28px_36px_1fr_auto_40px] items-center gap-3 border-t px-4 py-2.5 md:grid-cols-[40px_36px_1.4fr_1fr_auto_44px]"
            style={{ borderColor: "var(--ln)" }}
          >
            <span className="mono text-xs" style={{ color: "var(--mu)" }}>
              {pad(i + 1)}
            </span>
            <Thumb src={p.img} alt="" className="h-12 w-9" sizes="36px" />
            <div className="flex min-w-0 flex-col">
              <span className="text-[15px] leading-[1.1] font-bold">{p.name}</span>
              <span className="text-xs" style={{ color: "var(--mu)" }}>
                {p.breweryName} · {localized(p.style, lang)}
              </span>
            </div>
            <span
              className="mono hidden text-xs whitespace-nowrap md:block"
              style={{ color: "var(--mu)" }}
            >
              {p.abv}% ABV · {p.ibu} IBU
            </span>
            <span className="mono text-right text-sm font-semibold whitespace-nowrap">
              {money(format.price)}
            </span>
            <button
              onClick={() => {
                setQty(p, format, qty + 1);
                openDrawer();
              }}
              className="btn-neo btn-neo-sm h-[34px] px-3 text-xs"
              aria-label={`${t.add} ${p.name}`}
            >
              +
            </button>
          </div>
        );
      })}
    </section>
  );
}
