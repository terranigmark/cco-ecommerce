import type { Lang } from "./types";

export type Dict = {
  ticker: string;
  home: string;
  catalog: string;
  cart: string;
  searchPh: string;
  searchShort: string;
  heroKicker: string;
  heroL1: string;
  heroL2: string;
  heroL3: string;
  heroSub: string;
  shopSeasonal: string;
  viewCatalog: string;
  indexLabel: string;
  sections: string;
  breweryWord: string;
  breweries: string;
  bestSellers: string;
  receiptHead: string;
  seeAll: string;
  beersWord: string;
  add: string;
  remove: string;
  filters: string;
  clear: string;
  style: string;
  brewery: string;
  origin: string;
  format: string;
  showResults: string;
  results: string;
  gridView: string;
  tableView: string;
  product: string;
  price: string;
  qty: string;
  reviewOrder: string;
  noResults: string;
  yourOrder: string;
  linesWord: string;
  emptyTitle: string;
  emptySub: string;
  subtotal: string;
  drawerNote: string;
  reviewDraft: string;
  continueShopping: string;
  backToCatalog: string;
  draftNo: string;
  checkoutTitle: string;
  checkoutSub: string;
  shipping: string;
  billing: string;
  needInvoice: string;
  regimen: string;
  cfdi: string;
  iepsBreakdown: string;
  payment: string;
  notes: string;
  notesPh: string;
  summary: string;
  shippingCost: string;
  taxNote: string;
  estTotal: string;
  submitOrder: string;
  submitNote: string;
  required: string;
  state: string;
  confirmedL1: string;
  confirmedL2: string;
  confirmedSub: string;
  orderNo: string;
  backHome: string;
  tagTemp: string;
  tagLim: string;
  beer: string;
  glass: string;
  gear: string;
  beerSub: string;
  glassSub: string;
  gearSub: string;
  ibuLow: string;
  ibuMid: string;
  ibuHigh: string;
  can: string;
  keg: string;
  perCan: string;
  perPiece: string;
  moqBeer: string;
  moqGlass: string;
  moqOk: string;
  moqNeed: (n: number, min: number) => string;
  shipFree: string;
  shipFreeLabel: string;
  shipQuote: string;
  payTransfer: string;
  payTransferSub: string;
  payCash: string;
  payCashSub: string;
  terms: [string, string][];
  fName: string;
  fCompany: string;
  fPhone: string;
  fEmail: string;
  fStreet: string;
  fCity: string;
  fZip: string;
  fRfc: string;
  fRazon: string;
  rfcErr: string;
  submitting: string;
  submitError: string;
};

const es: Dict = {
  ticker:
    "Distribución de cerveza artesanal · CDMX envío $0 · Menudeo desde 24 pz · Pago contra entrega · Cadena fría 2–4 °C · Catálogo 2026 · Cardera · Cervecería 308 ·",
  home: "Inicio",
  catalog: "Catálogo",
  cart: "Pedido",
  searchPh: "buscar cerveza / estilo / cervecería",
  searchShort: "buscar",
  heroKicker: "Nuevos lanzamientos — Temporada 2026",
  heroL1: "Cerveza",
  heroL2: "Artesanal",
  heroL3: "Mexicana",
  heroSub:
    "Distribuimos Cardera (Ensenada) y Cervecería 308 (Sonora) para bares, restaurantes y tiendas de CDMX. Arma tu pedido, lo cotizamos, pagas al recibir.",
  shopSeasonal: "De temporada",
  viewCatalog: "Catálogo",
  indexLabel: "Índice",
  sections: "secciones",
  breweryWord: "Cervecería",
  breweries: "Cervecerías",
  bestSellers: "Más pedidas",
  receiptHead: "# · Art. · Precio incl. IVA+IEPS",
  seeAll: "Ver",
  beersWord: "cervezas",
  add: "Agregar",
  remove: "Quitar",
  filters: "Filtros",
  clear: "Limpiar",
  style: "Estilo",
  brewery: "Cervecería",
  origin: "Origen",
  format: "Formato",
  showResults: "Ver resultados",
  results: "resultados",
  gridView: "Explorar",
  tableView: "Pedido rápido",
  product: "Producto",
  price: "Precio",
  qty: "Cant.",
  reviewOrder: "Revisar",
  noResults: "sin resultados con estos filtros",
  yourOrder: "Tu pedido",
  linesWord: "líneas",
  emptyTitle: "Nada aún",
  emptySub:
    "Agrega latas o barriles desde el catálogo. El mínimo de menudeo es 24 piezas.",
  subtotal: "Subtotal",
  drawerNote:
    "Precios incluyen IVA e IEPS. Pago contra entrega: transferencia o efectivo.",
  reviewDraft: "Revisar y armar pedido",
  continueShopping: "Seguir explorando",
  backToCatalog: "Catálogo",
  draftNo: "Borrador",
  checkoutTitle: "Solicitud de pedido",
  checkoutSub:
    "No se cobra en línea. Revisamos existencias, confirmamos por WhatsApp y coordinamos entrega. Pagas al recibir.",
  shipping: "Entrega",
  billing: "Facturación",
  needInvoice: "Requiero factura (CFDI)",
  regimen: "Régimen fiscal",
  cfdi: "Uso del CFDI",
  iepsBreakdown: "Requiero desglose de IEPS en la factura",
  payment: "Forma de pago",
  notes: "Notas",
  notesPh: "Horario de recepción, referencias, Nitro Stout…",
  summary: "Resumen",
  shippingCost: "Envío",
  taxNote: "IVA e IEPS incluidos",
  estTotal: "Total estimado",
  submitOrder: "Enviar solicitud",
  submitNote:
    "Confirmación de existencias y fecha de entrega en menos de 24 h hábiles.",
  required: "requerido",
  state: "Estado",
  confirmedL1: "Solicitud",
  confirmedL2: "Recibida",
  confirmedSub:
    "Te confirmaremos existencias y fecha de entrega por WhatsApp. El pago se realiza al recibir tu pedido.",
  orderNo: "N° de solicitud",
  backHome: "Volver al inicio",
  tagTemp: "Temporada",
  tagLim: "Ed. limitada",
  beer: "Cerveza",
  glass: "Cristalería",
  gear: "Equipo",
  beerSub: "Lata y barril PET 20 L · Cardera + 308",
  glassSub: "Vasos y copas personalizables · MOQ 60 pz",
  gearSub: "Kegerators, barriles inox, CO₂, botellas",
  ibuLow: "<20",
  ibuMid: "20–40",
  ibuHigh: ">40",
  can: "Lata",
  keg: "Barril 20L",
  perCan: "/ lata",
  perPiece: "/ pieza",
  moqBeer: "Mínimo cerveza 24 pz",
  moqGlass: "Mínimo cristalería 60 pz",
  moqOk: "Mínimo alcanzado ✓",
  moqNeed: (n, min) =>
    `Te faltan ${n} piezas para el mínimo de mayoreo (${min})`,
  shipFree:
    "ENTREGA EN CDMX SIN COSTO. ENVÍOS FORÁNEOS CORREN A CARGO DEL CLIENTE Y SE COTIZAN AL CONFIRMAR.",
  shipFreeLabel: "$0 (CDMX)",
  shipQuote: "Por cotizar",
  payTransfer: "Transferencia",
  payTransferSub: "Te enviamos CLABE al confirmar. Pagas al recibir.",
  payCash: "Efectivo c/entrega",
  payCashSub: "Pagas al repartidor al momento de la entrega.",
  terms: [
    [
      "Entrega CDMX $0",
      "Envíos foráneos corren a cargo del cliente. Cadena fría en latas y barriles.",
    ],
    [
      "Menudeo desde 24 pz",
      "Cristalería desde 60 piezas. Kegerators y accesorios sin mínimo.",
    ],
    [
      "Pago contra entrega",
      "Transferencia o efectivo al recibir. Factura con desglose de IEPS.",
    ],
  ],
  fName: "Contacto",
  fCompany: "Negocio / Bar",
  fPhone: "WhatsApp",
  fEmail: "Correo",
  fStreet: "Calle y número",
  fCity: "Colonia / Ciudad",
  fZip: "C.P.",
  fRfc: "RFC",
  fRazon: "Razón social",
  rfcErr: "RFC de 12 o 13 caracteres",
  submitting: "Enviando…",
  submitError: "No pudimos enviar la solicitud. Intenta de nuevo.",
};

const en: Dict = {
  ticker:
    "Craft beer distribution · CDMX free delivery · Wholesale from 24 pcs · Pay on delivery · Cold chain 2–4 °C · 2026 Catalog · Cardera · Cervecería 308 ·",
  home: "Home",
  catalog: "Catalog",
  cart: "Order",
  searchPh: "search beer / style / brewery",
  searchShort: "search",
  heroKicker: "New arrivals — 2026 season",
  heroL1: "Mexican",
  heroL2: "Craft",
  heroL3: "Beer",
  heroSub:
    "We distribute Cardera (Ensenada) and Cervecería 308 (Sonora) to bars, restaurants and shops across Mexico City. Build your order, we quote it, you pay on delivery.",
  shopSeasonal: "Seasonal",
  viewCatalog: "Catalog",
  indexLabel: "Index",
  sections: "sections",
  breweryWord: "Brewery",
  breweries: "Breweries",
  bestSellers: "Best sellers",
  receiptHead: "# · Item · Price incl. IVA+IEPS",
  seeAll: "See",
  beersWord: "beers",
  add: "Add",
  remove: "Remove",
  filters: "Filters",
  clear: "Clear",
  style: "Style",
  brewery: "Brewery",
  origin: "Origin",
  format: "Format",
  showResults: "Show results",
  results: "results",
  gridView: "Explore",
  tableView: "Quick order",
  product: "Product",
  price: "Price",
  qty: "Qty",
  reviewOrder: "Review",
  noResults: "no results for these filters",
  yourOrder: "Your order",
  linesWord: "lines",
  emptyTitle: "Nothing yet",
  emptySub:
    "Add cans or kegs from the catalog. Wholesale minimum is 24 pieces.",
  subtotal: "Subtotal",
  drawerNote:
    "Prices include IVA and IEPS. Pay on delivery: bank transfer or cash.",
  reviewDraft: "Review & draft order",
  continueShopping: "Keep browsing",
  backToCatalog: "Catalog",
  draftNo: "Draft",
  checkoutTitle: "Order request",
  checkoutSub:
    "No online payment. We check stock, confirm over WhatsApp and schedule delivery. You pay on delivery.",
  shipping: "Shipping",
  billing: "Billing / Tax",
  needInvoice: "I need an invoice (CFDI)",
  regimen: "Tax regime",
  cfdi: "CFDI usage",
  iepsBreakdown: "Break down IEPS on the invoice",
  payment: "Payment",
  notes: "Notes",
  notesPh: "Receiving hours, references, Nitro Stout…",
  summary: "Summary",
  shippingCost: "Shipping",
  taxNote: "IVA and IEPS included",
  estTotal: "Estimated total",
  submitOrder: "Submit request",
  submitNote: "Stock confirmation and delivery date within 24 business hours.",
  required: "required",
  state: "State",
  confirmedL1: "Request",
  confirmedL2: "Received",
  confirmedSub:
    "We will confirm stock and delivery date over WhatsApp. Payment is made when you receive your order.",
  orderNo: "Request no.",
  backHome: "Back to home",
  tagTemp: "Seasonal",
  tagLim: "Limited",
  beer: "Beer",
  glass: "Glassware",
  gear: "Equipment",
  beerSub: "Cans and PET 20 L kegs · Cardera + 308",
  glassSub: "Customizable glasses · MOQ 60 pcs",
  gearSub: "Kegerators, steel kegs, CO₂, bottles",
  ibuLow: "<20",
  ibuMid: "20–40",
  ibuHigh: ">40",
  can: "Can",
  keg: "Keg 20L",
  perCan: "/ can",
  perPiece: "/ piece",
  moqBeer: "Beer minimum 24 pcs",
  moqGlass: "Glassware minimum 60 pcs",
  moqOk: "Minimum reached ✓",
  moqNeed: (n, min) =>
    `You need ${n} more pieces to reach the wholesale minimum (${min})`,
  shipFree:
    "FREE DELIVERY IN MEXICO CITY. OUT-OF-TOWN SHIPPING IS PAID BY THE CUSTOMER AND QUOTED ON CONFIRMATION.",
  shipFreeLabel: "$0 (CDMX)",
  shipQuote: "To be quoted",
  payTransfer: "Bank transfer",
  payTransferSub: "We send the CLABE on confirmation. Pay on delivery.",
  payCash: "Cash on delivery",
  payCashSub: "Pay the driver when your order arrives.",
  terms: [
    [
      "CDMX delivery $0",
      "Out-of-town shipping paid by the customer. Cold chain for cans and kegs.",
    ],
    [
      "Wholesale from 24 pcs",
      "Glassware from 60 pieces. Kegerators and accessories have no minimum.",
    ],
    [
      "Pay on delivery",
      "Bank transfer or cash on receipt. Invoice with IEPS breakdown.",
    ],
  ],
  fName: "Contact",
  fCompany: "Business / Bar",
  fPhone: "WhatsApp",
  fEmail: "Email",
  fStreet: "Street & number",
  fCity: "Neighborhood / City",
  fZip: "ZIP",
  fRfc: "RFC",
  fRazon: "Legal name",
  rfcErr: "RFC must be 12–13 characters",
  submitting: "Sending…",
  submitError: "We could not send the request. Please try again.",
};

export const DICTS: Record<Lang, Dict> = { es, en };
