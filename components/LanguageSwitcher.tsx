"use client";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "ur", label: "اردو" },
    { code: "bn", label: "বাংলা" },
    { code: "ta", label: "தமிழ்" },
];

export default function LanguageSwitcher() {
    const [lang, setLang] = useState("en");

    // Page reload ke baad Google Translate ki cookie se selected language wapas dikhao
    useEffect(() => {
        const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
        if (match && languages.some((l) => l.code === match[1])) {
            setLang(match[1]);
        }
    }, []);

    const handleLanguageChange = (code: string) => {
        setLang(code);
        window.setGoogleTranslateLanguage?.(code);
    };

    return (
        <div className="notranslate flex items-center gap-1 rounded-full border border-saffron-light px-2 py-1">
            <Globe className="h-4 w-4 text-brown" />

            <select
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value)}
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
