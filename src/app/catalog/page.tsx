import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/catalog-view";

export const metadata = {
  title: "Catálogo · CCO",
  description:
    "Catálogo 2026: cerveza artesanal en lata y barril, cristalería personalizable y equipo de dispensado.",
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <CatalogView />
    </Suspense>
  );
}
