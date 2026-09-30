import Link from "next/link";
import { Search } from "lucide-react";
import { temples, states } from "@/data/temples";
import TempleCard from "@/components/TempleCard";
import { getTempleImage } from "@/lib/temple-image";

export default async function AllTemples({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; state?: string }>;
}) {
  const { q = "", state = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const list = temples.filter((t) => {
    const matchesState = !state || t.state === state;
    const matchesText =
      !query ||
      [t.name, t.city, t.state, t.deity].some((field) =>
        field.toLowerCase().includes(query)
      );
    return matchesState && matchesText;
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-heading text-4xl font-semibold">All Temples</h1>
      <p className="mb-6 text-brown">
        {list.length} of {temples.length} temples
        {state && ` in ${state}`}
        {q && ` matching "${q}"`}
      </p>

      <form
        action="/temples"
        method="get"
        className="mb-8 flex flex-col gap-3 rounded-lg border border-saffron-light bg-white p-3 sm:flex-row"
      >
        <div className="flex flex-1 items-center gap-2 px-2">
          <Search className="h-5 w-5 text-brown" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Temple, city or deity..."
            className="w-full py-2 text-sm outline-none"
          />
        </div>
        <select
          name="state"
          defaultValue={state}
          className="rounded-md border border-saffron-light px-3 py-2 text-sm outline-none"
        >
          <option value="">All States</option>
          {states.map((s) => (
            <option key={s.slug} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-saffron px-6 py-2 text-sm font-medium text-white hover:bg-saffron-dark"
        >
          Search
        </button>
      </form>

      {list.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((t) => (
            <TempleCard
              key={t.slug}
              temple={{ ...t, image: t.image ?? getTempleImage(t.slug) }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-saffron/50 p-10 text-center">
          <p className="font-medium">No temples found.</p>
          <p className="mt-1 text-sm text-brown">
            Try a different name, or clear the state filter.
          </p>
          <Link
            href="/temples"
            className="mt-4 inline-block text-sm text-saffron hover:underline"
          >
            Show all temples
          </Link>
        </div>
      )}
    </main>
  );
}