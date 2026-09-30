"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dictionary, type Lang } from "./dictionary";

type ContextType = {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (key: string) => string;
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

    // const t = (key: keyof typeof dictionary["en"]) =>
    //     dictionary[lang][key] ?? dictionary.en[key];
    const t = (key: string): string =>
        (dictionary[lang] as Record<string, string>)[key] ??
        (dictionary.en as Record<string, string>)[key] ??
        key;

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