import BrowseByState from "@/components/BrowseByState";
import Hero from "@/components/Hero";
import PopularTemples from "@/components/PopularTemples";

export default function Home() {
  return (
    <main>
      <Hero />
      <PopularTemples />
      <BrowseByState />
    </main>
  );
}