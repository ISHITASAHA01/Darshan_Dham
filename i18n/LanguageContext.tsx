"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionary, type Lang } from "./dictionary";
import { moreText } from "./moreText";

type ContextType = {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<ContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState<Lang>("en");

    // Pehli baar load hote hi, browser me saved language uthao
    useEffect(() => {
        const saved = localStorage.getItem("mndir-lang") as Lang | null;
        if (saved && dictionary[saved]) setLangState(saved);
    }, []);

    // Language badalte hi save karo, aur Urdu ke liye right-to-left lagao
    useEffect(() => {
        localStorage.setItem("mndir-lang", lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    }, [lang]);

    const setLang = (l: Lang) => setLangState(l);

    // t("key") ya t("key", { name: "Delhi" })  ->  text me {name} ki jagah value aa jayegi
    const t = (key: string, vars?: Record<string, string | number>): string => {
        const d = dictionary as Record<string, Record<string, string>>;
        let s =
            d[lang]?.[key] ??
            moreText[lang]?.[key] ??
            d.en?.[key] ??
            moreText.en[key] ??
            key;
        if (vars) {
            for (const k of Object.keys(vars)) {
                s = s.split(`{${k}}`).join(String(vars[k]));
            }
        }
        return s;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
    return ctx;
}