import BrowseByState from "@/components/BrowseByState";
import Hero from "@/components/Hero";
import PopularTemples from "@/components/PopularTemples";
import { getStates } from "@/lib/temples-db";

export const revalidate = 60;

export default async function Home() {
  const states = await getStates();
  return (
    <main>
      <Hero states={states} />
      <PopularTemples />
      <BrowseByState states={states} />
    </main>
  );
}
