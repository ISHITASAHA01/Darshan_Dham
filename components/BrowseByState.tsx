"use client";

import Link from "next/link";
import { states } from "@/data/temples";
import SectionHeader from "./SectionHeader";
import { useLanguage } from "@/i18n/LanguageContext";
import { locState } from "@/i18n/localize";

export default function BrowseByState() {
    const { t, lang } = useLanguage();

    return (
        <section className="mx-auto max-w-7xl px-6 pb-16">
            <SectionHeader
                titleKey="browse_by_state"
                subKey="browse_by_state_sub"
                linkKey="view_all_states"
                href="/states"
            />

            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {states.map((s) => (
                    <Link
                        key={s.name}
                        href={`/states/${s.slug}`}
                        className="rounded-xl border border-saffron-light bg-white p-4 text-center transition hover:border-saffron hover:shadow-md"
                    >
                        <p className="font-medium text-foreground">{locState(s.name, lang)}</p>
                        <p className="text-xs text-brown">{t("count_temples", { n: s.count })}</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}