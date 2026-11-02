"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { locState } from "@/i18n/localize";

export default function StateHeader({ stateName }: { stateName: string }) {
    const { t, lang } = useLanguage();
    const name = locState(stateName, lang);
    return (
        <>
            <h1 className="font-heading text-4xl font-semibold">{name}</h1>
            <p className="mb-8 text-brown">{t("explore_in_state", { state: name })}</p>
        </>
    );
}