"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import { usePrefs } from "@/components/providers";
import { money } from "@/lib/products";
import { orderStore } from "@/lib/stores";

export function ConfirmationView() {
  const { t } = usePrefs();
  const stored = useSyncExternalStore(
    orderStore.subscribe,
    orderStore.getSnapshot,
    orderStore.getServerSnapshot,
  );
  const orderId = useSearchParams().get("id") ?? stored?.id ?? "—";
  const order = stored?.id === orderId ? stored : null;

  const facts: [string, React.ReactNode][] = [
    [
      t.orderNo,
      <span key="id" className="mono text-[22px] font-semibold">
        {orderId}
      </span>,
    ],
    [
      t.payment,
      <span key="pay" className="font-bold">
        {order ? (order.pay === "cash" ? t.payCash : t.payTransfer) : "—"}
      </span>,
    ],
    [
      t.estTotal,
      <span key="total" className="display text-[28px]">
        {order ? money(order.subtotal) + (order.quoteShipping ? "+" : "") : "—"}
      </span>,
    ],
  ];

  return (
    <main className="flex flex-1 flex-col">
      <div className="kicker flex justify-between px-4 pt-3">
        <span>{t.orderNo}</span>
        <span>{orderId}</span>
      </div>
      <h1
        className="display m-0 border-b px-3 pt-1.5 pb-4 text-[clamp(52px,17vw,80px)] leading-[0.86] tracking-[-0.035em] md:text-[clamp(80px,11.7vw,190px)]"
        style={{ borderColor: "var(--ink)" }}
      >
        {t.confirmedL1}
        <br />
        <span
          style={{
            color: "var(--ac)",
            WebkitTextStroke: "2px var(--ink)",
            paintOrder: "stroke fill",
          }}
        >
          {t.confirmedL2}
        </span>
      </h1>

      <div
        className="grid grid-cols-1 border-b md:grid-cols-3"
        style={{ borderColor: "var(--ink)" }}
      >
        {facts.map(([label, value]) => (
          <div
            key={label}
            className="flex flex-col gap-1.5 border-r px-4 py-5"
            style={{ borderColor: "var(--ln)" }}
          >
            <span className="kicker">{label}</span>
            {value}
          </div>
        ))}
      </div>

      <div className="flex max-w-[600px] flex-col items-start gap-4 px-4 py-5">
        <p className="m-0 text-pretty" style={{ color: "var(--mu)" }}>
          {t.confirmedSub}
        </p>
        <Link href="/" className="btn-neo flex h-12 items-center px-[22px]">
          {t.backHome}
        </Link>
      </div>
    </main>
  );
}
