"use client";

import Image from "next/image";
import Link from "next/link";
import { usePrefs } from "@/components/providers";
import { asset } from "@/lib/asset";

const CANS = [
  { src: "/assets/beer-bohemian.png", w: 174, h: 349, cls: "h-[170px] md:h-[230px]", shadow: "-34px 14px" },
  { src: "/assets/beer-73-millas.png", w: 156, h: 285, cls: "h-[215px] md:h-[290px]", shadow: "-40px 16px" },
  { src: "/assets/beer-rough.png", w: 163, h: 299, cls: "h-[170px] md:h-[230px]", shadow: "-34px 14px" },
];

export function Hero() {
  const { t } = usePrefs();

  return (
    <section
      className="relative overflow-hidden border-b bg-[length:48px_48px] md:bg-[length:80px_80px]"
      style={{
        borderColor: "var(--ink)",
        backgroundImage:
          "linear-gradient(var(--ln) 1px, transparent 1px), linear-gradient(90deg, var(--ln) 1px, transparent 1px)",
      }}
    >
      <div className="kicker flex justify-between px-4 pt-3.5">
        <span>{t.heroKicker}</span>
        <span>BATCH 2026 · LOTE 01</span>
      </div>

      <h1
        className="display relative z-[2] m-0 px-3 pt-1.5 text-[clamp(56px,20vw,92px)] leading-[0.86] tracking-[-0.035em] text-balance md:pt-2.5 md:text-[clamp(92px,18.4vw,300px)]"
      >
        {t.heroL1}
        <br />
        {t.heroL2}
        <br />
        <span
          style={{
            color: "var(--ac)",
            WebkitTextStroke: "2px var(--ink)",
            paintOrder: "stroke fill",
          }}
        >
          {t.heroL3}
        </span>
      </h1>

      <div className="grid grid-cols-1 items-end gap-4 px-4 md:grid-cols-2">
        <div className="relative z-[2] flex flex-col gap-[18px] pt-4 pb-8">
          <p className="m-0 max-w-[420px] text-[15px] leading-[1.5] text-pretty">
            {t.heroSub}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog?c=beer"
              className="btn-neo flex h-12 items-center px-[22px]"
            >
              {t.shopSeasonal} →
            </Link>
            <Link
              href="/catalog"
              className="btn-ghost flex h-12 items-center px-[22px]"
            >
              {t.viewCatalog}
            </Link>
          </div>
          <div
            className="mono flex flex-wrap gap-6 text-[11px] uppercase tracking-[0.04em]"
            style={{ color: "var(--mu)" }}
          >
            <span>MOQ 24 PZ</span>
            <span>CDMX $0 ENVÍO</span>
            <span>PAGO C/ENTREGA</span>
          </div>
        </div>

        <div className="relative flex h-[300px] items-end justify-center gap-1 md:h-[380px] md:gap-3.5">
          <div
            className="absolute -inset-x-4 bottom-0 h-[38%] border-t"
            style={{ background: "var(--sf2)", borderColor: "var(--ink)" }}
          />
          {CANS.map((can) => (
            <Image
              key={can.src}
              src={asset(can.src)}
              alt=""
              width={can.w}
              height={can.h}
              priority
              className={`relative mb-[26px] w-auto ${can.cls}`}
              style={{
                filter: `drop-shadow(${can.shadow} 0 rgba(0,0,0,.55))`,
              }}
            />
          ))}
          <div
            className="mono absolute top-2 right-0 rotate-[-8deg] px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] opacity-85"
            style={{ border: "2px solid var(--ink)" }}
          >
            Cadena fría
            <br />
            2–4 °C
          </div>
        </div>
      </div>

      <div
        className="mono flex items-center justify-between border-t px-4 py-2 text-[10px] uppercase tracking-[0.08em]"
        style={{
          borderColor: "var(--ink)",
          background: "var(--sf)",
          color: "var(--mu)",
        }}
      >
        <span>N° CAT 2026-CCO-0211</span>
        <span className="barcode" />
        <span>ENSENADA — NAVOJOA — CDMX</span>
      </div>
    </section>
  );
}
