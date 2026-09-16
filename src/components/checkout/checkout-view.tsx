"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, usePrefs } from "@/components/providers";
import { CFDI_USES, MX_STATES, REGIMENES } from "@/lib/catalog";
import { localized, money, pad } from "@/lib/products";
import { orderStore } from "@/lib/stores";
import type { CartLine, OrderForm } from "@/lib/types";

const EMPTY_FORM: OrderForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  state: "Ciudad de México",
  zip: "",
  notes: "",
  rfc: "",
  razon: "",
  regimen: "601",
  cfdi: "G01",
  ieps: false,
  pay: "transfer",
  invoice: true,
};

function validate(form: OrderForm): Record<string, true | "rfc"> {
  const errors: Record<string, true | "rfc"> = {};
  (["name", "phone", "street", "city", "zip"] as const).forEach((k) => {
    if (!form[k].trim()) errors[k] = true;
  });
  if (form.invoice) {
    if (!/^[A-ZÑ&0-9]{12,13}$/i.test(form.rfc.trim())) errors.rfc = "rfc";
    if (!form.razon.trim()) errors.razon = true;
  }
  return errors;
}

// The GitHub Pages build is a static export with no server, so it drafts the
// request number client-side; every other target posts to the orders endpoint.
async function requestOrder(form: OrderForm, items: CartLine[]): Promise<string> {
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "true") {
    return "CCO-2026-" + String(1000 + Math.floor(Math.random() * 9000));
  }
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form, items }),
  });
  if (!res.ok) throw new Error("order request failed");
  return (await res.json()).id as string;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  errorText,
  wide = false,
  mono = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: true | "rfc";
  errorText: string;
  wide?: boolean;
  mono?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1 ${wide ? "col-span-full" : ""}`}>
      <span
        className="mono text-[10px] uppercase tracking-[0.08em]"
        style={{ color: "var(--mu)" }}
      >
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`field ${error ? "field-error" : ""} ${mono ? "mono uppercase" : ""}`}
      />
      {error && (
        <span className="mono text-[10px]" style={{ color: "var(--warn)" }}>
          {errorText}
        </span>
      )}
    </label>
  );
}

export function CheckoutView() {
  const { t, lang } = usePrefs();
  const { lines, count, subtotal, moqs, items, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState<OrderForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const errors = submitted ? validate(form) : {};
  const quoteShipping = form.state !== "Ciudad de México";

  const set = <K extends keyof OrderForm>(key: K, value: OrderForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setSubmitted(true);
    setFailed(false);
    if (Object.keys(validate(form)).length) return;
    setSending(true);
    try {
      const id = await requestOrder(form, Object.values(items));
      orderStore.set({
        id,
        subtotal,
        pieces: count,
        pay: form.pay,
        quoteShipping,
      });
      clear();
      router.push(`/order?id=${id}`);
    } catch {
      setFailed(true);
      setSending(false);
    }
  };

  const fieldProps = (name: keyof OrderForm, label: string, placeholder: string) => ({
    label,
    placeholder,
    value: String(form[name]),
    onChange: (v: string) => set(name, v as never),
    error: errors[name],
    errorText: errors[name] === "rfc" ? t.rfcErr : t.required,
  });

  return (
    <main className="flex flex-1 flex-col">
      <div className="kicker flex justify-between px-4 pt-3">
        <Link href="/catalog">← {t.backToCatalog}</Link>
        <span>{t.draftNo} CCO-2026-DRAFT</span>
      </div>
      <h1 className="display m-0 px-3 pt-1.5 pb-2.5 text-[clamp(52px,17vw,80px)] leading-[0.86] tracking-[-0.035em] md:text-[clamp(80px,11.7vw,190px)]">
        {t.checkoutTitle}
      </h1>
      <p
        className="m-0 max-w-[640px] border-b px-4 pb-5 text-pretty"
        style={{ color: "var(--mu)", borderColor: "var(--ink)" }}
      >
        {t.checkoutSub}
      </p>

      <div className="grid grid-cols-1 items-start md:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <div className="flex flex-col border-r" style={{ borderColor: "var(--ln)" }}>
          <section
            className="flex flex-col gap-3.5 border-b px-4 py-5"
            style={{ borderColor: "var(--ln)" }}
          >
            <div className="flex items-baseline gap-3">
              <span className="mono text-[11px]" style={{ color: "var(--mu)" }}>
                01
              </span>
              <h2 className="display m-0 text-[26px] leading-none">{t.shipping}</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              <Field {...fieldProps("name", t.fName, "Ana López")} />
              <Field {...fieldProps("company", t.fCompany, "Bar La Terraza")} />
              <Field {...fieldProps("phone", t.fPhone, "55 1234 5678")} />
              <Field {...fieldProps("email", t.fEmail, "compras@bar.mx")} />
              <Field
                {...fieldProps("street", t.fStreet, "Av. Álvaro Obregón 120, Int. 3")}
                wide
              />
              <Field {...fieldProps("city", t.fCity, "Roma Norte, CDMX")} />
              <Field {...fieldProps("zip", t.fZip, "06700")} />
              <label className="flex flex-col gap-1">
                <span
                  className="mono text-[10px] uppercase tracking-[0.08em]"
                  style={{ color: "var(--mu)" }}
                >
                  {t.state}
                </span>
                <select
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  className="field px-2.5"
                >
                  {MX_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div
              className="mono px-3 py-2.5 text-[11px] leading-[1.5]"
              style={{ border: "1px dashed var(--bd)" }}
            >
              {t.shipFree}
            </div>
          </section>

          <section
            className="flex flex-col gap-3.5 border-b px-4 py-5"
            style={{ borderColor: "var(--ln)" }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="mono text-[11px]" style={{ color: "var(--mu)" }}>
                  02
                </span>
                <h2 className="display m-0 text-[26px] leading-none">{t.billing}</h2>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold">
                <input
                  type="checkbox"
                  checked={form.invoice}
                  onChange={(e) => set("invoice", e.target.checked)}
                />
                {t.needInvoice}
              </label>
            </div>
            {form.invoice && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                <Field {...fieldProps("rfc", t.fRfc, "XAXX010101000")} mono />
                <Field
                  {...fieldProps("razon", t.fRazon, "La Terraza Cervecera S.A. de C.V.")}
                />
                <label className="flex flex-col gap-1">
                  <span
                    className="mono text-[10px] uppercase tracking-[0.08em]"
                    style={{ color: "var(--mu)" }}
                  >
                    {t.regimen}
                  </span>
                  <select
                    value={form.regimen}
                    onChange={(e) => set("regimen", e.target.value)}
                    className="field px-2.5"
                  >
                    {REGIMENES.map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span
                    className="mono text-[10px] uppercase tracking-[0.08em]"
                    style={{ color: "var(--mu)" }}
                  >
                    {t.cfdi}
                  </span>
                  <select
                    value={form.cfdi}
                    onChange={(e) => set("cfdi", e.target.value)}
                    className="field px-2.5"
                  >
                    {CFDI_USES.map(([id, label]) => (
                      <option key={id} value={id}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label
                  className="col-span-full flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-[13px]"
                  style={{ border: "1px solid var(--bd)" }}
                >
                  <input
                    type="checkbox"
                    checked={form.ieps}
                    onChange={(e) => set("ieps", e.target.checked)}
                  />
                  <span>{t.iepsBreakdown}</span>
                </label>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3.5 px-4 py-5">
            <div className="flex items-baseline gap-3">
              <span className="mono text-[11px]" style={{ color: "var(--mu)" }}>
                03
              </span>
              <h2 className="display m-0 text-[26px] leading-none">{t.payment}</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
              {(
                [
                  ["transfer", t.payTransfer, t.payTransferSub],
                  ["cash", t.payCash, t.payCashSub],
                ] as const
              ).map(([id, label, sub]) => {
                const on = form.pay === id;
                return (
                  <button
                    key={id}
                    onClick={() => set("pay", id)}
                    className="flex cursor-pointer items-start gap-3 p-3.5 text-left"
                    style={{
                      border: `2px solid ${on ? "var(--ink)" : "var(--bd)"}`,
                      background: on ? "var(--sf)" : "transparent",
                      boxShadow: on ? "4px 4px 0 var(--ac)" : "none",
                    }}
                  >
                    <span
                      className="mt-0.5 grid h-4 w-4 flex-none place-items-center"
                      style={{ border: "2px solid var(--ink)" }}
                    >
                      <span
                        className="h-2 w-2"
                        style={{ background: on ? "var(--ink)" : "transparent" }}
                      />
                    </span>
                    <span className="flex flex-col gap-[3px]">
                      <span className="text-[13px] font-bold uppercase tracking-[0.04em]">
                        {label}
                      </span>
                      <span className="text-xs text-pretty" style={{ color: "var(--mu)" }}>
                        {sub}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <label className="flex flex-col gap-1">
              <span
                className="mono text-[10px] uppercase tracking-[0.08em]"
                style={{ color: "var(--mu)" }}
              >
                {t.notes}
              </span>
              <textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={3}
                placeholder={t.notesPh}
                className="field h-auto resize-y px-3 py-2.5"
              />
            </label>
          </section>
        </div>

        <aside
          className="flex flex-col border-b md:sticky md:top-14"
          style={{ background: "var(--sf)", borderColor: "var(--ln)" }}
        >
          <div
            className="mono flex justify-between px-4 py-3.5 text-[10px] uppercase tracking-[0.1em]"
            style={{ borderBottom: "1px dashed var(--bd)" }}
          >
            <span>{t.summary}</span>
            <span>
              {lines.length} {t.linesWord} · {pad(count)} PZ
            </span>
          </div>
          <div className="mono flex max-h-[300px] flex-col overflow-auto text-xs">
            {lines.map((l) => (
              <div
                key={l.key}
                className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-4 py-2.5"
                style={{ borderBottom: "1px dashed var(--bd)" }}
              >
                <span className="font-semibold">{l.product.name}</span>
                <span className="text-right">{money(l.total)}</span>
                <span className="col-span-full text-[11px]" style={{ color: "var(--mu)" }}>
                  {l.qty} × {localized(l.format.label, lang)} @ {money(l.format.price)}
                </span>
              </div>
            ))}
          </div>
          <div className="mono flex flex-col gap-2 px-4 py-3.5 text-xs">
            <div className="flex justify-between">
              <span style={{ color: "var(--mu)" }}>{t.subtotal}</span>
              <span>{money(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--mu)" }}>{t.shippingCost}</span>
              <span>{quoteShipping ? t.shipQuote : t.shipFreeLabel}</span>
            </div>
            <div className="text-[10px]" style={{ color: "var(--mu)" }}>
              {t.taxNote}
            </div>
            <div
              className="flex items-baseline justify-between pt-2.5"
              style={{ borderTop: "2px solid var(--ink)" }}
            >
              <span className="font-semibold uppercase tracking-[0.08em]">
                {t.estTotal}
              </span>
              <span className="display text-[28px] tracking-[-0.01em]">
                {money(subtotal)}
                {quoteShipping ? "+" : ""}
              </span>
            </div>
          </div>
          {moqs
            .filter((m) => !m.ok)
            .map((m) => (
              <div
                key={m.title}
                className="mono mx-4 mb-3 px-3 py-2.5 text-[11px]"
                style={{ border: "1.5px solid var(--warn)", color: "var(--warn)" }}
              >
                ⚠ {m.msg}
              </div>
            ))}
          <div className="flex flex-col gap-2.5 px-4 pb-4">
            <button
              onClick={submit}
              disabled={sending || lines.length === 0}
              className="btn-neo h-[54px] text-sm tracking-[0.08em] disabled:opacity-60"
            >
              {sending ? t.submitting : `${t.submitOrder} →`}
            </button>
            {failed && (
              <p className="mono m-0 text-[11px]" style={{ color: "var(--warn)" }}>
                {t.submitError}
              </p>
            )}
            <p
              className="mono m-0 text-[11px] leading-[1.5] text-pretty"
              style={{ color: "var(--mu)" }}
            >
              {t.submitNote}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
