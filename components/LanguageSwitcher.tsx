"use client";

import { Globe } from "lucide-react";
import { languages } from "@/i18n/dictionary";
import { useLanguage } from "@/i18n/LanguageContext";

export default function LanguageSwitcher() {
    const { lang, setLang } = useLanguage();

    return (
        <div className="flex items-center gap-1 rounded-full border border-saffron-light px-2 py-1">
            <Globe className="h-4 w-4 text-brown" />
            <select
                value={lang}
                onChange={(e) => setLang(e.target.value as typeof lang)}
                className="bg-transparent text-sm outline-none"
            >
                {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                        {l.label}
                    </option>
                ))}
            </select>
        </div>
    );
}