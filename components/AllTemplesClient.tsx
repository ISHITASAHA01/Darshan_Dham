
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
    "rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--color-saffron)] focus:ring-2 focus:ring-[var(--color-saffron)]/20";

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

    const deityCounts = new Map<DeityGroup, number>();
    for (const tp of items) {
        const g = deityGroup(tp.deity);
        deityCounts.set(g, (deityCounts.get(g) ?? 0) + 1);
    }

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
        <main className="mx-auto max-w-7xl px-4 py-10 text-[var(--foreground)] sm:px-6 sm:py-12">
            <div className="mb-7">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-saffron)]">
                    Discover Sacred Places
                </p>

                <h1 className="font-heading text-3xl font-semibold text-[var(--foreground)] sm:text-4xl">
                    {t("all_temples")}
                </h1>

                <p className="mt-3 text-sm text-[var(--muted)]">
                    {t("temples_count", { shown: list.length, total: items.length })}
                    {state && ` ${t("in_state", { state: locState(state, lang) })}`}
                    {deity && ` · ${t(`deity_${deity}`)}`}
                    {q && ` ${t("matching", { q })}`}
                </p>
            </div>

            <form
                onSubmit={(e) => e.preventDefault()}
                className="mb-9 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm sm:p-4"
            >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="flex min-h-[46px] flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4">
                        <Search className="h-5 w-5 shrink-0 text-[var(--color-saffron)]" />

                        <input
                            type="text"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={t("temple_search_ph")}
                            className="w-full bg-transparent py-3 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
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
                            className="rounded-xl border border-[var(--color-saffron)] px-4 py-3 text-sm font-semibold text-[var(--color-saffron)] transition hover:bg-[var(--color-saffron)] hover:text-white"
                        >
                            {t("clear_filters")}
                        </button>
                    )}
                </div>
            </form>

            {list.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {list.map((tp) => (
                        <TempleCard key={tp.slug} temple={tp} />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-12 text-center">
                    <Search className="mx-auto mb-4 h-9 w-9 text-[var(--color-saffron)]" />

                    <p className="font-semibold text-[var(--foreground)]">
                        {t("no_temples")}
                    </p>

                    <p className="mt-2 text-sm text-[var(--muted)]">
                        {t("try_different")}
                    </p>

                    <Link
                        href="/temples"
                        onClick={clearAll}
                        className="mt-5 inline-block rounded-xl bg-[var(--color-saffron)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-saffron-dark)]"
                    >
                        {t("show_all_temples")}
                    </Link>
                </div>
            )}
        </main>
    );
}
