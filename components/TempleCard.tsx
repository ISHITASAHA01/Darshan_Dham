
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Clock, MapPin, ArrowRight, Heart } from "lucide-react";
import TempleIcon from "@/components/TempleIcon";
import ImageLightbox from "@/components/ImageLightbox";
import type { Temple } from "@/data/temples";
import { useLanguage } from "@/i18n/LanguageContext";
import { locName, locDeity, locState, locTimings } from "@/i18n/localize";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function TempleCard({ temple }: { temple: Temple }) {
    const { t, lang } = useLanguage();
    const router = useRouter();

    const image = temple.image;
    const name = locName(temple.slug, temple.name, lang);

    const [isFavorite, setIsFavorite] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    // Check login status and existing favorite
    useEffect(() => {
        let active = true;


        const checkFavorite = async () => {
            try {
                const supabase = createSupabaseBrowserClient();

                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession();

                if (sessionError) throw sessionError;

                if (!active) return;

                // Guest user: login nahi hai
                if (!session?.user) {
                    setUserId(null);
                    setIsFavorite(false);
                    return;
                }

                const user = session.user;

                setUserId(user.id);

                const { data, error } = await supabase
                    .from("user_favorites")
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("temple_slug", temple.slug)
                    .maybeSingle();

                if (error) throw error;

                if (active) {
                    setIsFavorite(!!data);
                }
            } catch (error) {
                console.error("Unable to load favorite:", error);
            }
        };


        checkFavorite();

        return () => {
            active = false;
        };
    }, [temple.slug]);

    // Add or remove favorite
    const toggleFavorite = async () => {
        if (!userId) {
            router.push("/login");
            return;
        }

        if (favoriteLoading) return;

        setFavoriteLoading(true);

        try {
            const supabase = createSupabaseBrowserClient();

            if (isFavorite) {
                const { error } = await supabase
                    .from("user_favorites")
                    .delete()
                    .eq("user_id", userId)
                    .eq("temple_slug", temple.slug);

                if (error) throw error;

                setIsFavorite(false);
            } else {
                const { error } = await supabase
                    .from("user_favorites")
                    .insert({
                        user_id: userId,
                        temple_slug: temple.slug,
                    });

                if (error) throw error;

                setIsFavorite(true);
            }
        } catch (error) {
            console.error("Favorite update failed:", error);
            alert("Unable to update favorite. Please try again.");
        } finally {
            setFavoriteLoading(false);
        }
    };

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-saffron-light bg-[var(--surface)] shadow-sm transition hover:shadow-lg">
            <div className="relative h-40 w-full bg-gradient-to-br from-saffron-light to-saffron/40">
                <button
                    type="button"
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                    aria-label={
                        isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }
                    aria-pressed={isFavorite}
                    title={
                        userId
                            ? isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            : "Login to add favorites"
                    }
                    className="absolute right-3 top-3 z-10 rounded-full bg-[var(--surface-soft)] p-2 shadow-md transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Heart
                        className={`h-5 w-5 ${isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-[var(--muted)]"
                            }`}
                    />
                </button>

                {image ? (
                    <ImageLightbox
                        src={image}
                        alt={name}
                        className="relative block h-full w-full"
                    >
                        <Image
                            src={image}
                            alt={`${name} temple`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                            loading="lazy"
                            quality={75}
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
                    {locDeity(temple.deity, lang)} •{" "}
                    {locState(temple.state, lang)}
                </p>

                <p className="flex items-start gap-2 text-xs text-brown">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {locTimings(temple.timings, lang)}
                </p>

                <Link
                    href={`/temples/${temple.slug}`}
                    className="mt-auto flex items-center justify-center gap-1 rounded-md border border-saffron py-2 text-sm font-medium text-saffron transition hover:bg-saffron hover:text-white"
                >
                    {t("view_details")}{" "}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
