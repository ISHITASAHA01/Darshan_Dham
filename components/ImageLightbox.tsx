"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

/*
 * Photo pe click karte hi poori photo bade size me khulti hai.
 * Band karne ke liye: bahar click karo, X dabao, ya Esc dabao.
 */
export default function ImageLightbox({
    src,
    alt,
    className = "",
    children,
}: {
    src: string;
    alt: string;
    className?: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`${t("view_photo")}: ${alt}`}
                title={t("view_photo")}
                className={`cursor-zoom-in ${className}`}
            >
                {children}
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={alt}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
                >
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label={t("close")}
                        className="absolute right-4 top-4 z-10 rounded-full bg-white/15 p-2 text-white hover:bg-white/30"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div
                        className="relative h-[85vh] w-[94vw] max-w-6xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            sizes="94vw"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/85">
                        {alt}
                    </p>
                </div>
            )}
        </>
    );
}