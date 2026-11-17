"use client";

import { createContext, useContext } from "react";
import { dictionary, type Lang } from "./dictionary";
import { moreText } from "./moreText";

// Site ki language badalne ka kaam sirf Navbar ke Google Translate selector
// (components/LanguageSwitcher.tsx + GoogleTranslate.tsx) karta hai.
// Yahan sirf English text rakha hai, jise Google Translate aage translate karta hai.

type ContextType = {
    lang: Lang;
    t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<ContextType | null>(null);

const lang: Lang = "en";

// t("key") ya t("key", { name: "Delhi" })  ->  text me {name} ki jagah value aa jayegi
const t = (key: string, vars?: Record<string, string | number>): string => {
    let s = dictionary.en?.[key as keyof typeof dictionary.en] ?? moreText.en[key] ?? key;
    if (vars) {
        for (const k of Object.keys(vars)) {
            s = s.split(`{${k}}`).join(String(vars[k]));
        }
    }
    return s;
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    return (
        <LanguageContext.Provider value={{ lang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
    return ctx;
}
