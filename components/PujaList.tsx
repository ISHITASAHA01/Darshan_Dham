"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { templeTranslations } from "@/i18n/templeTranslations";

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
    const finalPujas = tr?.pujas ?? pujas;

    return (
        <ul className="divide-y divide-saffron-light text-sm">
            {finalPujas.map((p, i) => (
                <li key={i} className="flex justify-between py-2">
                    <span className="text-foreground">{p.name}</span>
                    <span className="text-brown">{p.time}</span>
                </li>
            ))}
        </ul>
    );
}