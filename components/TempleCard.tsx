"use client";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import TempleIcon from "@/components/TempleIcon";
import type { Temple } from "@/data/temples";
import { useLanguage } from "@/i18n/LanguageContext";

export default function TempleCard({ temple }: { temple: Temple }) {
    const { t } = useLanguage();
    const image = temple.image; // ab fs wala function yahan nahi chalega

    return (
        <div className="flex flex-col overflow-hidden rounded-xl border border-saffron-light bg-white shadow-sm transition hover:shadow-lg">
            <div className="relative h-40 w-full bg-gradient-to-br from-saffron-light to-saffron/40">
                {image ? (
                    <Image
                        src={image}
                        alt={temple.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 20vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <TempleIcon className="h-14 w-14 text-saffron-dark/60" />
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="flex items-start gap-1 font-semibold text-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron" />
                    {temple.name}
                </h3>
                <p className="text-xs text-brown">
                    {temple.deity} • {temple.state}
                </p>
                <p className="flex items-start gap-2 text-xs text-brown">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {temple.timings}
                </p>

                <Link
                    href={`/temples/${temple.slug}`}
                    className="mt-auto flex items-center justify-center gap-1 rounded-md border border-saffron py-2 text-sm font-medium text-saffron transition hover:bg-saffron hover:text-white"
                >
                    {t("view_details")} <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}