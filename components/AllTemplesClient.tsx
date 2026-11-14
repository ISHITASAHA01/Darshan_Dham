"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { Temple } from "@/data/temples";
import TempleCard from "@/components/TempleCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { locState, templeSearchText } from "@/i18n/localize";
import { DEITY_GROUPS, deityGroup, type DeityGroup } from "@/lib/deity";

type Sort = "default" | "az" | "za";

const selectClass =
    "rounded-md border border-saffron-light bg-white px-3 py-2 text-sm outline-none";

export default function AllTemplesClient({
    items,
    states,
    initialQ,
    initialState,
}: {
    items: Temple[];
    states: { name: string; slug: string }[];
    initialQ: string;
    initialState: string;
}) {
    const { t, lang } = useLanguage();
    const [q, setQ] = useState(initialQ);
    const [state, setState] = useState(initialState);
    const [deity, setDeity] = useState<DeityGroup | "">("");
    const [sort, setSort] = useState<Sort>("default");

    const query = q.trim().toLowerCase();

    // Har deity group me kitne mandir hain (dropdown me count dikhane ke liye)
    const deityCounts = new Map<DeityGroup, number>();
    for (const tp of items) {
        const g = deityGroup(tp.deity);
        deityCounts.set(g, (deityCounts.get(g) ?? 0) + 1);
    }

    // Search English, Hindi, Bengali, Urdu - kisi bhi bhasha me likho, mandir mil jayega
    const filtered = items.filter((tp) => {
        const okState = !state || tp.state === state;
        const okDeity = !deity || deityGroup(tp.deity) === deity;
        const okText = !query || templeSearchText(tp).includes(query);
        return okState && okDeity && okText;
    });

    const list =
        sort === "default"
            ? filtered
            : [...filtered].sort((a, b) =>
                sort === "az"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
            );

    const hasFilters = q !== "" || state !== "" || deity !== "" || sort !== "default";

    function clearAll() {
        setQ("");
        setState("");
        setDeity("");
        setSort("default");
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <h1 className="font-heading text-4xl font-semibold">{t("all_temples")}</h1>
            <p className="mb-6 text-brown">
                {t("temples_count", { shown: list.length, total: items.length })}
                {state && ` ${t("in_state", { state: locState(state, lang) })}`}
                {deity && ` · ${t(`deity_${deity}`)}`}
                {q && ` ${t("matching", { q })}`}
            </p>

            <form
                onSubmit={(e) => e.preventDefault()}
                className="mb-8 flex flex-col gap-3 rounded-lg border border-saffron-light bg-white p-3 lg:flex-row lg:items-center"
            >
                <div className="flex flex-1 items-center gap-2 px-2">
                    <Search className="h-5 w-5 shrink-0 text-brown" />
                    <input
                        type="text"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder={t("temple_search_ph")}
                        className="w-full py-2 text-sm outline-none"
                    />
                </div>

                <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={selectClass}
                    aria-label={t("hero_all_states")}
                >
                    <option value="">{t("hero_all_states")}</option>
                    {states.map((s) => (
                        <option key={s.slug} value={s.name}>
                            {locState(s.name, lang)}
                        </option>
                    ))}
                </select>

                <select
                    value={deity}
                    onChange={(e) => setDeity(e.target.value as DeityGroup | "")}
                    className={selectClass}
                    aria-label={t("all_deities")}
                >
                    <option value="">{t("all_deities")}</option>
                    {DEITY_GROUPS.filter((g) => deityCounts.get(g.id)).map((g) => (
                        <option key={g.id} value={g.id}>
                            {t(`deity_${g.id}`)} ({deityCounts.get(g.id)})
                        </option>
                    ))}
                </select>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    className={selectClass}
                    aria-label={t("sort_default")}
                >
                    <option value="default">{t("sort_default")}</option>
                    <option value="az">{t("sort_az")}</option>
                    <option value="za">{t("sort_za")}</option>
                </select>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={clearAll}
                        className="rounded-md border border-saffron px-4 py-2 text-sm font-medium text-saffron transition hover:bg-saffron hover:text-white"
                    >
                        {t("clear_filters")}
                    </button>
                )}
            </form>

            {list.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {list.map((tp) => (
                        <TempleCard key={tp.slug} temple={tp} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-saffron/50 p-10 text-center">
                    <p className="font-medium">{t("no_temples")}</p>
                    <p className="mt-1 text-sm text-brown">{t("try_different")}</p>
                    <Link
                        href="/temples"
                        onClick={clearAll}
                        className="mt-4 inline-block text-sm text-saffron hover:underline"
                    >
                        {t("show_all_temples")}
                    </Link>
                </div>
            )}
        </main>
    );
}