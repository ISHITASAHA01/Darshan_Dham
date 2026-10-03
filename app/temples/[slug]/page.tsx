import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  Flame,
  Navigation,
  ScrollText,
  Info,
} from "lucide-react";
import { temples } from "@/data/temples";
import TempleStory from "@/components/TempleStory";
import TempleIcon from "@/components/TempleIcon";
import PujaList from "@/components/PujaList";
import { getTempleImage } from "@/lib/temple-image";

export function generateStaticParams() {
  return temples.map((t) => ({ slug: t.slug }));
}

export default async function TempleDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const temple = temples.find((t) => t.slug === slug);
  if (!temple) notFound();
  const image = temple.image ?? getTempleImage(temple.slug);

  const d = 0.01;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${temple.lng - d
    }%2C${temple.lat - d}%2C${temple.lng + d}%2C${temple.lat + d
    }&layer=mapnik&marker=${temple.lat}%2C${temple.lng}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}`;

  return (
    <main>
      <section className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-navy to-saffron-dark">
        {temple.image ? (
          <Image src={temple.image} alt={temple.name} fill className="object-cover" priority />
        ) : (
          <TempleIcon className="absolute right-10 top-10 h-40 w-40 text-white/10" />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-8 text-white">
          <p className="text-sm text-white/80">
            <Link href="/" className="hover:underline">Home</Link> ›{" "}
            <Link href="/temples" className="hover:underline">Temples</Link> ›{" "}
            {temple.name}
          </p>
          <h1 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">
            {temple.name}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-white/90">
            <MapPin className="h-4 w-4" />
            {temple.city}, {temple.state} • {temple.deity}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 flex items-center gap-2 font-heading text-2xl font-semibold">
            <ScrollText className="h-6 w-6 text-saffron" /> History & Story
          </h2>
          {/* <p className="leading-relaxed text-brown">{temple.story}</p>

          {temple.note && (
            <div className="mt-6 flex gap-3 rounded-lg border border-saffron/40 bg-saffron-light/50 p-4 text-sm text-brown">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-saffron-dark" />
              {temple.note}
            </div>
          )} */}

          <TempleStory slug={temple.slug} story={temple.story} note={temple.note} />

          <h2 className="mb-3 mt-10 flex items-center gap-2 font-heading text-2xl font-semibold">
            <MapPin className="h-6 w-6 text-saffron" /> Real Location
          </h2>
          <div className="overflow-hidden rounded-xl border border-saffron-light">
            <iframe
              title={`Map of ${temple.name}`}
              src={mapSrc}
              className="h-80 w-full"
              loading="lazy"
            />
          </div>
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-saffron px-5 py-2.5 text-sm font-medium text-white hover:bg-saffron-dark"
          >
            <Navigation className="h-4 w-4" /> Get Directions
          </a>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Clock className="h-5 w-5 text-saffron" /> Opening & Closing
            </h3>
            <p className="text-sm text-brown">{temple.timings}</p>
          </div>

          <div className="rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Flame className="h-5 w-5 text-saffron" /> Puja & Aarti Timings
            </h3>
            {/* <ul className="divide-y divide-saffron-light text-sm">
              {temple.pujas.map((p, i) => (
                <li key={i} className="flex justify-between py-2">
                  <span className="text-foreground">{p.name}</span>
                  <span className="text-brown">{p.time}</span>
                </li>
              ))}
            </ul> */}
            <PujaList slug={temple.slug} pujas={temple.pujas} />
            <p className="mt-3 text-xs text-brown/70">
              Timings may change on festivals. Please confirm with the temple.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}