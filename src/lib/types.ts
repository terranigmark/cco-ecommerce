export type Lang = "es" | "en";
export type Theme = "dark" | "light";
export type Kind = "beer" | "glass" | "gear";
export type View = "grid" | "table";

export type Localized = { es: string; en: string };

export type Brewery = {
  id: string;
  name: string;
  origin: string;
  logo: string;
  logoLight: string;
  moq: number;
};

export type RawFormat = {
  id: string;
  label: string;
  price: number;
  unit: number;
};

export type Beer = {
  id: string;
  brewery: string;
  name: string;
  style: string;
  abv: number;
  ibu: number;
  tag: "linea" | "temporada" | "limitada";
  award?: string;
  img: string | null;
  desc: Localized;
  formats: RawFormat[];
};

export type Glass = {
  id: string;
  name: string;
  ml: number;
  box: number;
  plain: number;
  inked: number;
  img: string;
};

export type Gear = {
  id: string;
  name: string;
  sub: Localized;
  price: number;
  img: string;
  moq: number;
};

export type ProductFormat = {
  id: string;
  label: Localized;
  short: Localized;
  price: number;
  unit: number;
};

export type Product = {
  id: string;
  kind: Kind;
  name: string;
  breweryName: string;
  origin: string;
  brewery?: string;
  style: string | Localized;
  desc: Localized;
  img: string | null;
  formats: ProductFormat[];
  abv?: number;
  ibu?: number;
  tag?: Beer["tag"];
  award?: string;
  box?: number;
};

export type CartLine = {
  pid: string;
  fid: string;
  qty: number;
};

export type Filters = {
  styles: string[];
  abv: [number, number];
  ibu: string[];
  brew: string[];
  origin: string[];
  fmt: string[];
};

export type OrderForm = {
  name: string;
  company: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
  rfc: string;
  razon: string;
  regimen: string;
  cfdi: string;
  ieps: boolean;
  pay: "transfer" | "cash";
  invoice: boolean;
};
