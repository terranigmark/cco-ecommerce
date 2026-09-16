"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, usePrefs } from "@/components/providers";
import { Stepper } from "@/components/ui/stepper";
import { Thumb } from "@/components/ui/thumb";
import { localized, money, pad } from "@/lib/products";

export function CartDrawer() {
  const { t, lang } = usePrefs();
  const { lines, count, subtotal, moqs, setQty, drawerOpen, closeDrawer } =
    useCart();
  const router = useRouter();

  return (
    <>
      <div
        onClick={closeDrawer}
        className="fixed inset-0 z-30 transition-opacity duration-[250ms]"
        style={{
          background: "rgba(8,8,10,.6)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
        }}
      />
      <aside
        aria-label={t.yourOrder}
        className="fixed top-0 right-0 bottom-0 z-[31] flex w-full max-w-full flex-col md:w-[440px]"
        style={{
          background: "var(--bg)",
          borderLeft: "2px solid var(--ink)",
          transform: drawerOpen ? "translateX(0)" : "translateX(105%)",
          transition: "transform .32s cubic-bezier(.2,.8,.2,1)",
        }}
      >
        <div
          className="flex items-stretch justify-between border-b"
          style={{ borderColor: "var(--ink)" }}
        >
          <div className="flex flex-col px-4 py-3.5">
            <span className="display text-[30px] leading-[0.9]">
              {t.yourOrder}
            </span>
            <span
              className="mono mt-1.5 text-[10px] uppercase tracking-[0.08em]"
              style={{ color: "var(--mu)" }}
            >
              {pad(count)} PZ · {lines.length} {t.linesWord} · BATCH 2026
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="w-14 cursor-pointer border-0 border-l bg-transparent text-[22px] leading-none"
            style={{ borderColor: "var(--ink)" }}
            aria-label="×"
          >
            ×
          </button>
        </div>

        {moqs.map((m) => (
          <div
            key={m.title}
            className="mono flex flex-col gap-2 border-b px-4 py-3"
            style={{ borderColor: "var(--ink)", background: "var(--sf)" }}
          >
            <div className="flex justify-between gap-2 text-[10px] uppercase tracking-[0.08em]">
              <span>{m.title}</span>
              <span style={{ color: m.color }}>
                {m.count}/{m.min}
              </span>
            </div>
            <div
              className="relative h-2.5"
              style={{
                border: "1px solid var(--ink)",
                background:
                  "repeating-linear-gradient(90deg,transparent 0 calc(100% / 24 - 1px),var(--ln) calc(100% / 24 - 1px) calc(100% / 24))",
              }}
            >
              <div
                className="absolute top-0 bottom-0 left-0 transition-[width] duration-300"
                style={{ width: m.pct, background: m.color }}
              />
            </div>
            <span className="text-[11px]" style={{ color: m.color }}>
              {m.msg}
            </span>
          </div>
        ))}

        <div className="flex flex-1 flex-col overflow-auto">
          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-start justify-center gap-3 px-4 py-8">
              <span
                className="display text-[40px] leading-[0.9]"
                style={{ color: "var(--mu)" }}
              >
                {t.emptyTitle}
              </span>
              <span className="text-[13px] text-pretty" style={{ color: "var(--mu)" }}>
                {t.emptySub}
              </span>
              <Link
                href="/catalog"
                onClick={closeDrawer}
                className="btn-ghost flex h-11 items-center px-[18px]"
              >
                {t.viewCatalog} →
              </Link>
            </div>
          ) : (
            lines.map((l) => (
              <div
                key={l.key}
                className="grid grid-cols-[auto_1fr_auto] gap-3 px-4 py-3"
                style={{ borderBottom: "1px dashed var(--bd)" }}
              >
                <Thumb
                  src={l.product.img}
                  alt=""
                  className="h-16 w-12"
                  sizes="48px"
                  shadow
                />
                <div className="flex min-w-0 flex-col gap-[3px]">
                  <span
                    className="mono text-[10px] uppercase tracking-[0.08em]"
                    style={{ color: "var(--mu)" }}
                  >
                    {l.product.breweryName}
                  </span>
                  <span className="text-[15px] leading-[1.1] font-bold">
                    {l.product.name}
                  </span>
                  <span className="mono text-[11px]" style={{ color: "var(--mu)" }}>
                    {localized(l.format.label, lang)} @ {money(l.format.price)}
                  </span>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <Stepper
                      size="sm"
                      qty={l.qty}
                      onInc={() => setQty(l.product, l.format, l.qty + 1)}
                      onDec={() => setQty(l.product, l.format, l.qty - 1)}
                    />
                    <button
                      onClick={() => setQty(l.product, l.format, 0)}
                      className="mono cursor-pointer border-0 bg-transparent p-0 text-[10px] uppercase tracking-[0.08em] underline"
                      style={{ color: "var(--mu)" }}
                    >
                      {t.remove}
                    </button>
                  </div>
                </div>
                <span className="mono text-sm font-semibold whitespace-nowrap">
                  {money(l.total)}
                </span>
              </div>
            ))
          )}
        </div>

        {lines.length > 0 && (
          <div
            className="flex flex-col gap-2.5 px-4 py-3.5"
            style={{ borderTop: "2px solid var(--ink)", background: "var(--sf)" }}
          >
            <div className="mono flex items-baseline justify-between">
              <span
                className="text-[10px] uppercase tracking-[0.08em]"
                style={{ color: "var(--mu)" }}
              >
                {t.subtotal}
              </span>
              <span className="display text-[30px] tracking-[-0.01em]">
                {money(subtotal)}
              </span>
            </div>
            <span
              className="mono text-[10px] leading-[1.5]"
              style={{ color: "var(--mu)" }}
            >
              {t.drawerNote}
            </span>
            <button
              onClick={() => {
                closeDrawer();
                router.push("/checkout");
              }}
              className="btn-neo h-[52px] text-sm tracking-[0.08em]"
            >
              {t.reviewDraft} →
            </button>
            <button
              onClick={closeDrawer}
              className="mono h-9 cursor-pointer border-0 bg-transparent text-[10px] uppercase tracking-[0.08em] underline"
              style={{ color: "var(--mu)" }}
            >
              {t.continueShopping}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
