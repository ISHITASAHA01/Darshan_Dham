"use client";

import { ExternalLink, CalendarDays, Train, Plane, Ticket, Shirt } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { templeExtras } from "@/data/templeExtras";

export default function VisitInfo({ slug }: { slug: string }) {
    const { t } = useLanguage();
    const x = templeExtras[slug];
    if (!x) return null;

    const rows = [
        { icon: CalendarDays, label: t("best_time"), value: x.bestTime },
        { icon: Train, label: t("nearest_railway"), value: x.nearestRailway },
        { icon: Plane, label: t("nearest_airport"), value: x.nearestAirport },
        { icon: Ticket, label: t("entry_fee"), value: x.entryFee },
        { icon: Shirt, label: t("dress_code"), value: x.dressCode },
    ].filter((r) => r.value);

    if (rows.length === 0 && !x.website) return null;

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

            {x.website && (
                <a
                    href={x.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-md border border-saffron py-2 text-sm font-medium text-saffron transition hover:bg-saffron hover:text-white"
                >
                    <ExternalLink className="h-4 w-4" /> {t("official_website")}
                </a>
            )}

            {x.checked && (
                <p className="mt-3 text-xs text-brown/70">
                    {t("checked_on", { date: x.checked })}
                </p>
            )}
        </div>
    );
}