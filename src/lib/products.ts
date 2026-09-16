import {
  BEERS,
  BREWERIES,
  GEAR,
  GLASS,
  STYLE_GROUPS,
} from "./catalog";
import type {
  Filters,
  Kind,
  Lang,
  Localized,
  Product,
  ProductFormat,
} from "./types";

export function localized(v: string | Localized, lang: Lang): string {
  return typeof v === "string" ? v : (v[lang] ?? v.es);
}

export function money(n: number): string {
  const [int, dec] = n.toFixed(2).split(".");
  return "$" + int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + dec;
}

export function pad(n: number | string): string {
  return String(n).padStart(2, "0");
}

export function ibuLevel(ibu: number): "low" | "mid" | "high" {
  return ibu < 20 ? "low" : ibu <= 40 ? "mid" : "high";
}

export function styleGroup(style: string): string {
  return (
    Object.keys(STYLE_GROUPS).find((k) => STYLE_GROUPS[k].includes(style)) ||
    "Other"
  );
}

export function sku(product: Product, format: ProductFormat): string {
  const prefix = (product.brewery || product.kind).slice(0, 3);
  const body = product.id.replace(/[^a-z0-9]/gi, "").slice(-5);
  return `${prefix}-${body}-${format.id}`.toUpperCase();
}

function beerFormats(
  formats: { id: string; label: string; price: number; unit: number }[],
): ProductFormat[] {
  return formats.map((f) => ({
    id: f.id,
    price: f.price,
    unit: f.unit,
    label: {
      es: f.label,
      en: f.label
        .replace("Lata sleek", "Sleek can")
        .replace("Lata", "Can")
        .replace("Barril PET", "PET keg"),
    },
    short: f.id.startsWith("keg")
      ? { es: "BARRIL 20L", en: "KEG 20L" }
      : f.unit > 1
        ? { es: `LATA ×${f.unit}`, en: `CAN ×${f.unit}` }
        : { es: "LATA 355", en: "CAN 355" },
  }));
}

function build(): Product[] {
  const byId = Object.fromEntries(BREWERIES.map((b) => [b.id, b]));

  const beer: Product[] = BEERS.map((b) => ({
    id: b.id,
    kind: "beer",
    name: b.name,
    brewery: b.brewery,
    breweryName: byId[b.brewery].name,
    origin: byId[b.brewery].origin,
    style: b.style,
    desc: b.desc,
    img: b.img,
    abv: b.abv,
    ibu: b.ibu,
    tag: b.tag,
    award: b.award,
    formats: beerFormats(b.formats),
  }));

  const glass: Product[] = GLASS.map((g) => ({
    id: g.id,
    kind: "glass",
    name: g.name,
    breweryName: "CCO Cristalería",
    origin: "CDMX",
    style: `${g.ml} ml · ${g.box} pz`,
    img: g.img,
    box: g.box,
    desc: {
      es: `Caja de ${g.box} piezas. Personalizable con tu logo; 1 tinta incluida, cada tinta extra +$50 por caja. Anticipo 50%, entrega 2–3 semanas.`,
      en: `Box of ${g.box}. Customizable with your logo; 1 ink included, each extra ink +$50 per box. 50% deposit, 2–3 week lead time.`,
    },
    formats: [
      {
        id: "plain",
        label: { es: `Sin tinta · caja ${g.box}`, en: `No print · box of ${g.box}` },
        short: { es: "SIN TINTA", en: "NO PRINT" },
        price: g.plain,
        unit: g.box,
      },
      {
        id: "inked",
        label: { es: `1 tinta · caja ${g.box}`, en: `1-ink print · box of ${g.box}` },
        short: { es: "1 TINTA", en: "1 INK" },
        price: g.inked,
        unit: g.box,
      },
    ],
  }));

  const gear: Product[] = GEAR.map((k) => ({
    id: k.id,
    kind: "gear",
    name: k.name,
    breweryName: "CCO Equipo",
    origin: "CDMX",
    style: k.sub,
    desc: k.sub,
    img: k.img,
    formats: [
      {
        id: "unit",
        label: { es: "Pieza", en: "Piece" },
        short: { es: "PIEZA", en: "PIECE" },
        price: k.price,
        unit: 1,
      },
    ],
  }));

  return [...beer, ...glass, ...gear];
}

export const PRODUCTS: Product[] = build();
export const PRODUCTS_BY_ID: Record<string, Product> = Object.fromEntries(
  PRODUCTS.map((p) => [p.id, p]),
);
export const BEER_PRODUCTS = PRODUCTS.filter((p) => p.kind === "beer");

export const EMPTY_FILTERS: Filters = {
  styles: [],
  abv: [3, 9],
  ibu: [],
  brew: [],
  origin: [],
  fmt: [],
};

export function filterProducts(
  kind: Kind,
  search: string,
  f: Filters,
  lang: Lang,
): Product[] {
  let list = PRODUCTS.filter((p) => p.kind === kind);
  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter((p) =>
      [p.name, localized(p.style, lang), p.breweryName]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
  if (kind !== "beer") return list;
  return list.filter(
    (p) =>
      (!f.styles.length || f.styles.includes(styleGroup(p.style as string))) &&
      p.abv! >= f.abv[0] &&
      p.abv! <= f.abv[1] &&
      (!f.ibu.length || f.ibu.includes(ibuLevel(p.ibu!))) &&
      (!f.brew.length || f.brew.includes(p.brewery!)) &&
      (!f.origin.length || f.origin.includes(p.origin)) &&
      (!f.fmt.length ||
        p.formats.some((x) =>
          f.fmt.includes(x.id.startsWith("keg") ? "keg" : "can"),
        )),
  );
}

export function countActiveFilters(f: Filters, kind: Kind): number {
  if (kind !== "beer") return 0;
  const abvActive = f.abv[0] > 3 || f.abv[1] < 9;
  return (
    f.styles.length +
    (abvActive ? 1 : 0) +
    f.ibu.length +
    f.brew.length +
    f.origin.length +
    f.fmt.length
  );
}
