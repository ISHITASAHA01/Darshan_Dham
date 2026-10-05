"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";

export default function SectionHeader({
    titleKey,
    subKey,
    linkKey,
    href,
}: {
    titleKey: string;
    subKey: string;
    linkKey: string;
    href: string;
}) {
    const { t } = useLanguage();
    return (
        <div className="mb-6 flex items-end justify-between gap-4">
            <div>
                <h2 className="font-heading text-3xl font-semibold">{t(titleKey)}</h2>
                <p className="text-sm text-brown">{t(subKey)}</p>
            </div>
            <Link href={href} className="shrink-0 text-sm text-saffron hover:underline">
                {t(linkKey)} →
            </Link>
        </div>
    );
}