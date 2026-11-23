import BrowseByState from "@/components/BrowseByState";
import Hero from "@/components/Hero";
import PopularTemples from "@/components/PopularTemples";
import { getAllTemples, getStates } from "@/lib/temples-db";
import {
  TodayPanchangStrip,
  StatsBar,
  TodayMantra,
  FestivalCountdown,
  DigitalMala,
  MeditationTimer,
} from "@/components/home/HomeExtras";
import { INDIAN_STATES } from "@/lib/indian-states";
import { FESTIVALS } from "@/lib/festivals";

export const revalidate = 60;

export default async function Home() {
  const states = await getStates();
  const temples = await getAllTemples();
  const pujaCount = temples.reduce((n, t) => n + (t.pujas?.length ?? 0), 0);

  return (
    <main>
      <Hero states={states} />

      {/* Hero ke upar halka tairta hua "Aaj ka Panchang" card */}
      <div className="relative z-20 mx-auto -mt-12 max-w-7xl px-4 sm:px-6">
        <TodayPanchangStrip />
      </div>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6">
        <StatsBar
          items={[
            { label: "Temples", value: temples.length },
            { label: "States", value: INDIAN_STATES.length },
            { label: "Aarti and pujas", value: pujaCount },
            { label: "Festivals", value: FESTIVALS.length },
          ]}
        />
        <TodayMantra />
      </div>

      <div className="section-ornament" aria-hidden="true">ॐ</div>

      <PopularTemples />

      <BrowseByState states={states} />

      <div className="section-ornament" aria-hidden="true">ॐ</div>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6">
        <FestivalCountdown />
        <DigitalMala />
        <MeditationTimer />
      </div>
    </main>
  );
}