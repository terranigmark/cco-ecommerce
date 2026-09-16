"use client";

import Image from "next/image";
import Link from "next/link";
import { usePrefs } from "@/components/providers";
import { BREWERIES, BREWERY_COORDS } from "@/lib/catalog";
import { BEER_PRODUCTS, pad } from "@/lib/products";
import { asset } from "@/lib/asset";

const TINTS = [
  "linear-gradient(180deg,rgba(10,10,12,.55),rgba(10,10,12,.9))",
  "linear-gradient(180deg,rgba(40,30,8,.6),rgba(10,10,12,.92))",
];

const LOGO_SIZE: Record<string, { w: number; h: number }> = {
  cardera: { w: 68, h: 44 },
  "308": { w: 44, h: 44 },
};

export function BreweryPanels() {
  const { t } = usePrefs();

  return (
    <section
      className="grid grid-cols-1 border-b md:grid-cols-2"
      style={{ borderColor: "var(--ink)" }}
    >
      {BREWERIES.map((b, i) => (
        <Link
          key={b.id}
          href={`/catalog?c=beer&brew=${b.id}`}
          className="row-link relative flex min-h-[300px] flex-col justify-between gap-6 overflow-hidden border-r border-b px-4 py-5 text-left md:min-h-[360px]"
          style={{
            borderColor: "var(--ln)",
            background: `#101113 url(${asset("/assets/tex-concrete.png")}) center/cover`,
            color: "#efeae0",
          }}
        >
          <div className="absolute inset-0" style={{ background: TINTS[i % 2] }} />
          <div
            className="mono relative flex justify-between text-[10px] uppercase tracking-[0.1em]"
            style={{ color: "#c9c4b6" }}
          >
            <span>
              {pad(i + 1)} · {t.breweryWord}
            </span>
            <span>{BREWERY_COORDS[b.id]}</span>
          </div>
          <div className="relative flex flex-col gap-2">
            <Image
              src={asset(b.logoLight)}
              alt={b.name}
              width={LOGO_SIZE[b.id].w}
              height={LOGO_SIZE[b.id].h}
              className="h-11 w-auto self-start object-contain"
            />
            <span className="display text-[48px] leading-[0.9] tracking-[-0.03em] md:text-[72px]">
              {b.name}
            </span>
            <span className="text-[13px]" style={{ color: "#c9c4b6" }}>
              {b.origin} — {BEER_PRODUCTS.filter((x) => x.brewery === b.id).length}{" "}
              {t.beersWord}
            </span>
          </div>
          <span
            className="absolute right-4 bottom-[18px] grid h-13 w-13 place-items-center rounded-full text-xl"
            style={{ border: "2px solid #efeae0" }}
          >
            →
          </span>
        </Link>
      ))}
    </section>
  );
}
