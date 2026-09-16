"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, usePrefs } from "@/components/providers";
import { pad } from "@/lib/products";

export function MobileTabBar() {
  const { t } = usePrefs();
  const { count, openDrawer } = useCart();
  const pathname = usePathname();

  const tabs = [
    { id: "home", href: "/", label: t.home, icon: "⌂", active: pathname === "/" },
    {
      id: "catalog",
      href: "/catalog",
      label: t.catalog,
      icon: "☰",
      active: pathname.startsWith("/catalog"),
    },
    { id: "cart", href: null, label: t.cart, icon: "▣", active: false },
  ];

  return (
    <nav
      className="mono fixed inset-x-0 bottom-0 z-[15] grid h-15 grid-cols-3 border-t md:hidden"
      style={{ background: "var(--bg)", borderColor: "var(--ink)" }}
    >
      {tabs.map((tab) => {
        const style = {
          borderColor: "var(--ln)",
          background: tab.active ? "var(--tx)" : "transparent",
          color: tab.active ? "var(--bg)" : "var(--tx)",
        };
        const inner = (
          <>
            <span className="text-base leading-none">{tab.icon}</span>
            {tab.label}
            {tab.id === "cart" && count > 0 && (
              <span
                className="absolute top-2 right-[calc(50%-26px)] grid h-4 min-w-4 place-items-center px-1 text-[10px] font-semibold"
                style={{
                  background: "var(--ac)",
                  color: "var(--act)",
                  border: "1.5px solid var(--act)",
                }}
              >
                {pad(count)}
              </span>
            )}
          </>
        );
        const className =
          "relative flex cursor-pointer flex-col items-center justify-center gap-0.5 border-0 border-r text-[10px] uppercase tracking-[0.08em]";

        return tab.href ? (
          <Link key={tab.id} href={tab.href} className={className} style={style}>
            {inner}
          </Link>
        ) : (
          <button
            key={tab.id}
            onClick={openDrawer}
            className={className}
            style={style}
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
