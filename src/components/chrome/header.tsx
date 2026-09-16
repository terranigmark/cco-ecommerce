"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart, usePrefs } from "@/components/providers";
import { pad } from "@/lib/products";
import { asset } from "@/lib/asset";

function HeaderSearch() {
  const { t } = usePrefs();
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";

  const onChange = (value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("q", value);
    else next.delete("q");
    router.replace(`/catalog?${next.toString()}`, { scroll: false });
  };

  return (
    <div
      className="mono flex min-w-0 flex-1 items-center gap-2.5 px-4"
      style={{ borderColor: "var(--ln)" }}
    >
      <span className="text-xs" style={{ color: "var(--mu)" }}>
        ⌕
      </span>
      <input
        value={q}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.searchPh}
        aria-label={t.searchPh}
        className="min-w-0 flex-1 border-0 bg-transparent text-xs outline-0"
      />
    </div>
  );
}

export function Header() {
  const { t, lang, theme, toggleLang, toggleTheme } = usePrefs();
  const { count, openDrawer } = useCart();
  const pathname = usePathname();

  const navColor = (active: boolean) => (active ? "var(--tx)" : "var(--mu)");

  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{ background: "var(--bg)", borderColor: "var(--ink)" }}
    >
      <div className="grid h-14 grid-cols-[auto_1fr_auto] items-stretch">
        <Link
          href="/"
          className="flex items-center gap-3 border-r px-4"
          style={{ borderColor: "var(--ln)" }}
        >
          <Image
            src={asset("/assets/logo-cco.png")}
            alt="CCO"
            width={30}
            height={30}
            className="rounded-full object-cover"
          />
          <span className="display text-[22px] leading-none tracking-[-0.01em]">
            CCO
          </span>
          <span
            className="mono hidden text-[10px] leading-[1.2] uppercase tracking-[0.08em] md:block"
            style={{ color: "var(--mu)" }}
          >
            Colectivo Cervecero
            <br />
            de Oriente · MX
          </span>
        </Link>

        <div className="flex min-w-0 items-stretch">
          <nav className="hidden md:flex">
            <Link
              href="/"
              className="flex items-center border-r px-[18px] text-[13px] font-semibold uppercase tracking-[0.06em]"
              style={{ borderColor: "var(--ln)", color: navColor(pathname === "/") }}
            >
              {t.home}
            </Link>
            <Link
              href="/catalog"
              className="flex items-center border-r px-[18px] text-[13px] font-semibold uppercase tracking-[0.06em]"
              style={{
                borderColor: "var(--ln)",
                color: navColor(pathname.startsWith("/catalog")),
              }}
            >
              {t.catalog}
            </Link>
          </nav>
          <div className="hidden min-w-0 flex-1 md:flex">
            <Suspense fallback={null}>
              <HeaderSearch />
            </Suspense>
          </div>
        </div>

        <div className="flex items-stretch">
          <span
            className="mono hidden items-center border-l px-4 text-[10px] tracking-[0.04em] md:flex"
            style={{ borderColor: "var(--ln)", color: "var(--mu)" }}
          >
            CDMX 19.43°N 99.13°W
          </span>
          <button
            onClick={toggleLang}
            className="mono cursor-pointer border-0 border-l bg-transparent px-3.5 text-xs font-semibold"
            style={{ borderColor: "var(--ln)" }}
            aria-label="Language"
          >
            {lang.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            className="mono cursor-pointer border-0 border-l bg-transparent px-3.5 text-xs font-semibold"
            style={{ borderColor: "var(--ln)" }}
            aria-label="Theme"
          >
            {theme === "dark" ? "LIGHT" : "DARK"}
          </button>
          <button
            onClick={openDrawer}
            className="flex cursor-pointer items-center gap-2.5 border-0 border-l px-[18px] text-[13px] font-bold uppercase tracking-[0.06em]"
            style={{
              borderColor: "var(--ink)",
              background: "var(--ac)",
              color: "var(--act)",
            }}
          >
            <span className="hidden md:inline">{t.cart}</span>
            <span
              className="mono grid h-[22px] min-w-[26px] place-items-center px-1.5 text-[13px]"
              style={{ border: "2px solid var(--act)" }}
            >
              {pad(count)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
