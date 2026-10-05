"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Flame, Navigation, ScrollText, ZoomIn } from "lucide-react";
import type { Temple } from "@/data/temples";
import TempleStory from "@/components/TempleStory";
import TempleIcon from "@/components/TempleIcon";
import PujaList from "@/components/PujaList";
import ImageLightbox from "@/components/ImageLightbox";
import { useLanguage } from "@/i18n/LanguageContext";
import { locName, locCity, locState, locDeity, locTimings } from "@/i18n/localize";

export default function TempleDetailsView({
    temple,
    image,
    mapSrc,
    directions,
}: {
    temple: Temple;
    image?: string;
    mapSrc: string;
    directions: string;
}) {
    const { t, lang } = useLanguage();
    const name = locName(temple.slug, temple.name, lang);

    return (
        <main>
            <section className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-navy to-saffron-dark">
                {image ? (
                    // Poori banner photo pe click = photo bada khulegi
                    <ImageLightbox src={image} alt={name} className="absolute inset-0 block h-full w-full">
                        <Image src={image} alt={name} fill className="object-cover" priority />
                    </ImageLightbox>
                ) : (
                    <TempleIcon className="absolute right-10 top-10 h-40 w-40 text-white/10" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-black/50" />

                {image && (
                    <span className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                        <ZoomIn className="h-4 w-4" /> {t("view_photo")}
                    </span>
                )}

                <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-8 text-white">
                    <p className="text-sm text-white/80">
                        <Link href="/" className="pointer-events-auto hover:underline">{t("nav_home")}</Link> ›{" "}
                        <Link href="/temples" className="pointer-events-auto hover:underline">{t("nav_temples")}</Link> ›{" "}
                        {name}
                    </p>
                    <h1 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">{name}</h1>
                    <p className="mt-1 flex items-center gap-2 text-white/90">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {locCity(temple.city, lang)}, {locState(temple.state, lang)} • {locDeity(temple.deity, lang)}
                    </p>
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h2 className="mb-3 flex items-center gap-2 font-heading text-2xl font-semibold">
                        <ScrollText className="h-6 w-6 text-saffron" /> {t("history_story")}
                    </h2>

                    <TempleStory slug={temple.slug} story={temple.story} note={temple.note} />

                    <h2 className="mb-3 mt-10 flex items-center gap-2 font-heading text-2xl font-semibold">
                        <MapPin className="h-6 w-6 text-saffron" /> {t("real_location")}
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
                        <Navigation className="h-4 w-4" /> {t("get_directions")}
                    </a>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold">
                            <Clock className="h-5 w-5 text-saffron" /> {t("opening_closing")}
                        </h3>
                        <p className="text-sm text-brown">{locTimings(temple.timings, lang)}</p>
                    </div>

                    <div className="rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold">
                            <Flame className="h-5 w-5 text-saffron" /> {t("puja_timings")}
                        </h3>
                        <PujaList slug={temple.slug} pujas={temple.pujas} />
                        <p className="mt-3 text-xs text-brown/70">{t("timings_note")}</p>
                    </div>
                </aside>
            </div>
        </main>
    );
}