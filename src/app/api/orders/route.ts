import { NextResponse } from "next/server";
import { PRODUCTS_BY_ID } from "@/lib/products";
import type { CartLine, OrderForm } from "@/lib/types";

// Order requests are not charged online: this endpoint drafts a request that
// sales confirms over WhatsApp. Swap the body of POST for the real backend call.
export async function POST(request: Request) {
  const body = (await request.json()) as {
    form?: Partial<OrderForm>;
    items?: CartLine[];
  };

  const form = body.form ?? {};
  const items = body.items ?? [];

  const missing = (["name", "phone", "street", "city", "zip"] as const).filter(
    (k) => !String(form[k] ?? "").trim(),
  );
  if (form.invoice) {
    if (!/^[A-ZÑ&0-9]{12,13}$/i.test(String(form.rfc ?? "").trim()))
      missing.push("rfc" as never);
    if (!String(form.razon ?? "").trim()) missing.push("razon" as never);
  }
  if (missing.length) {
    return NextResponse.json({ error: "invalid", fields: missing }, { status: 400 });
  }

  const lines = items
    .map((item) => {
      const product = PRODUCTS_BY_ID[item.pid];
      const format = product?.formats.find((f) => f.id === item.fid);
      if (!product || !format) return null;
      return {
        sku: `${item.pid}:${item.fid}`,
        name: product.name,
        qty: item.qty,
        pieces: item.qty * format.unit,
        total: item.qty * format.price,
      };
    })
    .filter((l) => l !== null);

  if (!lines.length) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  const id = "CCO-2026-" + String(1000 + Math.floor(Math.random() * 9000));
  return NextResponse.json({
    id,
    subtotal: lines.reduce((a, l) => a + l.total, 0),
    pieces: lines.reduce((a, l) => a + l.pieces, 0),
    lines,
  });
}
