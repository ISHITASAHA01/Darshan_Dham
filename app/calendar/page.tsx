"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays, ChevronLeft, ChevronRight, ArrowRight,
    Sun, Sunset, Moon, MoonStar, MapPin, Sparkles,
} from "lucide-react";
import FestivalVisual from "@/components/FestivalVisual";
import { FestivalCountdown, MeditationTimer, DigitalMala } from "@/components/home/HomeExtras";
import { FESTIVALS, getUpcoming } from "@/lib/festivals";
import SafeImage from "@/components/SafeImage";

/* ------------------------------------------------------------------ */
/*  1. IMAGES — apni images ke naam yahin badlo (public/ folder ke andar) */
/* ------------------------------------------------------------------ */
const IMG = {
    logo: "/images/logo/logo.png",
    heroLight: "/images/calendar/hero-light.jpg",
    heroDark: "/images/calendar/hero-dark.jpg",
    shivaLight: "/images/calendar/deities/shiva.png",
    shivaDark: "/images/calendar/deities/shiva-dark.png",
    sidebarLight: "/images/calendar/sidebar-temple.png",
    sidebarDark: "/images/calendar/sidebar-temple-dark.png",
    footerLight: "/images/calendar/footer-temple.png",
    footerDark: "/images/calendar/footer-temple-dark.png",
};

const NAV = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Temples", href: "/temples", icon: "🛕" },
    { name: "States", href: "/states", icon: "🇮🇳" },
    { name: "Calendar", href: "/calendar", icon: "📅" },
    { name: "Favorites", href: "/favorites", icon: "❤️" },
    { name: "Account", href: "/account", icon: "👤" },
    { name: "Contact", href: "/contact", icon: "✉️" },
];

const CITIES = [
    "Delhi", "Kolkata", "Mumbai", "Bengaluru", "Chennai", "Hyderabad", "Ahmedabad", "Pune",
    "Jaipur", "Varanasi", "Lucknow", "Patna", "Bhopal", "Indore", "Chandigarh", "Ayodhya",
    "Mathura", "Haridwar", "Ujjain", "Nagpur", "Surat", "Bhubaneswar", "Guwahati", "Ranchi",
    "Amritsar", "Kochi",
].map((name) => ({
    name,
    id: name === "Bengaluru" ? "bangalore" : name.toLowerCase(),
}));

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Mode = "hindu" | "bengali";
type Tab = "panchang" | "countdown" | "meditation";

const TABS: { id: Tab; label: string }[] = [
    { id: "panchang", label: "🗓️ Panchang" },
    { id: "countdown", label: "⏳ Festival Countdown" },
    { id: "meditation", label: "🧘 Meditation and Mala" },
];

/* ------------------------------ helpers ------------------------------ */
const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function normalize(res: any): any {
    let cur = res;
    for (let i = 0; i < 6; i++) {
        if (!cur || typeof cur !== "object") break;
        if (cur.calendars || cur.festivals || cur.udaya_tithi || cur.tithi || cur.sun) return cur;
        if (cur.data && typeof cur.data === "object") { cur = cur.data; continue; }
        break;
    }
    return cur ?? {};
}

const nested = (data: any, path: string) => path.split(".").reduce((v, k) => v?.[k], data);

function getFirst(data: any, paths: string[]): string {
    for (const p of paths) {
        const v = nested(data, p);
        if (v === undefined || v === null || v === "") continue;
        if (typeof v === "string" || typeof v === "number") return String(v);
        if (typeof v === "object" && !Array.isArray(v)) {
            const t = v.name ?? v.value ?? v.time ?? v.start;
            if (t !== undefined && t !== null) return String(t);
        }
    }
    return "—";
}

function getFestivalNames(data: any): string[] {
    const f = data?.festivals;
    const list: any[] = Array.isArray(f) ? f : Array.isArray(f?.data) ? f.data : Array.isArray(f?.festivals) ? f.festivals : [];
    return list.map((x) => (typeof x === "string" ? x : x?.name ?? x?.title ?? "")).filter(Boolean);
}

/* "21-11-2026 06:48:17" -> "06:48 AM" */
function fmtTime(v: string): string {
    const m = v.match(/(\d{1,2}):(\d{2})/);
    if (!m) return v;
    let h = parseInt(m[1], 10);
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${m[2]} ${ap}`;
}

const prettyDate = (iso: string) =>
    new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* ------------------------------ styles ------------------------------- */
const card =
    "rounded-3xl border border-amber-200/70 bg-white/80 shadow-[0_8px_30px_rgba(180,110,30,0.10)] backdrop-blur " +
    "dark:border-amber-400/20 dark:bg-[#1b2b3c]/80 dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]";
const muted = "text-[#7a6650] dark:text-[#b9ad9a]";
const accent = "text-[#c9761a] dark:text-[#f3b552]";

/* ============================== PAGE =============================== */
export default function CalendarPage() {
    const today = useMemo(() => new Date(), []);
    const [mode, setMode] = useState<Mode>("hindu");
    const [tab, setTab] = useState<Tab>("panchang");
    const [city, setCity] = useState("delhi");
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(fmt(today));
    const [isDark, setIsDark] = useState(false);

    const [panchang, setPanchang] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* theme */
    useEffect(() => {
        const dark = localStorage.getItem("theme") === "dark";
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
    }, []);

    function toggleTheme() {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    }

    /* panchang fetch */
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true); setError(""); setPanchang(null);
            try {
                const res = await fetch("/api/panchang", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ date: selectedDate, city_id: city }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || json.message || "Unable to load Panchang.");
                if (!cancelled) setPanchang(json);
            } catch (e: any) {
                if (!cancelled) setError(e.message || "Unable to load Panchang.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [selectedDate, city]);

    /* calendar cells (pichle/agle mahine ke dim din bhi) */
    const cells = useMemo(() => {
        const first = new Date(year, month, 1);
        const start = new Date(year, month, 1 - first.getDay());
        const total = Math.ceil((first.getDay() + new Date(year, month + 1, 0).getDate()) / 7) * 7;
        return Array.from({ length: total }, (_, i) => {
            const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
            return { date: d, inMonth: d.getMonth() === month };
        });
    }, [month, year]);

    const festivalDates = useMemo(() => new Set(FESTIVALS.map((f) => f.date)), []);
    const upcoming = useMemo(() => {
        const list = getUpcoming(today, 4);
        return list.length ? list : FESTIVALS.slice(-4);
    }, [today]);
    const featured = upcoming[0];

    function changeMonth(dir: number) {
        const d = new Date(year, month + dir, 1);
        setMonth(d.getMonth()); setYear(d.getFullYear());
    }
    function pick(d: Date) {
        setSelectedDate(fmt(d));
        if (d.getMonth() !== month) { setMonth(d.getMonth()); setYear(d.getFullYear()); }
    }
    function goToday() { pick(today); setMonth(today.getMonth()); setYear(today.getFullYear()); }

    /* data */
    const data = normalize(panchang);
    const tithi = getFirst(data, ["udaya_tithi.name", "tithi.0.name", "tithi.0", "tithi"]);
    const nakshatra = getFirst(data, ["udaya_nakshatra.name", "nakshatra.0.name", "nakshatra.0", "nakshatra"]);
    const yoga = getFirst(data, ["udaya_yoga.name", "yoga.0.name", "yoga.0", "yoga"]);
    const karana = getFirst(data, ["karana.0.name", "karana.0", "karana"]);
    const sunrise = fmtTime(getFirst(data, ["sun.rise", "sunrise", "sun.sunrise"]));
    const sunset = fmtTime(getFirst(data, ["sun.set", "sunset", "sun.sunset"]));
    const moonrise = fmtTime(getFirst(data, ["moon.rise", "moonrise", "moon.moonrise"]));
    const moonset = fmtTime(getFirst(data, ["moon.set", "moonset", "moon.moonset"]));
    const bDay = getFirst(data, ["calendars.bengali.day", "bengali.day", "bengali_date.day"]);
    const bMonth = getFirst(data, ["calendars.bengali.month", "bengali.month", "bengali_date.month"]);
    const bYear = getFirst(data, ["calendars.bengali.year", "bengali.year", "bengali_date.year"]);
    const samvat = getFirst(data, ["calendars.vikram_samvat", "vikram_samvat"]);
    const apiFestivals = getFestivalNames(data);

    const selected = new Date(`${selectedDate}T12:00:00`);
    const longDate = selected.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    const weekday = selected.toLocaleDateString("en-IN", { weekday: "long" });
    const cityName = CITIES.find((c) => c.id === city)?.name;

    const todayRows =
        mode === "hindu"
            ? [["Tithi", tithi], ["Nakshatra", nakshatra], ["Yoga", yoga], ["Karana", karana]]
            : [["Bengali Date", `${bDay} ${bMonth}`], ["Bengali Year", bYear], ["Tithi", tithi], ["Nakshatra", nakshatra]];

    const strip: { label: string; value: string; icon: React.ReactNode }[] =
        mode === "hindu"
            ? [
                { label: "Sunrise", value: sunrise, icon: <Sun /> },
                { label: "Sunset", value: sunset, icon: <Sunset /> },
                { label: "Moonrise", value: moonrise, icon: <Moon /> },
                { label: "Moonset", value: moonset, icon: <MoonStar /> },
            ]
            : [
                { label: "Bengali Day", value: bDay, icon: <CalendarDays /> },
                { label: "Bengali Month", value: bMonth, icon: <Sparkles /> },
                { label: "Sunrise", value: sunrise, icon: <Sun /> },
                { label: "Sunset", value: sunset, icon: <Sunset /> },
            ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#fffaf1] via-[#fff4e3] to-[#fdebd3] text-[#2b1b0e] transition-colors duration-300 dark:from-[#0f1c2a] dark:via-[#111d2b] dark:to-[#132334] dark:text-[#f5ead8] lg:pl-64">

            {/* ============ SIDEBAR (desktop) ============ */}
            <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col overflow-y-auto border-r border-amber-200/70 bg-[#fffaf2] px-5 py-6 dark:border-amber-400/15 dark:bg-[#0c1724] lg:flex">
                <div className="mb-8 flex flex-col items-center text-center">
                    <SafeImage src={IMG.logo} alt="Darshan Dham" width={56} height={56} className="object-contain" />
                    <h2 className="mt-2 font-heading text-2xl font-bold">Darshan Dham</h2>
                    <p className={`text-[11px] ${muted}`}>Explore · Pray · Discover</p>
                </div>

                <nav className="space-y-1.5">
                    {NAV.map((n) => (
                        <a key={n.name} href={n.href}
                            className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition ${n.name === "Calendar"
                                ? "bg-gradient-to-r from-[#e8a23a] to-[#d68b2e] text-white shadow-md"
                                : `${muted} hover:bg-amber-100/60 dark:hover:bg-white/5`}`}>
                            <span>{n.icon}</span>{n.name}
                        </a>
                    ))}
                </nav>

                <div className="mt-auto pt-6">
                    <div className="relative h-44 w-full">
                        <SafeImage src={IMG.sidebarLight} alt="" fill sizes="256px" className="object-contain dark:hidden" />
                        <SafeImage src={IMG.sidebarDark} alt="" fill sizes="256px" className="hidden object-contain dark:block" />
                    </div>
                    <p className={`mt-3 text-center text-xs italic leading-5 ${muted}`}>
                        “Every day is a new opportunity to connect with the divine.”
                    </p>
                    <button onClick={toggleTheme}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-amber-300/60 bg-white/60 py-2.5 text-sm font-bold transition hover:border-amber-500 dark:border-amber-400/25 dark:bg-white/5">
                        {isDark ? "☀️ Light Theme" : "🌙 Dark Theme"}
                    </button>
                </div>
            </aside>

            <div className="mx-auto max-w-[1400px] space-y-5 px-3 py-4 sm:px-6 sm:py-6">

                {/* ============ MOBILE TOP BAR ============ */}
                <div className="space-y-3 lg:hidden">
                    <div className={`${card} flex items-center justify-between p-3`}>
                        <div className="flex items-center gap-2.5">
                            <SafeImage src={IMG.logo} alt="Darshan Dham" width={40} height={40} />
                            <div>
                                <p className="font-heading font-bold leading-tight">Darshan Dham</p>
                                <p className={`text-[10px] ${muted}`}>Explore · Pray · Discover</p>
                            </div>
                        </div>
                        <button onClick={toggleTheme} aria-label="Toggle theme"
                            className="rounded-full border border-amber-300/60 bg-white/60 px-3 py-2 text-sm dark:border-amber-400/25 dark:bg-white/5">
                            {isDark ? "☀️" : "🌙"}
                        </button>
                    </div>
                    <nav className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1">
                        {NAV.map((n) => (
                            <a key={n.name} href={n.href}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${n.name === "Calendar"
                                    ? "bg-[#df922e] text-white"
                                    : "border border-amber-200/70 bg-white/70 dark:border-amber-400/20 dark:bg-[#1b2b3c]/80"}`}>
                                {n.icon} {n.name}
                            </a>
                        ))}
                    </nav>
                </div>

                {/* ============ HERO ============ */}
                <section className="relative isolate overflow-hidden rounded-[2rem] shadow-xl">
                    <div className="absolute inset-0 -z-10">
                        <SafeImage src={IMG.heroLight} alt="Sacred temple at sunrise" fill priority sizes="100vw"
                            className="object-cover object-[75%_center] dark:hidden" />
                        <SafeImage src={IMG.heroDark} alt="Sacred temple at night" fill priority sizes="100vw"
                            className="hidden object-cover object-[75%_center] dark:block" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#fff3df] via-[#fff3df]/80 to-[#fff3df]/10 dark:from-[#111d2b] dark:via-[#111d2b]/75 dark:to-transparent sm:via-[#fff3df]/55 sm:dark:via-[#111d2b]/45" />
                    </div>

                    <div className="px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
                        <div className="max-w-xl">
                            <p className={`text-[11px] font-bold uppercase tracking-[0.25em] sm:text-xs ${accent}`}>
                                Darshan Dham · Sanatan Calendar
                            </p>
                            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-[#3a2410] dark:text-[#f6c36b] sm:text-6xl">
                                Sacred Calendar
                            </h1>
                            <p className="mt-3 text-sm leading-6 text-[#4a3520] dark:text-white/85 sm:text-xl">
                                Discover Hindu Panchang and Bengali Panjika
                            </p>
                            <p className={`mt-1 text-xs sm:text-sm ${accent}`}>॥ ॐ नमः शिवाय ॥</p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                {([["hindu", "🕉️ Hindu Panchang"], ["bengali", "🌺 Bengali Panjika"]] as const).map(([m, label]) => (
                                    <button key={m} onClick={() => setMode(m)}
                                        className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${mode === m
                                            ? "bg-gradient-to-r from-[#e8a23a] to-[#d68b2e] text-white shadow-lg"
                                            : "border border-amber-300/70 bg-white/70 text-[#4a3520] backdrop-blur hover:bg-white dark:border-white/25 dark:bg-white/10 dark:text-white"}`}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ============ TABS ============ */}
                <div role="tablist" aria-label="Calendar sections"
                    className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:justify-center sm:px-0">
                    {TABS.map((t) => (
                        <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
                            className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${tab === t.id
                                ? "bg-gradient-to-r from-[#e8a23a] to-[#d68b2e] text-white shadow-md"
                                : "border border-amber-200/70 bg-white/80 hover:border-amber-500 dark:border-amber-400/20 dark:bg-[#1b2b3c]/80"}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "countdown" && <FestivalCountdown />}

                {tab === "meditation" && (
                    <div className="space-y-8">
                        <MeditationTimer />
                        <DigitalMala />
                    </div>
                )}

                {tab === "panchang" && (
                    <>
                        {/* ============ CALENDAR + TODAY'S PANCHANG ============ */}
                        <section className="grid gap-5 xl:grid-cols-[1fr_1.05fr]">

                            {/* Calendar */}
                            <div className={`${card} p-4 sm:p-6`}>
                                <p className={`flex items-center gap-2 text-sm font-bold ${accent}`}>
                                    <CalendarDays className="h-5 w-5" />
                                    <span className="text-[#2b1b0e] dark:text-[#f5ead8]">Darshan Dham Calendar</span>
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                    <button onClick={() => changeMonth(-1)} aria-label="Previous month"
                                        className="rounded-full border border-amber-200 bg-white/95 p-2 shadow-sm transition hover:border-amber-500 dark:border-amber-400/25 dark:bg-white/5">
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <div className="text-center">
                                        <h2 className="font-heading text-2xl font-bold sm:text-3xl">{MONTHS[month]} {year}</h2>
                                        <button onClick={goToday} className={`text-xs font-semibold underline-offset-2 hover:underline ${accent}`}>Go to today</button>
                                    </div>
                                    <button onClick={() => changeMonth(1)} aria-label="Next month"
                                        className="rounded-full border border-amber-200 bg-white/95 p-2 shadow-sm transition hover:border-amber-500 dark:border-amber-400/25 dark:bg-white/5">
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-4 grid grid-cols-7 gap-1 sm:gap-1.5">
                                    {WEEKDAYS.map((d) => (
                                        <div key={d} className={`py-1.5 text-center text-xs font-semibold ${muted}`}>{d}</div>
                                    ))}
                                    {cells.map(({ date, inMonth }) => {
                                        const iso = fmt(date);
                                        const sel = iso === selectedDate;
                                        const isToday = iso === fmt(today);
                                        const hasFest = festivalDates.has(iso);
                                        return (
                                            <button key={iso} onClick={() => pick(date)}
                                                className={`relative flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition sm:h-12 sm:text-base ${sel
                                                    ? "bg-gradient-to-b from-[#f0a93f] to-[#d68b2e] text-white shadow-lg shadow-orange-900/25 ring-2 ring-amber-300/60"
                                                    : isToday
                                                        ? "border-2 border-[#d68b2e] text-[#b8691a] dark:text-[#f3b552]"
                                                        : inMonth
                                                            ? "bg-white/70 hover:bg-amber-100 dark:bg-white/5 dark:hover:bg-white/10"
                                                            : "bg-transparent text-[#b8a88f] dark:text-[#5a6b7d]"}`}>
                                                {date.getDate()}
                                                {(hasFest || isToday) && (
                                                    <span className={`absolute bottom-1 h-1 w-1 rounded-full ${sel ? "bg-white" : hasFest ? "bg-[#d68b2e]" : "bg-sky-500"}`} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className={`mt-4 flex flex-wrap items-center gap-4 border-t border-amber-200/60 pt-3 text-xs dark:border-white/10 ${muted}`}>
                                    <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#d68b2e]" />Festival / selected</span>
                                    <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full border-2 border-[#d68b2e]" />Today</span>
                                </div>
                            </div>

                            {/* Today's Panchang */}
                            <div id="panchang-details" className={`${card} relative overflow-hidden`}>
                                <div className="absolute inset-y-0 right-0 w-[55%] sm:w-[48%]">
                                    <SafeImage src={IMG.shivaLight} alt="Lord Shiva" fill sizes="(max-width:1280px) 50vw, 25vw"
                                        className="object-contain object-right-bottom dark:hidden" />
                                    <SafeImage src={IMG.shivaDark} alt="Lord Shiva" fill sizes="(max-width:1280px) 50vw, 25vw"
                                        className="hidden object-contain object-right-bottom dark:block" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf2] via-[#fffaf2]/40 to-transparent dark:from-[#1b2b3c] dark:via-[#1b2b3c]/40" />
                                </div>

                                <div className="relative flex h-full flex-col p-5 sm:p-6">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="flex items-center gap-2 font-heading text-xl font-bold">
                                            <span className="text-2xl">🪷</span> Today’s Panchang
                                        </h2>
                                        <a href="#panchang-strip"
                                            className={`flex items-center gap-1 rounded-full border border-amber-300/70 bg-white/70 px-3 py-1 text-xs font-bold dark:border-amber-400/30 dark:bg-white/5 ${accent}`}>
                                            View Details <ArrowRight className="h-3 w-3" />
                                        </a>
                                    </div>

                                    <p className="mt-5 font-heading text-2xl font-bold sm:text-3xl">{longDate} · {weekday}</p>
                                    <p className={`mt-1 flex items-center gap-1 text-sm ${muted}`}><MapPin className="h-3.5 w-3.5" />{cityName}</p>

                                    {loading ? (
                                        <p className={`mt-6 animate-pulse text-sm font-semibold ${accent}`}>Fetching sacred Panchang…</p>
                                    ) : error ? (
                                        <p className="mt-6 text-sm text-red-500">{error}</p>
                                    ) : (
                                        <dl className="mt-5 space-y-2.5 text-sm sm:text-base">
                                            {todayRows.map(([k, v]) => (
                                                <div key={k} className="grid grid-cols-[100px_10px_1fr] items-baseline sm:grid-cols-[120px_10px_1fr]">
                                                    <dt className="flex items-center gap-2 text-[#7a6650] dark:text-[#d6c9b3]">
                                                        <i className="h-2.5 w-2.5 rounded-full bg-[#e39a2f]" />{k}
                                                    </dt>
                                                    <span>:</span>
                                                    <dd className="max-w-[55%] font-semibold sm:max-w-none">{v}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    )}

                                    <div className="mt-auto grid grid-cols-2 gap-3 pt-6">
                                        <div className="flex items-center gap-2.5">
                                            <Sun className="h-7 w-7 text-[#e39a2f]" />
                                            <div><p className={`text-[11px] ${muted}`}>Sunrise</p><p className="text-sm font-bold">{sunrise}</p></div>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Sunset className="h-7 w-7 text-[#e0562f]" />
                                            <div><p className={`text-[11px] ${muted}`}>Sunset</p><p className="text-sm font-bold">{sunset}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ============ UPCOMING FESTIVALS + FESTIVAL OF THE MONTH ============ */}
                        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                            <div className={`${card} p-4 sm:p-5`}>
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 font-heading text-lg font-bold"><span>🌸</span>Upcoming Festivals</h2>
                                    <a href="/festivals" className={`flex items-center gap-1 text-sm font-bold ${accent}`}>View All <ArrowRight className="h-4 w-4" /></a>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {upcoming.map((f) => (
                                        <button key={f.name + f.date}
                                            onClick={() => pick(new Date(`${f.date}T12:00:00`))}
                                            className="group overflow-hidden rounded-xl border border-amber-200/70 bg-white/95 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-amber-400/20 dark:bg-[#0c1724]">
                                            <div className="relative h-20 overflow-hidden sm:h-24">
                                                <FestivalVisual name={f.name} sizes="(max-width:640px) 45vw, 15vw"
                                                    className="transition duration-500 group-hover:scale-110 dark:brightness-90" />
                                            </div>
                                            <div className="px-2 py-2">
                                                <p className="truncate text-sm font-bold">{f.name}</p>
                                                <p className={`text-xs ${muted}`}>{prettyDate(f.date)}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative isolate min-h-[190px] overflow-hidden rounded-3xl bg-gradient-to-r from-[#7a3f08] via-[#c9761a] to-[#f0a93f] shadow-lg">
                                <FestivalVisual name={featured.name} banner sizes="(max-width:1280px) 100vw, 40vw" className="-z-10 opacity-90" />
                                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#6b3406]/95 via-[#a85d10]/70 to-transparent" />
                                <div className="flex h-full min-h-[190px] flex-col justify-center p-6 text-white">
                                    <p className="text-sm font-bold text-[#ffd48a]">Festival of the Month</p>
                                    <h3 className="mt-1 font-heading text-3xl font-bold">{featured.name}</h3>
                                    <p className="mt-1 text-sm text-white/85">{prettyDate(featured.date)} · Auspicious day for new beginnings</p>
                                    <button onClick={() => pick(new Date(`${featured.date}T12:00:00`))}
                                        className="mt-4 flex w-fit items-center gap-2 rounded-full border border-white/50 bg-white/15 px-5 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/30">
                                        Know More <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* ============ DAILY PANCHANG DETAILS STRIP ============ */}
                        <section id="panchang-strip" className={`${card} relative overflow-hidden p-4 sm:p-5`}>
                            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 md:block">
                                <SafeImage src={IMG.footerLight} alt="" fill sizes="30vw" className="object-contain object-right dark:hidden" />
                                <SafeImage src={IMG.footerDark} alt="" fill sizes="30vw" className="hidden object-contain object-right dark:block" />
                            </div>

                            <div className="relative flex flex-wrap items-center justify-between gap-2">
                                <h2 className="flex items-center gap-2 font-heading text-lg font-bold">
                                    <span>🌼</span>Daily Panchang Details
                                </h2>
                                <div className="flex items-center gap-2">
                                    <label htmlFor="city" className="sr-only">City</label>
                                    <MapPin className={`h-4 w-4 ${accent}`} />
                                    <select id="city" value={city} onChange={(e) => setCity(e.target.value)}
                                        className="rounded-full border border-amber-300/60 bg-white/80 px-3 py-1.5 text-sm outline-none focus:border-amber-500 dark:border-amber-400/25 dark:bg-[#0c1724]">
                                        {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="relative mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 md:divide-x md:divide-amber-200/70 dark:md:divide-white/10">
                                {strip.map((s) => (
                                    <div key={s.label} className="flex items-center justify-center gap-3 md:px-3">
                                        <span className="text-[#e39a2f] [&>svg]:h-8 [&>svg]:w-8 dark:text-[#f3b552]">{s.icon}</span>
                                        <div>
                                            <p className={`text-[11px] ${muted}`}>{s.label}</p>
                                            <p className="text-sm font-bold">{loading ? "…" : s.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {mode === "hindu" && (
                                <p className={`relative mt-4 border-t border-amber-200/60 pt-3 text-xs dark:border-white/10 ${muted}`}>
                                    Vikram Samvat: <b className="text-[#2b1b0e] dark:text-[#f5ead8]">{samvat}</b>
                                </p>
                            )}

                            {apiFestivals.length > 0 && !loading && (
                                <div className="relative mt-3 flex flex-wrap gap-3">
                                    {apiFestivals.map((name) => (
                                        <div key={name} className="flex items-center gap-2 rounded-full border border-amber-200/70 bg-white/70 py-1 pl-1 pr-4 dark:border-amber-400/20 dark:bg-white/5">
                                            <span className="relative h-9 w-9 overflow-hidden rounded-full">
                                                <FestivalVisual name={name} sizes="36px" />
                                            </span>
                                            <span className="text-sm font-bold">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </>
                )}

                <footer className="pb-4 text-center">
                    <p className={`font-heading text-base font-semibold ${accent}`}>
                        🪷 May your journey be blessed with peace, devotion and divine light.
                    </p>
                </footer>
            </div>
        </main>
    );
}