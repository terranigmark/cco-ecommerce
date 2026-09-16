"use client";

import { usePrefs } from "@/components/providers";
import { pad } from "@/lib/products";

export function Terms() {
  const { t } = usePrefs();

  return (
    <section
      className="grid grid-cols-1 border-b md:grid-cols-3"
      style={{ borderColor: "var(--ink)" }}
    >
      {t.terms.map(([title, body], i) => (
        <div
          key={title}
          className="flex flex-col gap-2.5 border-r border-b px-4 py-5"
          style={{ borderColor: "var(--ln)" }}
        >
          <span className="mono text-[10px] tracking-[0.1em]" style={{ color: "var(--mu)" }}>
            {pad(i + 1)}
          </span>
          <span className="display text-2xl leading-[0.95]">{title}</span>
          <span className="text-[13px] text-pretty" style={{ color: "var(--mu)" }}>
            {body}
          </span>
        </div>
      ))}
    </section>
  );
}
