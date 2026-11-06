import AllTemplesClient from "@/components/AllTemplesClient";
import { getTempleImage } from "@/lib/temple-image";
import { getAllTemples, getStates } from "@/lib/temples-db";

export default async function AllTemples({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; state?: string }>;
}) {
  const { q = "", state = "" } = await searchParams;
  const [temples, states] = await Promise.all([getAllTemples(), getStates()]);

  const items = temples.map((t) => ({
    ...t,
    image: t.image ?? getTempleImage(t.slug),
  }));

  return (
    <AllTemplesClient
      items={items}
      states={states}
      initialQ={q}
      initialState={state}
    />
  );
}
