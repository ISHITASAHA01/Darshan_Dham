import { notFound } from "next/navigation";
import { states, temples } from "@/data/temples";
import TempleCard from "@/components/TempleCard";
import StateHeader from "@/components/StateHeader";
import { getTempleImage } from "@/lib/temple-image";

export function generateStaticParams() {
  return states.map((s) => ({ slug: s.slug }));
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const state = states.find((s) => s.slug === slug);
  if (!state) notFound();

  const list = temples.filter((t) => t.state === state.name);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <StateHeader stateName={state.name} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((t) => (
          <TempleCard
            key={t.slug}
            temple={{ ...t, image: t.image ?? getTempleImage(t.slug) }}
          />
        ))}
      </div>
    </main>
  );
}