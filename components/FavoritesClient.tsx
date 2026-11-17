"use client";

import { useEffect, useState } from "react";
import type { Temple } from "@/data/temples";
import TempleCard from "@/components/TempleCard";
import { useLanguage } from "@/i18n/LanguageContext";

export default function FavoritesClient({ items }: { items: Temple[] }) {

    const { t } = useLanguage();
    const [favorites, setFavorites] = useState<string[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorites(saved);
        setLoaded(true);
    }, []);

    if (!loaded) return null;

    const favoriteTemples = items.filter((temple) =>
        favorites.includes(temple.slug)
    );

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <h1 className="mb-6 font-heading text-4xl font-semibold">
                Favorite Temples ❤️
            </h1>

            {favoriteTemples.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {favoriteTemples.map((temple) => (
                        <TempleCard key={temple.slug} temple={temple} />
                    ))}
                </div>
            ) : (
                <p className="text-brown">
                    You have not added any favorite temples yet.
                </p>
            )}
        </main>
    );
}