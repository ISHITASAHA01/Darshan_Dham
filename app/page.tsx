import BrowseByState from "@/components/BrowseByState";
import Hero from "@/components/Hero";
import PopularTemples from "@/components/PopularTemples";
import { getStates } from "@/lib/temples-db";
import {
  StatsBar,
  TodayMantra,
  FestivalCountdown,
  DigitalMala,
  MeditationTimer,
} from "@/components/home/HomeExtras";
import { INDIAN_STATES } from "@/lib/indian-states";

export const revalidate = 60;

export default async function Home() {
  const states = await getStates();

  return (
    <main>
      <Hero states={states} />

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6">
        <StatsBar
          items={[
            { label: "Temples", value: 250, suffix: "+", },
            { label: "States", value: INDIAN_STATES.length, },
            { label: "Aarti and pujas", value: 800, suffix: "+", },
            { label: "Festivals", value: 50, suffix: "+", },
          ]}
        />
        <TodayMantra />
      </div>

      <PopularTemples />

      <BrowseByState states={states} />

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6">
        <FestivalCountdown />
        <DigitalMala />
        <MeditationTimer />
      </div>
    </main>
  );
}