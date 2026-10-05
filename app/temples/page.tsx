import { temples } from "@/data/temples";
import AllTemplesClient from "@/components/AllTemplesClient";
import { getTempleImage } from "@/lib/temple-image";

export default async function AllTemples({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; state?: string }>;
}) {
  const { q = "", state = "" } = await searchParams;

  // Photo ka path server pe nikalna padta hai, isliye yahan se bhej rahe hain
  const items = temples.map((t) => ({
    ...t,
    image: t.image ?? getTempleImage(t.slug),
  }));

  return <AllTemplesClient items={items} initialQ={q} initialState={state} />;
}