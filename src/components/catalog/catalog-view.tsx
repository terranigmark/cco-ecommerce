"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart, usePrefs } from "@/components/providers";
import { FilterPanel } from "@/components/catalog/filter-panel";
import { ProductCard } from "@/components/catalog/product-card";
import { QuickOrderTable } from "@/components/catalog/quick-order-table";
import { BREWERIES } from "@/lib/catalog";
import {
  EMPTY_FILTERS,
  countActiveFilters,
  filterProducts,
  money,
  pad,
} from "@/lib/products";
import type { Filters, Kind } from "@/lib/types";

const KINDS: Kind[] = ["beer", "glass", "gear"];

export function CatalogView() {
  const { t, lang, view, setView } = usePrefs();
  const { count, subtotal, openDrawer } = useCart();
  const router = useRouter();
  const params = useSearchParams();

  const kind = (KINDS.find((k) => k === params.get("c")) ?? "beer") as Kind;
  const search = params.get("q") ?? "";
  const brewParam = params.get("brew");

  const [filters, setFiltersState] = useState<Filters>(() =>
    brewParam ? { ...EMPTY_FILTERS, brew: [brewParam] } : EMPTY_FILTERS,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Skeleton dwell on load and whenever the result set is swapped wholesale.
  const bump = () => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 550);
  };

  useEffect(() => {
    timer.current = setTimeout(() => setLoading(false), 550);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const setFilters = (patch: Partial<Filters>) =>
    setFiltersState((f) => ({ ...f, ...patch }));

  const toggle = (key: keyof Filters, value: string) =>
    setFiltersState((f) => {
      const current = f[key] as string[];
      return {
        ...f,
        [key]: current.includes(value)
          ? current.filter((x) => x !== value)
          : [...current, value],
      };
    });

  const products = useMemo(
    () => filterProducts(kind, search, filters, lang),
    [kind, search, filters, lang],
  );

  const meta: Record<Kind, string> = {
    beer: t.beer,
    glass: t.glass,
    gear: t.gear,
  };

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`/catalog?${next.toString()}`, { scroll: false });
  };

  const ibuLabels: Record<string, string> = {
    low: t.ibuLow,
    mid: t.ibuMid,
    high: t.ibuHigh,
  };

  const chips =
    kind !== "beer"
      ? []
      : [
          ...filters.styles.map((v) => ({
            label: v,
            remove: () => toggle("styles", v),
          })),
          ...(filters.abv[0] > 3 || filters.abv[1] < 9
            ? [
                {
                  label: `ABV ${filters.abv[0]}–${filters.abv[1]}%`,
                  remove: () => setFilters({ abv: [3, 9] }),
                },
              ]
            : []),
          ...filters.ibu.map((v) => ({
            label: "IBU " + ibuLabels[v],
            remove: () => toggle("ibu", v),
          })),
          ...filters.brew.map((v) => ({
            label: BREWERIES.find((b) => b.id === v)?.name ?? v,
            remove: () => {
              toggle("brew", v);
              if (brewParam === v) setParam("brew", null);
            },
          })),
          ...filters.origin.map((v) => ({
            label: v,
            remove: () => toggle("origin", v),
          })),
          ...filters.fmt.map((v) => ({
            label: v === "can" ? t.can : t.keg,
            remove: () => toggle("fmt", v),
          })),
        ];

  const activeCount = countActiveFilters(filters, kind);
  const viewBtn = (active: boolean) => ({
    background: active ? "var(--tx)" : "transparent",
    color: active ? "var(--bg)" : "var(--tx)",
  });

  return (
    <main className="flex flex-1 flex-col">
      <div className="kicker flex justify-between px-4 pt-3">
        <span>
          {t.catalog} / {meta[kind]}
        </span>
        <span>{pad(products.length)} SKU</span>
      </div>
      <h1
        className="display m-0 border-b px-3 pt-1.5 pb-3.5 text-[clamp(52px,17vw,80px)] leading-[0.86] tracking-[-0.035em] md:text-[clamp(80px,11.7vw,190px)]"
        style={{ borderColor: "var(--ink)" }}
      >
        {meta[kind]}
      </h1>

      <div
        className="sticky top-14 z-[12] flex flex-wrap items-stretch border-b"
        style={{ background: "var(--sf)", borderColor: "var(--ink)" }}
      >
        <div className="flex">
          {KINDS.map((k) => (
            <button
              key={k}
              onClick={() => {
                setParam("c", k);
                setFiltersOpen(false);
                bump();
              }}
              className="h-11 cursor-pointer border-0 border-r px-4 text-xs font-bold uppercase tracking-[0.06em]"
              style={{ borderColor: "var(--ln)", ...viewBtn(kind === k) }}
            >
              {meta[k]}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div
          className="mono flex h-11 min-w-[120px] flex-1 items-center gap-2 border-l px-3 md:hidden"
          style={{ borderColor: "var(--ln)" }}
        >
          <span style={{ color: "var(--mu)" }}>⌕</span>
          <input
            value={search}
            onChange={(e) => setParam("q", e.target.value)}
            placeholder={t.searchShort}
            aria-label={t.searchShort}
            className="min-w-0 flex-1 border-0 bg-transparent text-xs outline-0"
          />
        </div>
        {kind === "beer" && (
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex h-11 cursor-pointer items-center gap-2 border-0 border-l px-3.5 text-xs font-bold uppercase tracking-[0.06em] md:hidden"
            style={{ borderColor: "var(--ln)" }}
          >
            {t.filters}
            {activeCount > 0 && (
              <span
                className="mono px-1.5 py-px"
                style={{ background: "var(--ac)", color: "var(--act)" }}
              >
                {activeCount}
              </span>
            )}
          </button>
        )}
        <div className="flex border-l" style={{ borderColor: "var(--ln)" }}>
          <button
            onClick={() => {
              setView("grid");
              bump();
            }}
            className="h-11 cursor-pointer border-0 px-3.5 text-xs font-bold uppercase tracking-[0.06em]"
            style={viewBtn(view === "grid")}
          >
            ▦ <span className="hidden md:inline">{t.gridView}</span>
          </button>
          <button
            onClick={() => {
              setView("table");
              bump();
            }}
            className="h-11 cursor-pointer border-0 border-l px-3.5 text-xs font-bold uppercase tracking-[0.06em]"
            style={{ borderColor: "var(--ln)", ...viewBtn(view === "table") }}
          >
            ☰ <span className="hidden md:inline">{t.tableView}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-start">
        {kind === "beer" && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            toggle={toggle}
            clear={() => setFiltersState(EMPTY_FILTERS)}
            resultCount={products.length}
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
          />
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className="mono flex min-h-[22px] flex-wrap items-center gap-2 border-b px-4 py-2.5 text-[11px]"
            style={{ borderColor: "var(--ln)" }}
          >
            <span style={{ color: "var(--mu)" }}>
              {pad(products.length)} {t.results}
            </span>
            {chips.map((c) => (
              <button
                key={c.label}
                onClick={c.remove}
                className="flex h-6 cursor-pointer items-center gap-1.5 bg-transparent px-2 text-[11px]"
                style={{ border: "1px solid var(--ink)" }}
              >
                {c.label}
                <span>×</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="border-r border-b"
                  style={{ borderColor: "var(--ln)" }}
                >
                  <div
                    className="h-[170px] md:h-[240px]"
                    style={{
                      background:
                        "linear-gradient(90deg,var(--sf) 25%,var(--sf2) 50%,var(--sf) 75%)",
                      backgroundSize: "200% 100%",
                      animation: "shimmer 1.4s infinite",
                    }}
                  />
                  <div className="flex flex-col gap-2 p-3">
                    <div className="h-2.5 w-2/5" style={{ background: "var(--sf2)" }} />
                    <div className="h-4 w-3/4" style={{ background: "var(--sf2)" }} />
                    <div className="h-2.5 w-[55%]" style={{ background: "var(--sf2)" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div
              className="mono px-4 py-16 text-center text-xs"
              style={{ color: "var(--mu)" }}
            >
              — {t.noResults} —
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
              {products.map((p, i) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={i}
                  formatId={selected[p.id] ?? p.formats[0].id}
                  onSelectFormat={(fid) =>
                    setSelected((s) => ({ ...s, [p.id]: fid }))
                  }
                />
              ))}
            </div>
          ) : (
            <>
              <QuickOrderTable
                products={products}
                selected={selected}
                onSelectFormat={(pid, fid) =>
                  setSelected((s) => ({ ...s, [pid]: fid }))
                }
              />
              {count > 0 && (
                <div
                  className="sticky bottom-[72px] mx-4 my-3 flex items-center justify-between gap-3 py-2.5 pr-3 pl-4 md:bottom-3"
                  style={{
                    border: "2px solid var(--ink)",
                    background: "var(--tx)",
                    color: "var(--bg)",
                    boxShadow: "5px 5px 0 var(--ac)",
                  }}
                >
                  <span className="mono text-xs">
                    {pad(count)} PZ · {money(subtotal)}
                  </span>
                  <button
                    onClick={openDrawer}
                    className="h-9 cursor-pointer px-3.5 text-xs font-bold uppercase tracking-[0.06em]"
                    style={{
                      border: "2px solid var(--act)",
                      background: "var(--ac)",
                      color: "var(--act)",
                    }}
                  >
                    {t.reviewOrder} →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
