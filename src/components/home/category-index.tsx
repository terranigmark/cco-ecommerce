"use client";

import Link from "next/link";
import { useState } from "react";
import { usePrefs } from "@/components/providers";
import { Thumb } from "@/components/ui/thumb";
import { PRODUCTS, localized, pad } from "@/lib/products";
import type { Kind } from "@/lib/types";

export function CategoryIndex() {
  const { t, lang } = usePrefs();
  const [open, setOpen] = useState<Kind | null>("beer");

  const meta: Record<Kind, [string, string]> = {
    beer: [t.beer, t.beerSub],
    glass: [t.glass, t.glassSub],
    gear: [t.gear, t.gearSub],
  };

  return (
    <section className="border-b" style={{ borderColor: "var(--ink)" }}>
      <div
        className="kicker flex justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--ln)" }}
      >
        <span>{t.indexLabel}</span>
        <span>03 {t.sections}</span>
      </div>

      {(["beer", "glass", "gear"] as Kind[]).map((kind, i) => {
        const items = PRODUCTS.filter((p) => p.kind === kind);
        const isOpen = open === kind;
        const numColor = isOpen ? "var(--bg)" : "var(--mu)";

        return (
          <div key={kind} className="border-b" style={{ borderColor: "var(--ln)" }}>
            <button
              onClick={() => setOpen(isOpen ? null : kind)}
              className="grid w-full cursor-pointer grid-cols-[36px_1fr_auto] items-center gap-4 border-0 px-4 py-[18px] text-left transition-colors md:grid-cols-[60px_1.2fr_1.4fr_auto] md:py-[22px]"
              style={{
                background: isOpen ? "var(--tx)" : "transparent",
                color: isOpen ? "var(--bg)" : "var(--tx)",
              }}
            >
              <span className="mono text-xs" style={{ color: numColor }}>
                {pad(i + 1)}
              </span>
              <span className="display text-[38px] leading-[0.9] md:text-[56px]">
                {meta[kind][0]}
              </span>
              <span
                className="hidden text-[13px] md:block"
                style={{ color: numColor }}
              >
                {meta[kind][1]}
              </span>
              <span
                className="mono text-right text-xs"
                style={{ color: numColor }}
              >
                {pad(items.length)} SKU{" "}
                <span
                  className="inline-block transition-transform duration-200"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  ↓
                </span>
              </span>
            </button>

            {isOpen && (
              <div
                className="grid grid-cols-1 border-t md:grid-cols-5"
                style={{ borderColor: "var(--ln)" }}
              >
                {items.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/catalog?c=${kind}`}
                    className="row-link tint flex items-center gap-3 border-r border-b px-4 py-3 text-left transition-colors"
                    style={{ borderColor: "var(--ln)" }}
                  >
                    <Thumb
                      src={p.img}
                      alt=""
                      className="h-14 w-11"
                      sizes="44px"
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[13px] font-semibold">{p.name}</span>
                      <span className="mono text-[11px]" style={{ color: "var(--mu)" }}>
                        {p.kind === "beer"
                          ? `${p.abv}% · ${p.ibu ?? "—"} IBU`
                          : localized(p.style, lang).slice(0, 28)}
                      </span>
                    </div>
                  </Link>
                ))}
                <Link
                  href={`/catalog?c=${kind}`}
                  className="flex items-center justify-center gap-2 border-b px-4 py-3 text-xs font-bold uppercase tracking-[0.06em]"
                  style={{
                    borderColor: "var(--ln)",
                    background: "var(--ac)",
                    color: "var(--act)",
                  }}
                >
                  {t.seeAll} {pad(items.length)} →
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
