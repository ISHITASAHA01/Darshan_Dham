import Link from "next/link";
import { temples } from "@/data/temples";
import TempleCard from "./TempleCard";
import { getTempleImage } from "@/lib/temple-image";

export default function PopularTemples() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="font-heading text-3xl font-semibold">Popular Temples</h2>
                    <p className="text-sm text-brown">
                        Explore some of the most visited and revered temples in India.
                    </p>
                </div>
                <Link href="/temples" className="text-sm text-saffron hover:underline">
                    View All Temples →
                </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {temples.slice(0, 8).map((t) => (
                    <TempleCard
                        key={t.slug}
                        temple={{ ...t, image: t.image ?? getTempleImage(t.slug) }}
                    />
                ))}
            </div>
        </section>
    );
}