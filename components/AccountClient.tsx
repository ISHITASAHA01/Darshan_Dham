"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Temple } from "@/data/temples";

type Props = {
    items: Temple[];
};

export default function AccountClient({ items }: Props) {
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [recentViews, setRecentViews] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadAccount() {
            try {
                const supabase = createSupabaseBrowserClient();

                const { data: { user }, error: authError } =
                    await supabase.auth.getUser();

                if (authError || !user) {
                    router.replace("/login");
                    return;
                }

                setUser(user);

                const [favoriteResult, recentResult] = await Promise.all([
                    supabase
                        .from("user_favorites")
                        .select("temple_slug")
                        .eq("user_id", user.id),

                    supabase
                        .from("recent_views")
                        .select("temple_slug, viewed_at")
                        .eq("user_id", user.id)
                        .order("viewed_at", { ascending: false })
                        .limit(10),
                ]);

                if (favoriteResult.error) throw favoriteResult.error;
                if (recentResult.error) throw recentResult.error;

                setFavorites(
                    (favoriteResult.data ?? []).map((item: { temple_slug: string }) => item.temple_slug)
                );

                setRecentViews(
                    (recentResult.data ?? []).map(((item: { temple_slug: string }) => item.temple_slug))
                );
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong.");
            } finally {
                setLoading(false);
            }
        }

        loadAccount();
    }, [router]);

    async function handleLogout() {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.replace("/login");
        router.refresh();
    }

    const favoriteTemples = items.filter((temple) =>
        favorites.includes(temple.slug)
    );

    const recentlyViewedTemples = recentViews
        .map((slug) => items.find((temple) => temple.slug === slug))
        .filter((temple): temple is Temple => Boolean(temple));

    if (loading) {
        return (
            <main className="min-h-[65vh] flex items-center justify-center">
                <p className="text-[#9a6b35]">Loading your account...</p>
            </main>
        );
    }

    return (
        <main className="min-h-[75vh] bg-[var(--background)] px-4 py-10 text-[var(--foreground)] sm:px-6">
            <div className="mx-auto max-w-6xl">
                {/* <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#ead8bd] bg-white p-6 shadow-sm"> */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
                    <div>
                        {/* <p className="text-sm text-[#a16b32]">Welcome back,</p> */}


                        <p className="text-sm text-[var(--color-saffron)]">Welcome back,</p>
                        <h1 className="mt-1 text-2xl font-bold">
                            {user?.user_metadata?.full_name || "Devotee"}
                        </h1>
                        {/* <p className="mt-1 text-sm text-gray-500">{user?.email}</p> */}

                        <p className="mt-1 text-sm text-[var(--muted)]">{user?.email}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-xl bg-[#8b3f24] px-5 py-3 text-sm font-semibold text-white hover:bg-[#71321d]"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <p className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </p>
                )}

                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    {/* <div className="rounded-2xl border border-[#ead8bd] bg-white p-5"> */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                        <p className="text-sm text-gray-500">Favorite Temples</p>
                        <p className="mt-2 text-3xl font-bold text-[#a45b25]">
                            {favorites.length}
                        </p>
                    </div>

                    {/* <div className="rounded-2xl border border-[#ead8bd] bg-white p-5"> */}
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                        <p className="text-sm text-gray-500">Recently Viewed</p>
                        <p className="mt-2 text-3xl font-bold text-[#a45b25]">
                            {recentViews.length}
                        </p>
                    </div>
                </div>

                <section className="mb-10">
                    <h2 className="mb-5 text-xl font-bold">❤️ My Favorite Temples</h2>

                    {favoriteTemples.length === 0 ? (
                        // <p className="rounded-2xl bg-white p-6 text-gray-500">
                        <p className="rounded-2xl bg-[var(--surface)] p-6 text-[var(--muted)]">
                            You have not saved any temples yet.
                        </p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {favoriteTemples.map((temple) => (
                                <Link
                                    key={temple.slug}
                                    href={`/temples/${temple.slug}`}
                                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:shadow-md"
                                >
                                    <h3 className="font-semibold">{temple.name}</h3>
                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        {temple.city}, {temple.state}
                                    </p>
                                    {/* <span className="mt-3 inline-block text-sm text-[#a45b25]"> */}
                                    <span className="mt-3 inline-block text-sm text-[var(--color-saffron)]">
                                        View Temple →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="mb-5 text-xl font-bold">🕉️ Recently Viewed Temples</h2>

                    {recentlyViewedTemples.length === 0 ? (
                        // <p className="rounded-2xl bg-white p-6 text-gray-500">
                        <p className="rounded-2xl bg-[var(--surface)] p-6 text-[var(--muted)]">
                            Your recently viewed temples will appear here.
                        </p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {recentlyViewedTemples.map((temple) => (
                                <Link
                                    key={temple.slug}
                                    href={`/temples/${temple.slug}`}
                                    className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:shadow-md"
                                >
                                    <h3 className="font-semibold">{temple.name}</h3>
                                    {/* <p className="mt-1 text-sm text-gray-500"> */}
                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        {temple.city}, {temple.state}
                                    </p>
                                    <span className="mt-3 inline-block text-sm text-[var(--color-saffron)]">
                                        View Temple →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div >
        </main >
    );
}