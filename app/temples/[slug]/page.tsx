import { notFound } from "next/navigation";
import { temples } from "@/data/temples";
import TempleDetailsView from "@/components/TempleDetailsView";
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
    <TempleDetailsView
      temple={temple}
      image={image}
      mapSrc={mapSrc}
      directions={directions}
    />
  );
}