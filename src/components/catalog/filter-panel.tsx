"use client";

import { usePrefs } from "@/components/providers";
import { BREWERIES } from "@/lib/catalog";
import { BEER_PRODUCTS, styleGroup } from "@/lib/products";
import { STYLE_GROUPS } from "@/lib/catalog";
import type { Filters } from "@/lib/types";

type Props = {
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  toggle: (key: keyof Filters, value: string) => void;
  clear: () => void;
  resultCount: number;
  open: boolean;
  onClose: () => void;
};

function Check({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2.5 text-[13px]">
      <span className="flex items-center gap-2.5">
        <input type="checkbox" checked={checked} onChange={onChange} />
        {label}
      </span>
      {count !== undefined && (
        <span className="mono text-[11px]" style={{ color: "var(--mu)" }}>
          {count}
        </span>
      )}
    </label>
  );
}

function Section({
  num,
  title,
  children,
  last = false,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2 px-4 py-3.5 ${last ? "" : "border-b"}`}
      style={{ borderColor: "var(--ln)" }}
    >
      <span className="kicker">
        {num} · {title}
      </span>
      {children}
    </div>
  );
}

export function FilterPanel({
  filters,
  setFilters,
  toggle,
  clear,
  resultCount,
  open,
  onClose,
}: Props) {
  const { t } = usePrefs();

  const origins = [...new Set(BEER_PRODUCTS.map((b) => b.origin))];
  const ibuOpts: [string, string][] = [
    ["low", t.ibuLow],
    ["mid", t.ibuMid],
    ["high", t.ibuHigh],
  ];

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-[25] md:hidden"
          style={{ background: "rgba(8,8,10,.55)" }}
        />
      )}
      <aside
        className={`flex-col bg-[color:var(--bg)] ${
          open
            ? "fixed inset-x-0 bottom-0 z-[26] flex max-h-[85%] overflow-auto md:static"
            : "hidden md:flex"
        } md:sticky md:top-25 md:max-h-[calc(100vh-100px)] md:w-[250px] md:flex-none md:overflow-auto md:border-r`}
        style={{
          borderColor: "var(--ln)",
          borderTop: open ? "2px solid var(--ink)" : undefined,
        }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-3.5"
          style={{ borderColor: "var(--ln)" }}
        >
          <span className="mono text-[10px] uppercase tracking-[0.1em]">
            {t.filters}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={clear}
              className="mono cursor-pointer border-0 bg-transparent p-0 text-[10px] uppercase tracking-[0.1em] underline"
              style={{ color: "var(--mu)" }}
            >
              {t.clear}
            </button>
            <button
              onClick={onClose}
              className="h-7 w-7 cursor-pointer bg-transparent text-sm leading-none md:hidden"
              style={{ border: "1px solid var(--ink)" }}
              aria-label="×"
            >
              ×
            </button>
          </div>
        </div>

        <Section num="01" title={t.style}>
          {Object.keys(STYLE_GROUPS).map((g) => (
            <Check
              key={g}
              label={g}
              count={BEER_PRODUCTS.filter((b) => styleGroup(b.style as string) === g).length}
              checked={filters.styles.includes(g)}
              onChange={() => toggle("styles", g)}
            />
          ))}
        </Section>

        <div
          className="flex flex-col gap-2 border-b px-4 py-3.5"
          style={{ borderColor: "var(--ln)" }}
        >
          <div className="mono flex justify-between">
            <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--mu)" }}>
              02 · ABV
            </span>
            <span className="text-xs font-semibold">
              {filters.abv[0]}% — {filters.abv[1]}%
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={9}
            step={0.1}
            value={filters.abv[0]}
            aria-label="ABV min"
            onChange={(e) =>
              setFilters({
                abv: [Math.min(+e.target.value, filters.abv[1]), filters.abv[1]],
              })
            }
            className="w-full"
          />
          <input
            type="range"
            min={3}
            max={9}
            step={0.1}
            value={filters.abv[1]}
            aria-label="ABV max"
            onChange={(e) =>
              setFilters({
                abv: [filters.abv[0], Math.max(+e.target.value, filters.abv[0])],
              })
            }
            className="w-full"
          />
        </div>

        <Section num="03" title="IBU">
          <div className="flex flex-wrap gap-1.5">
            {ibuOpts.map(([id, label]) => {
              const on = filters.ibu.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => toggle("ibu", id)}
                  className="mono h-7 cursor-pointer px-2.5 text-[11px]"
                  style={{
                    border: `1px solid ${on ? "var(--tx)" : "var(--bd)"}`,
                    background: on ? "var(--tx)" : "transparent",
                    color: on ? "var(--bg)" : "var(--tx)",
                  }}
                >
                  IBU {label}
                </button>
              );
            })}
          </div>
        </Section>

        <Section num="04" title={t.brewery}>
          {BREWERIES.map((b) => (
            <Check
              key={b.id}
              label={b.name}
              count={BEER_PRODUCTS.filter((x) => x.brewery === b.id).length}
              checked={filters.brew.includes(b.id)}
              onChange={() => toggle("brew", b.id)}
            />
          ))}
        </Section>

        <Section num="05" title={t.origin}>
          {origins.map((o) => (
            <Check
              key={o}
              label={o}
              checked={filters.origin.includes(o)}
              onChange={() => toggle("origin", o)}
            />
          ))}
        </Section>

        <Section num="06" title={t.format} last>
          {[
            ["can", t.can],
            ["keg", t.keg],
          ].map(([id, label]) => (
            <Check
              key={id}
              label={label}
              checked={filters.fmt.includes(id)}
              onChange={() => toggle("fmt", id)}
            />
          ))}
        </Section>

        <div className="px-4 py-3.5 md:hidden">
          <button onClick={onClose} className="btn-neo h-12 w-full">
            {t.showResults} ({resultCount})
          </button>
        </div>
      </aside>
    </>
  );
}
