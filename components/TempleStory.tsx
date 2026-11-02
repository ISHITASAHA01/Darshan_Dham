"use client";

import { Info } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { templeTranslations } from "@/i18n/templeTranslations";

export default function TempleStory({
    slug,
    story,
    note,
}: {
    slug: string;
    story: string;
    note?: string;
}) {
    const { lang } = useLanguage();
    const tr = lang === "en" ? undefined : templeTranslations[slug]?.[lang];

    const finalStory = tr?.story ?? story;
    const finalNote = tr?.note ?? note;

    return (
        <>
            <p className="leading-relaxed text-brown">{finalStory}</p>
            {finalNote && (
                <div className="mt-6 flex gap-3 rounded-lg border border-saffron/40 bg-saffron-light/50 p-4 text-sm text-brown">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-saffron-dark" />
                    {finalNote}
                </div>
            )}
        </>
    );
}