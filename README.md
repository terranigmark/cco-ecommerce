# CCO Storefront

Craft beer distribution storefront for **Colectivo Cervecero de Oriente** (Cardera + Cervecería 308), built from the Claude Design handoff `CCO Storefront v2` / `CCO Store v2`.

It is an **order-drafting (RFQ) storefront**, not a card checkout: customers build an order, submit a request, and pay on delivery by bank transfer or cash. Wholesale minimums are enforced in the cart.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`)
- No UI library — the design's own tokens and components are ported directly

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Home: hero, category index accordion, brewery panels, best-seller receipt, terms |
| `/catalog?c=beer\|glass\|gear&q=&brew=` | Faceted catalog, grid + quick-order table views |
| `/checkout` | Shipping, RFC/CFDI billing, payment preference, order summary |
| `/order?id=…` | Request confirmation |
| `POST /api/orders` | **Mocked** order intake — validates and returns a request number |

## Deploy

### GitHub Pages (static preview)

`.github/workflows/pages.yml` builds a static export on every push to `main` and publishes it. Enable it once under **Settings → Pages → Build and deployment → Source: GitHub Actions**; the site then lives at `https://<owner>.github.io/cco-ecommerce/`.

The Pages build sets `GITHUB_PAGES=true`, which switches `next.config.ts` to `output: "export"` with the repo name as `basePath`. Because a static export has no server, the workflow drops `src/app/api` and the checkout drafts request numbers client-side. Everything else — filters, cart, MOQ, validation, themes, languages — works unchanged.

### A real deployment

For the live store use a host that runs the Node build (Vercel, Netlify, Cloudflare, a container). That keeps `POST /api/orders`, server-rendered catalog pages for SEO, and image optimization — all of which the Pages export gives up. No config change is needed: without `GITHUB_PAGES`, `next build` produces the normal server build.

## Structure

```
src/app/            routes, layout (fonts + theme bootstrap), globals.css
src/components/
  chrome/           ticker, header, footer, mobile tab bar
  home/             hero, category index, brewery panels, best sellers, terms
  catalog/          catalog view, filter panel, product card, quick-order table
  cart/             slide-out cart drawer with MOQ bars
  checkout/         checkout form + confirmation
  providers.tsx     theme / language / cart context
src/lib/
  catalog.ts        product data from Catálogo CCO 2026 (prices MXN, IVA+IEPS incl.)
  products.ts       derived product model, filtering, SKU + money formatting
  i18n.ts           ES / EN dictionaries
  stores.ts         localStorage/sessionStorage-backed stores
public/assets/      label art, glassware, gear, logos, concrete texture
```

## Behaviour worth knowing

- **Theme** (graphite dark / kraft light) and **language** (ES/EN) toggle in the header and persist to `localStorage`. An inline script in `layout.tsx` applies the stored theme before first paint to avoid a flash.
- **Cart** persists to `localStorage`. MOQ: 24 pieces for beer, 60 for glassware; kegerators and accessories have no minimum. The drawer shows a segmented progress bar per category and checkout blocks nothing but warns.
- **Shipping**: CDMX is $0; any other state shows "por cotizar" and the total renders with a `+`.
- **Validation** mirrors the design: contact, phone, street, city and ZIP are required; with CFDI enabled, RFC must be 12–13 characters and legal name is required. The API route re-validates server-side.

## Not built yet

- `POST /api/orders` does not persist anything or notify anyone — wire it to the real backend (and, if online payment is ever added, a provider such as Mercado Pago) at that seam.
- Language is a client-side toggle, not localized routing. If ES/EN need separate indexed URLs for SEO, move to `/[lang]/…` or `next-intl`.
- Cervecería 308 has no label art in the source catalog, so those cards render the design's hatched placeholder slot. Drop real can photos into `public/assets/` and set `img` in `src/lib/catalog.ts`.
- Product data is a static module; there is no CMS or inventory source behind it.
