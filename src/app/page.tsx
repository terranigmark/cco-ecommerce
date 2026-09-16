import { Hero } from "@/components/home/hero";
import { CategoryIndex } from "@/components/home/category-index";
import { BreweryPanels } from "@/components/home/brewery-panels";
import { BestSellers } from "@/components/home/best-sellers";
import { Terms } from "@/components/home/terms";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <CategoryIndex />
      <BreweryPanels />
      <BestSellers />
      <Terms />
    </main>
  );
}
