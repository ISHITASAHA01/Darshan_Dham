"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Clock, MapPin, ArrowRight, Heart } from "lucide-react";
import TempleIcon from "@/components/TempleIcon";
import ImageLightbox from "@/components/ImageLightbox";
import type { Temple } from "@/data/temples";
import { useLanguage } from "@/i18n/LanguageContext";
import { locName, locDeity, locState, locTimings } from "@/i18n/localize";

export default function TempleCard({ temple }: { temple: Temple }) {
    const { t, lang } = useLanguage();
    const image = temple.image; // ab fs wala function yahan nahi chalega
    const name = locName(temple.slug, temple.name, lang);

    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(saved.includes(temple.slug));
    }, [temple.slug]);

    const toggleFavorite = () => {
        const saved = JSON.parse(localStorage.getItem("favorites") || "[]");

        let updated;

        if (saved.includes(temple.slug)) {
            updated = saved.filter((slug: string) => slug !== temple.slug);
        } else {
            updated = [...saved, temple.slug];
        }

        localStorage.setItem("favorites", JSON.stringify(updated));
        setIsFavorite(updated.includes(temple.slug));
    };
    return (
        // <div className="flex flex-col overflow-hidden rounded-xl border border-saffron-light bg-white shadow-sm transition hover:shadow-lg">
        <div className="flex flex-col overflow-hidden rounded-xl border border-saffron-light bg-[var(--surface)] shadow-sm transition hover:shadow-lg">
            <div className="relative h-40 w-full bg-gradient-to-br from-saffron-light to-saffron/40">
                <button
                    onClick={toggleFavorite}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    // className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 shadow-md transition hover:scale-110"
                    className="absolute right-3 top-3 z-10 rounded-full bg-[var(--surface-soft)] p-2 shadow-md transition hover:scale-110"
                >
                    <Heart
                        className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-[var(--muted)]"
                            // : "text-gray-600"
                            }`}
                    />
                </button>

                {image ? (
                    // Photo pe click = photo bada khulega (details page nahi)
                    <ImageLightbox src={image} alt={name} className="relative block h-full w-full">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 768px) 100vw, 20vw"
                            className="object-cover"
                        />
                    </ImageLightbox>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <TempleIcon className="h-14 w-14 text-saffron-dark/60" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="flex items-start gap-1 font-semibold text-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
                    {name}
                </h3>
                <p className="text-xs text-brown">
                    {locDeity(temple.deity, lang)} • {locState(temple.state, lang)}
                </p>
                <p className="flex items-start gap-2 text-xs text-brown">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {locTimings(temple.timings, lang)}
                </p>

                <Link
                    href={`/temples/${temple.slug}`}
                    className="mt-auto flex items-center justify-center gap-1 rounded-md border border-saffron py-2 text-sm font-medium text-saffron transition hover:bg-saffron hover:text-white"
                >
                    {t("view_details")} <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}