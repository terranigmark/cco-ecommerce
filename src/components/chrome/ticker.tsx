"use client";

import { usePrefs } from "@/components/providers";

export function Ticker() {
  const { t } = usePrefs();
  return (
    <div
      className="mono flex h-7 items-center overflow-hidden border-b text-[11px] uppercase tracking-[0.06em]"
      style={{
        background: "var(--ac)",
        color: "var(--act)",
        borderColor: "var(--ink)",
      }}
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        <span className="px-6">{t.ticker}</span>
        <span className="px-6">{t.ticker}</span>
      </div>
    </div>
  );
}
