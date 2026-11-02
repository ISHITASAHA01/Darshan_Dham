import { temples } from "@/data/temples";
import TempleCard from "./TempleCard";
import SectionHeader from "./SectionHeader";
import { getTempleImage } from "@/lib/temple-image";

export default function PopularTemples() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-12">
            <SectionHeader
                titleKey="popular_temples"
                subKey="popular_temples_sub"
                linkKey="view_all_temples"
                href="/temples"
            />

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