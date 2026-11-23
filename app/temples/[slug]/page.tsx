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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://darshan-dham.vercel.app";

  const image = temple.image ?? getTempleImage(temple.slug);

  const title = `${temple.name}, ${temple.city} - Darshan Timings, Aarti & History | Darshan Dham`;

  const description =
    `Explore ${temple.name} in ${temple.city}, ${temple.state}. ` +
    `Check darshan timings (${temple.timings}), temple history, ` +
    `aarti information, location and directions on Darshan Dham.`;

  return {
    title,
    description,

    alternates: {
      canonical: `${baseUrl}/temples/${slug}`,
    },

    openGraph: {
      title,
      description,
      url: `${baseUrl}/temples/${slug}`,
      siteName: "Darshan Dham",
      type: "article",
      images: image
        ? [{ url: image, alt: `${temple.name} temple` }]
        : undefined,
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
