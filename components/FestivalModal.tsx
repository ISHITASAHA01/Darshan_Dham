"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, X, Sparkles, ArrowRight } from "lucide-react";
import FestivalVisual from "@/components/FestivalVisual";
import { daysFromToday, getFestivalInfo, type Festival } from "@/lib/festivals";

/**
 * "Know More" popup. Festival ki photo, tithi, devta, mahatva aur kya karna chahiye.
 * Mobile par neeche se upar aane wali sheet, desktop par beech me card.
 */
export default function FestivalModal({
    festival,
    onClose,
    onViewPanchang,
}: {
    festival: Festival | null;
    onClose: () => void;
    onViewPanchang?: (iso: string) => void;
}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Esc se band, aur peeche ka page scroll na ho
    useEffect(() => {
        if (!festival) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [festival, onClose]);

    if (!mounted || !festival) return null;

    const info = getFestivalInfo(festival.name);
    const diff = daysFromToday(festival.date);
    const when = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : diff > 1 ? `In ${diff} days` : "Date has passed";
    const longDate = new Date(`${festival.date}T12:00:00`).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label={festival.name}
                onClick={(e) => e.stopPropagation()}
                className="dd-modal-in relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-2xl sm:max-w-xl sm:rounded-[1.75rem]"
            >
                {/* photo */}
                <div className="relative h-44 shrink-0 sm:h-56">
                    <FestivalVisual name={festival.name} banner sizes="(max-width:640px) 100vw, 576px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition hover:bg-black/70"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <span className="absolute left-4 top-4 rounded-full bg-[#d68b2e] px-3 py-1 text-xs font-bold text-white shadow">
                        {when}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                        <h3 className="font-heading text-2xl font-bold leading-tight sm:text-3xl">{festival.name}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85 sm:text-sm">
                            <CalendarDays className="h-4 w-4" />{longDate}
                        </p>
                    </div>
                </div>

                {/* jaankari (zyada ho to yahin scroll hoga) */}
                <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                    <p className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-saffron)]/15 px-3 py-1 text-xs font-bold text-[var(--color-saffron-dark)]">
                        <Sparkles className="h-3.5 w-3.5" />{info.deity}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-[15px] sm:leading-7">{info.about}</p>

                    <h4 className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-saffron-dark)]">
                        What you can do
                    </h4>
                    <ul className="mt-2 space-y-2">
                        {info.todo.map((t) => (
                            <li key={t} className="flex gap-2.5 text-sm leading-6">
                                <i className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--color-saffron)]" />
                                <span>{t}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-5 text-xs text-[var(--muted)]">
                        Dates follow the Delhi panchang, so your local temple may differ by a day.
                    </p>
                </div>

                {/* buttons */}
                <div className="flex shrink-0 gap-3 border-t border-[var(--border)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
                    {onViewPanchang && (
                        <button
                            onClick={() => { onViewPanchang(festival.date); onClose(); }}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e8a23a] to-[#d68b2e] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-110 active:scale-[0.98]"
                        >
                            View Panchang <ArrowRight className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface-soft)]"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}