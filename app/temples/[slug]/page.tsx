import { notFound } from "next/navigation";
import TempleDetailsView from "@/components/TempleDetailsView";
import { getTempleImage } from "@/lib/temple-image";
import { getAllTemples, getTempleBySlug } from "@/lib/temples-db";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const temple = await getTempleBySlug(slug);
  if (!temple) return {};

  const image = temple.image ?? getTempleImage(temple.slug);
  const title = `${temple.name}, ${temple.city} - Timings, Aarti & History`;
  const description = `${temple.name} in ${temple.city}, ${temple.state}. Darshan timings: ${temple.timings}. Aarti times, history, map and directions.`;

  return {
    title,
    description,
    alternates: { canonical: `/temples/${slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const all = await getAllTemples();
  return all.map((t) => ({ slug: t.slug }));
}

export default async function TempleDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const temple = await getTempleBySlug(slug);
  if (!temple) notFound();
  const image = temple.image ?? getTempleImage(temple.slug);

  const d = 0.01;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${temple.lng - d
    }%2C${temple.lat - d}%2C${temple.lng + d}%2C${temple.lat + d
    }&layer=mapnik&marker=${temple.lat}%2C${temple.lng}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}`;

  return (
    <TempleDetailsView
      temple={temple}
      image={image}
      mapSrc={mapSrc}
      directions={directions}
    />
  );
}
