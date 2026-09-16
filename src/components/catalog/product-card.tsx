"use client";

import Image from "next/image";
import { useCart, usePrefs } from "@/components/providers";
import { Stepper } from "@/components/ui/stepper";
import { localized, money, pad, sku } from "@/lib/products";
import { asset } from "@/lib/asset";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  index,
  formatId,
  onSelectFormat,
}: {
  product: Product;
  index: number;
  formatId: string;
  onSelectFormat: (id: string) => void;
}) {
  const { t, lang } = usePrefs();
  const { qtyOf, setQty, openDrawer } = useCart();

  const format =
    product.formats.find((f) => f.id === formatId) ?? product.formats[0];
  const qty = qtyOf(product.id, format.id);

  const tagLabel =
    product.kind !== "beer"
      ? ""
      : product.tag === "temporada"
        ? t.tagTemp
        : product.tag === "limitada"
          ? t.tagLim
          : "";

  const badges =
    product.kind === "beer"
      ? [`ABV ${product.abv}%`, ...(product.ibu ? [`IBU ${product.ibu}`] : [])]
      : product.kind === "glass"
        ? [
            (product.style as string).split(" · ")[0].toUpperCase(),
            (lang === "es" ? "CAJA " : "BOX ") + product.box,
          ]
        : [];

  const perUnit =
    format.unit > 1
      ? `${money(format.price / format.unit)} ${product.kind === "beer" ? t.perCan : t.perPiece}`
      : product.kind === "beer"
        ? format.id.startsWith("keg")
          ? "PET 20 L"
          : "355 ML"
        : "";

  return (
    <article
      className="row-link group flex flex-col border-r border-b transition-colors hover:[background:var(--sf)]"
      style={{ borderColor: "var(--ln)" }}
    >
      <div
        className="relative flex h-[170px] items-end justify-center overflow-hidden border-b md:h-[240px]"
        style={{ background: "var(--img)", borderColor: "var(--ln)" }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-[22%]"
          style={{ background: "var(--sf2)" }}
        />
        {product.img ? (
          <div className="absolute inset-x-[15%] top-[6%] bottom-[18%]">
            <Image
              src={asset(product.img)}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 45vw, 240px"
              className="object-contain object-bottom transition-transform duration-[250ms] group-hover:-translate-y-1"
              style={{ filter: "drop-shadow(-18px 8px 0 rgba(0,0,0,.5))" }}
            />
          </div>
        ) : (
          <div
            className="hatch mono relative mb-[10%] grid h-[64%] w-11 place-items-center text-center text-[9px]"
            style={{ border: "1px dashed var(--bd)", color: "var(--mu)" }}
          >
            label
            <br />
            art
          </div>
        )}
        <span
          className="mono absolute top-2 left-2 text-[10px] tracking-[0.06em]"
          style={{ color: "var(--mu)" }}
        >
          {pad(index + 1)} · {sku(product, format)}
        </span>
        {tagLabel && (
          <span
            className="mono absolute top-2 right-2 rotate-[3deg] px-1.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.06em]"
            style={{
              border: "1.5px solid var(--ink)",
              background: product.tag === "limitada" ? "var(--tx)" : "var(--ac)",
              color: product.tag === "limitada" ? "var(--bg)" : "var(--act)",
            }}
          >
            {tagLabel}
          </span>
        )}
        {product.award && (
          <span
            className="mono absolute bottom-2 left-2 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.06em]"
            style={{ border: "1px solid var(--ink)", background: "var(--bg)" }}
          >
            ★ {product.award}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex flex-col gap-0.5">
          <span
            className="mono text-[10px] uppercase tracking-[0.08em]"
            style={{ color: "var(--mu)" }}
          >
            {product.breweryName}
          </span>
          <span className="display text-xl leading-[0.95] tracking-[-0.01em] md:text-2xl">
            {product.name}
          </span>
          <span className="text-xs" style={{ color: "var(--mu)" }}>
            {localized(product.style, lang)}
          </span>
        </div>

        {badges.length > 0 && (
          <div className="mono flex flex-wrap text-[11px]">
            {badges.map((b) => (
              <span
                key={b}
                className="-mr-px -mb-px px-2 py-0.5"
                style={{ border: "1px solid var(--bd)" }}
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <p
          className="m-0 hidden text-xs text-pretty md:line-clamp-2"
          style={{ color: "var(--mu)" }}
        >
          {localized(product.desc, lang)}
        </p>

        <div className="mt-auto flex flex-wrap">
          {product.formats.map((f) => {
            const on = f.id === format.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFormat(f.id)}
                className="mono -mr-px h-[26px] cursor-pointer px-2 text-[11px]"
                style={{
                  border: `1px solid ${on ? "var(--tx)" : "var(--bd)"}`,
                  background: on ? "var(--tx)" : "transparent",
                  color: on ? "var(--bg)" : "var(--tx)",
                }}
              >
                {localized(f.short, lang)}
              </button>
            );
          })}
        </div>

        <div
          className="flex items-end justify-between gap-2 pt-2.5"
          style={{ borderTop: "1px dashed var(--bd)" }}
        >
          <div className="flex flex-col">
            <span className="mono text-[15px] font-semibold">
              {money(format.price)}
            </span>
            <span className="mono text-[10px]" style={{ color: "var(--mu)" }}>
              {perUnit}
            </span>
          </div>
          {qty === 0 ? (
            <button
              onClick={() => {
                setQty(product, format, 1);
                openDrawer();
              }}
              className="btn-neo btn-neo-sm h-[34px] px-3 text-xs"
            >
              {t.add}
            </button>
          ) : (
            <Stepper
              qty={qty}
              accentPlus
              onInc={() => setQty(product, format, qty + 1)}
              onDec={() => setQty(product, format, qty - 1)}
            />
          )}
        </div>
      </div>
    </article>
  );
}
