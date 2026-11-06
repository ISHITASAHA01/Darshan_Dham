"use client";

import { ExternalLink, CalendarDays, Train, Plane, Ticket, Shirt } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import type { TempleFull } from "@/lib/temple-types";

export default function VisitInfo({ temple }: { temple: TempleFull }) {
    const { t } = useLanguage();

    const rows = [
        { icon: CalendarDays, label: t("best_time"), value: temple.bestTime },
        { icon: Train, label: t("nearest_railway"), value: temple.nearestRailway },
        { icon: Plane, label: t("nearest_airport"), value: temple.nearestAirport },
        { icon: Ticket, label: t("entry_fee"), value: temple.entryFee },
        { icon: Shirt, label: t("dress_code"), value: temple.dressCode },
    ].filter((r) => r.value);

    if (rows.length === 0 && !temple.website) return null;

    return (
        <div className="rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
            <h3 className="mb-3 font-semibold">{t("visit_info")}</h3>

            <ul className="space-y-3 text-sm">
                {rows.map(({ icon: Icon, label, value }) => (
                    <li key={label} className="flex gap-3">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
                        <div>
                            <p className="text-xs text-brown/70">{label}</p>
                            <p className="text-foreground">{value}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {temple.website && (
                <a
                    href={temple.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-md border border-saffron py-2 text-sm font-medium text-saffron transition hover:bg-saffron hover:text-white"
                >
                    <ExternalLink className="h-4 w-4" /> {t("official_website")}
                </a>
            )}

            {temple.checked && (
                <p className="mt-3 text-xs text-brown/70">
                    {t("checked_on", { date: temple.checked })}
                </p>
            )}
        </div>
    );
}