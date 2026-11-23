
"use client";

import { useEffect, useState } from "react";
import type { Temple } from "@/data/temples";
import TempleCard from "@/components/TempleCard";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function FavoritesClient({
    items,
}: {
    items: Temple[];
}) {
    const router = useRouter();

    const [favorites, setFavorites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadFavorites = async () => {
            try {
                const supabase = createSupabaseBrowserClient();

                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (!session?.user) {
                    router.push("/login");
                    return;
                }

                const { data, error } = await supabase
                    .from("user_favorites")
                    .select("temple_slug")
                    .eq("user_id", session.user.id);

                if (error) throw error;

                if (active) {
                    const favoriteSlugs: string[] = (data ?? []).map(
                        (item: { temple_slug: string }) => item.temple_slug
                    );

                    setFavorites(favoriteSlugs);
                }
            } catch (error) {
                console.error("Unable to load favorites:", error);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadFavorites();

        return () => {
            active = false;
        };
    }, [router]);

    const favoriteTemples = items.filter((temple) =>
        favorites.includes(temple.slug)
    );

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-6 py-12">
                <p className="text-brown">Loading favorites...</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <h1 className="mb-6 font-heading text-4xl font-semibold text-foreground">
                Favorite Temples ❤️
            </h1>

            {favoriteTemples.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {favoriteTemples.map((temple) => (
                        <TempleCard
                            key={temple.slug}
                            temple={temple}
                        />
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
