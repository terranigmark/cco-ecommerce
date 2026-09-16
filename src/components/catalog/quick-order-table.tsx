"use client";

import { useCart, usePrefs } from "@/components/providers";
import { Stepper } from "@/components/ui/stepper";
import { Thumb } from "@/components/ui/thumb";
import { localized, money, pad, sku } from "@/lib/products";
import type { Product } from "@/lib/types";

export function QuickOrderTable({
  products,
  selected,
  onSelectFormat,
}: {
  products: Product[];
  selected: Record<string, string>;
  onSelectFormat: (productId: string, formatId: string) => void;
}) {
  const { t, lang } = usePrefs();
  const { qtyOf, setQty } = useCart();

  const th =
    "px-2 py-2.5 font-medium first:pl-4 last:pr-4 border-b [border-color:var(--ink)]";

  return (
    <div className="overflow-auto">
      <table className="w-full min-w-[760px] border-collapse [font-variant-numeric:tabular-nums]">
        <thead>
          <tr
            className="mono text-left text-[10px] uppercase tracking-[0.1em]"
            style={{ color: "var(--mu)" }}
          >
            <th className={th}>#</th>
            <th className={th}>{t.product}</th>
            <th className={th}>{t.style}</th>
            <th className={`${th} text-right`}>ABV</th>
            <th className={`${th} text-right`}>IBU</th>
            <th className={th}>{t.format}</th>
            <th className={`${th} text-right`}>{t.price}</th>
            <th className={`${th} text-right`}>{t.qty}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => {
            const format =
              p.formats.find((f) => f.id === selected[p.id]) ?? p.formats[0];
            const qty = qtyOf(p.id, format.id);
            return (
              <tr
                key={p.id}
                className="border-b"
                style={{
                  borderColor: "var(--ln)",
                  background:
                    qty > 0
                      ? "color-mix(in oklab, var(--ac) 12%, transparent)"
                      : "transparent",
                }}
              >
                <td className="mono px-4 py-1.5 text-[11px]" style={{ color: "var(--mu)" }}>
                  {pad(i + 1)}
                </td>
                <td className="px-2 py-1.5">
                  <div className="flex items-center gap-3">
                    <Thumb src={p.img} alt="" className="h-11 w-8" sizes="32px" />
                    <div className="flex min-w-0 flex-col">
                      <span className="font-bold whitespace-nowrap">{p.name}</span>
                      <span
                        className="mono text-[10px] tracking-[0.04em] whitespace-nowrap"
                        style={{ color: "var(--mu)" }}
                      >
                        {sku(p, format)} · {p.breweryName}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  className="px-2 py-1.5 text-xs whitespace-nowrap"
                  style={{ color: "var(--mu)" }}
                >
                  {localized(p.style, lang)}
                </td>
                <td className="mono px-2 py-1.5 text-right text-xs">
                  {p.abv != null ? `${p.abv}%` : "—"}
                </td>
                <td className="mono px-2 py-1.5 text-right text-xs">
                  {p.ibu != null ? p.ibu : "—"}
                </td>
                <td className="px-2 py-1.5">
                  <select
                    value={format.id}
                    onChange={(e) => onSelectFormat(p.id, e.target.value)}
                    aria-label={t.format}
                    className="mono h-[30px] max-w-[190px] px-1.5 text-[11px]"
                    style={{ border: "1px solid var(--bd)", background: "var(--sf)" }}
                  >
                    {p.formats.map((f) => (
                      <option key={f.id} value={f.id}>
                        {localized(f.label, lang)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="mono px-2 py-1.5 text-right text-[13px] font-semibold whitespace-nowrap">
                  {money(format.price)}
                </td>
                <td className="px-4 py-1.5">
                  <div className="flex justify-end">
                    <Stepper
                      size="sm"
                      qty={qty}
                      onInc={() => setQty(p, format, qty + 1)}
                      onDec={() => setQty(p, format, qty - 1)}
                      onSet={(v) => setQty(p, format, v)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
