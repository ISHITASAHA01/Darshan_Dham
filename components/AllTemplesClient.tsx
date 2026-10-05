"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { states, type Temple } from "@/data/temples";
import TempleCard from "@/components/TempleCard";
import { useLanguage } from "@/i18n/LanguageContext";
import { locState, templeSearchText } from "@/i18n/localize";

export default function AllTemplesClient({
    items,
    initialQ,
    initialState,
}: {
    items: Temple[];
    initialQ: string;
    initialState: string;
}) {
    const { t, lang } = useLanguage();
    const [q, setQ] = useState(initialQ);
    const [state, setState] = useState(initialState);

    const query = q.trim().toLowerCase();
    // Search English, Hindi, Bengali, Urdu - kisi bhi bhasha me likho, mandir mil jayega
    const list = items.filter((tp) => {
        const okState = !state || tp.state === state;
        const okText = !query || templeSearchText(tp).includes(query);
        return okState && okText;
    });

    return (
        <main className="mx-auto max-w-7xl px-6 py-12">
            <h1 className="font-heading text-4xl font-semibold">{t("all_temples")}</h1>
            <p className="mb-6 text-brown">
                {t("temples_count", { shown: list.length, total: items.length })}
                {state && ` ${t("in_state", { state: locState(state, lang) })}`}
                {q && ` ${t("matching", { q })}`}
            </p>

            <form
                onSubmit={(e) => e.preventDefault()}
                className="mb-8 flex flex-col gap-3 rounded-lg border border-saffron-light bg-white p-3 sm:flex-row"
            >
                <div className="flex flex-1 items-center gap-2 px-2">
                    <Search className="h-5 w-5 text-brown" />
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
                    className="rounded-md border border-saffron-light px-3 py-2 text-sm outline-none"
                >
                    <option value="">{t("hero_all_states")}</option>
                    {states.map((s) => (
                        <option key={s.slug} value={s.name}>
                            {locState(s.name, lang)}
                        </option>
                    ))}
                </select>
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
                        onClick={() => {
                            setQ("");
                            setState("");
                        }}
                        className="mt-4 inline-block text-sm text-saffron hover:underline"
                    >
                        {t("show_all_temples")}
                    </Link>
                </div>
            )}
        </main>
    );
}