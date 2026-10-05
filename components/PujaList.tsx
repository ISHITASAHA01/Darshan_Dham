"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { templeTranslations } from "@/i18n/templeTranslations";
import { locPuja, locTimings } from "@/i18n/localize";

type Puja = { name: string; time: string };

export default function PujaList({
    slug,
    pujas,
}: {
    slug: string;
    pujas: Puja[];
}) {
    const { lang } = useLanguage();
    const tr = lang === "en" ? undefined : templeTranslations[slug]?.[lang];
    // Agar is mandir ka hand-made translation hai to wo, nahi to naam + time apne aap badlenge
    const finalPujas = tr?.pujas ?? pujas.map((p) => ({ name: locPuja(p.name, lang), time: p.time }));

    return (
        <ul className="divide-y divide-saffron-light text-sm">
            {finalPujas.map((p, i) => (
                <li key={i} className="flex justify-between gap-3 py-2">
                    <span className="text-foreground">{p.name}</span>
                    <span className="shrink-0 text-brown">{locTimings(p.time, lang)}</span>
                </li>
            ))}
        </ul>
    );
}