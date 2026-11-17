
"use client";

import { useEffect, useMemo, useState } from "react";

type CalendarMode = "hindu" | "bengali";

type PanchangResponse = {
    data?: Record<string, any>;
    error?: string;
    message?: string;
    [key: string]: any;
};

const CITIES = [
    { id: "delhi", name: "Delhi" },
    { id: "kolkata", name: "Kolkata" },
    { id: "mumbai", name: "Mumbai" },
    { id: "bangalore", name: "Bengaluru" },
    { id: "chennai", name: "Chennai" },
    { id: "hyderabad", name: "Hyderabad" },
    { id: "ahmedabad", name: "Ahmedabad" },
    { id: "pune", name: "Pune" },
    { id: "jaipur", name: "Jaipur" },
    { id: "varanasi", name: "Varanasi" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function getText(value: any): string {
    if (value === null || value === undefined) return "Not available";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) {
        return value.map((item) => getText(item?.name ?? item)).join(", ");
    }
    if (typeof value === "object") {
        return String(value.name ?? value.value ?? value.time ?? value.start ?? "Not available");
    }
    return "Not available";
}

function getFirst(data: any, keys: string[]): string {
    for (const key of keys) {
        const value = key.split(".").reduce((obj, part) => obj?.[part], data);
        if (value !== undefined && value !== null && value !== "") {
            return getText(value);
        }
    }
    return "Not available";
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function CalendarPage() {
    const today = new Date();

    const [mode, setMode] = useState<CalendarMode>("hindu");
    const [language, setLanguage] = useState("en");
    const [city, setCity] = useState("delhi");
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(formatDate(today));
    const [panchang, setPanchang] = useState<PanchangResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const translations: Record<string, Record<string, string>> = {
        en: {
            title: "Sacred Calendar",
            subtitle: "Discover Hindu Panchang and Bengali Panjika",
            hindu: "Hindu Panchang",
            bengali: "Bengali Panjika",
            today: "Today",
            selectCity: "Select your city",
            selectDate: "Select a date",
            details: "Daily Panchang Details",
            tithi: "Tithi",
            nakshatra: "Nakshatra",
            yoga: "Yoga",
            karana: "Karana",
            sunrise: "Sunrise",
            sunset: "Sunset",
            bengaliDate: "Bengali Date",
            samvat: "Vikram Samvat",
            festivals: "Festivals",
            loading: "Fetching sacred calendar...",
            unavailable: "Panchang data is not available for this date.",
            previous: "Previous",
            next: "Next",
        },
        hi: {
            title: "पावन पंचांग",
            subtitle: "हिन्दू पंचांग और बंगाली पंजीका देखें",
            hindu: "हिन्दू पंचांग",
            bengali: "बंगाली पंजीका",
            today: "आज",
            selectCity: "अपना शहर चुनें",
            selectDate: "तारीख चुनें",
            details: "दैनिक पंचांग विवरण",
            tithi: "तिथि",
            nakshatra: "नक्षत्र",
            yoga: "योग",
            karana: "करण",
            sunrise: "सूर्योदय",
            sunset: "सूर्यास्त",
            bengaliDate: "बंगाली तिथि",
            samvat: "विक्रम संवत",
            festivals: "त्योहार",
            loading: "पंचांग जानकारी लाई जा रही है...",
            unavailable: "इस तारीख का पंचांग उपलब्ध नहीं है।",
            previous: "पिछला",
            next: "अगला",
        },
        bn: {
            title: "পবিত্র পঞ্জিকা",
            subtitle: "হিন্দু পঞ্চাঙ্গ এবং বাংলা পঞ্জিকা দেখুন",
            hindu: "হিন্দু পঞ্চাঙ্গ",
            bengali: "বাংলা পঞ্জিকা",
            today: "আজ",
            selectCity: "আপনার শহর নির্বাচন করুন",
            selectDate: "তারিখ নির্বাচন করুন",
            details: "দৈনিক পঞ্জিকার বিবরণ",
            tithi: "তিথি",
            nakshatra: "নক্ষত্র",
            yoga: "যোগ",
            karana: "করণ",
            sunrise: "সূর্যোদয়",
            sunset: "সূর্যাস্ত",
            bengaliDate: "বাংলা তারিখ",
            samvat: "বিক্রম সংবৎ",
            festivals: "উৎসব",
            loading: "পঞ্জিকার তথ্য আনা হচ্ছে...",
            unavailable: "এই তারিখের পঞ্জিকা পাওয়া যায়নি।",
            previous: "আগের",
            next: "পরের",
        },
    };

    const t = translations[language] ?? translations.en;

    const days = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        return [
            ...Array(firstDay).fill(null),
            ...Array.from({ length: totalDays }, (_, index) => index + 1),
        ];
    }, [month, year]);

    useEffect(() => {
        let cancelled = false;

        async function loadPanchang() {
            setLoading(true);
            setError("");
            setPanchang(null);

            try {
                const response = await fetch("/api/panchang", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        date: selectedDate,
                        city_id: city,
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || result.message || "Unable to load Panchang.");
                }

                if (!cancelled) setPanchang(result);
            } catch (err: any) {
                if (!cancelled) {
                    setError(err.message || "Unable to load Panchang.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadPanchang();

        return () => {
            cancelled = true;
        };
    }, [selectedDate, city]);

    function changeMonth(direction: number) {
        const date = new Date(year, month + direction, 1);
        setMonth(date.getMonth());
        setYear(date.getFullYear());
    }

    function selectDay(day: number) {
        const date = new Date(year, month, day);
        setSelectedDate(formatDate(date));
    }

    const data = panchang?.data ?? panchang ?? {};
    const tithi = getFirst(data, ["tithi.0.name", "tithi.0", "tithi"]);
    const nakshatra = getFirst(data, ["nakshatra.0.name", "nakshatra.0", "nakshatra"]);
    const yoga = getFirst(data, ["yoga.0.name", "yoga.0", "yoga"]);
    const karana = getFirst(data, ["karana.0.name", "karana.0", "karana"]);
    const sunrise = getFirst(data, ["sun.rise", "sunrise", "sun.sunrise"]);
    const sunset = getFirst(data, ["sun.set", "sunset", "sun.sunset"]);
    const bengaliDate = getFirst(data, [
        "bengali_date",
        "calendars.bengali.date",
        "calendars.bengali",
    ]);
    const samvat = getFirst(data, [
        "calendars.vikram_samvat",
        "vikram_samvat",
    ]);
    const festivals = getFirst(data, [
        "festivals.0.name",
        "festivals",
    ]);

    const selected = new Date(`${selectedDate}T12:00:00`);
    const selectedLabel = selected.toLocaleDateString(
        language === "hi" ? "hi-IN" : language === "bn" ? "bn-IN" : "en-IN",
        { day: "numeric", month: "long", year: "numeric" }
    );

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#fff9ed] via-[#fff4df] to-[#fffaf1] px-3 py-8 text-[#49321e] sm:px-6">
            <div className="mx-auto max-w-7xl">
                <section className="relative overflow-hidden rounded-[2rem] border border-[#e8c98e] bg-gradient-to-br from-[#fff0c9] via-[#ffe2a3] to-[#f7c66e] p-7 shadow-lg sm:p-12">
                    <div className="pointer-events-none absolute -right-10 -top-16 text-[180px] opacity-10">🪷</div>
                    <div className="relative z-10">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#9c5b17]">
                            DARSHAN DHAM • SANATAN CALENDAR
                        </p>
                        <h1 className="font-heading text-3xl font-bold text-[#713c16] sm:text-5xl">
                            {t.title}
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm text-[#80552c] sm:text-base">
                            {t.subtitle}
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <button
                                onClick={() => setMode("hindu")}
                                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${mode === "hindu"
                                    ? "bg-[#8d451b] text-white shadow-md"
                                    : "border border-[#b77b39] bg-white/60 text-[#75421f]"
                                    }`}
                            >
                                🕉️ {t.hindu}
                            </button>
                            <button
                                onClick={() => setMode("bengali")}
                                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${mode === "bengali"
                                    ? "bg-[#8d451b] text-white shadow-md"
                                    : "border border-[#b77b39] bg-white/60 text-[#75421f]"
                                    }`}
                            >
                                🌺 {t.bengali}
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
                    <div className="rounded-3xl border border-[#ead8b9] bg-white p-4 shadow-sm sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-[#a36b31]">
                                    DARSHAN DHAM CALENDAR
                                </p>
                                <h2 className="mt-1 font-heading text-2xl font-bold">
                                    {MONTHS[month]} {year}
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setMonth(today.getMonth());
                                        setYear(today.getFullYear());
                                        setSelectedDate(formatDate(today));
                                    }}
                                    className="rounded-full border border-[#e5c99e] px-4 py-2 text-sm font-semibold hover:bg-[#fff5e3]"
                                >
                                    {t.today}
                                </button>
                                <button
                                    onClick={() => changeMonth(-1)}
                                    aria-label="Previous month"
                                    className="rounded-full border border-[#e5c99e] px-4 py-2 hover:bg-[#fff5e3]"
                                >
                                    ‹
                                </button>
                                <button
                                    onClick={() => changeMonth(1)}
                                    aria-label="Next month"
                                    className="rounded-full border border-[#e5c99e] px-4 py-2 hover:bg-[#fff5e3]"
                                >
                                    ›
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-7 gap-1 sm:gap-2">
                            {WEEKDAYS.map((day) => (
                                <div key={day} className="py-2 text-center text-xs font-bold text-[#9b6c3c]">
                                    {day}
                                </div>
                            ))}

                            {days.map((day, index) => {
                                if (!day) return <div key={`empty-${index}`} />;

                                const dateString = formatDate(new Date(year, month, day));
                                const isSelected = dateString === selectedDate;
                                const isToday = dateString === formatDate(today);

                                return (
                                    <button
                                        key={dateString}
                                        onClick={() => selectDay(day)}
                                        className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition sm:rounded-2xl sm:text-base ${isSelected
                                            ? "bg-[#934a20] font-bold text-white shadow-md"
                                            : isToday
                                                ? "border-2 border-[#d18a35] bg-[#fff3d7] font-bold"
                                                : "border border-transparent hover:border-[#edcf9e] hover:bg-[#fff6e7]"
                                            }`}
                                    >
                                        {day}
                                        {isToday && !isSelected && (
                                            <span className="mt-0.5 h-1 w-1 rounded-full bg-[#c47b27]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#8b6b4b]">
                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#934a20]" /> Selected date
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full border-2 border-[#d18a35]" /> Today
                            </span>
                        </div>
                    </div>

                    <aside className="space-y-5">
                        <div className="rounded-3xl border border-[#ead8b9] bg-white p-5 shadow-sm">
                            <label className="text-sm font-bold text-[#80552c]">{t.selectCity}</label>
                            <select
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-[#e8d6b8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#bd7933]"
                            >
                                {CITIES.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>

                            <label className="mt-5 block text-sm font-bold text-[#80552c]">
                                Language / भाषा / ভাষা
                            </label>
                            <select
                                value={language}
                                onChange={(event) => setLanguage(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-[#e8d6b8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#bd7933]"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिन्दी</option>
                                <option value="bn">বাংলা</option>
                            </select>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-[#843f1c] to-[#572b18] p-6 text-white shadow-lg">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[#f5d49d]">
                                {mode === "hindu" ? "🕉️ Hindu Panchang" : "🌺 Bengali Panjika"}
                            </p>
                            <p className="mt-3 font-heading text-2xl font-bold">{selectedLabel}</p>
                            <p className="mt-2 text-sm text-white/70">{city.toUpperCase()}</p>
                            <div className="mt-5 h-px bg-white/20" />
                            <p className="mt-4 text-xs text-[#f5d49d]">{t.selectDate}</p>
                            <p className="mt-1 text-lg font-semibold">{selectedDate}</p>
                        </div>
                    </aside>
                </section>

                <section className="mt-7 rounded-3xl border border-[#ead8b9] bg-white p-5 shadow-sm sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#a36b31]">
                                DARSHAN DHAM • DAILY DETAILS
                            </p>
                            <h2 className="mt-1 font-heading text-2xl font-bold">{t.details}</h2>
                        </div>
                        {loading && (
                            <span className="animate-pulse rounded-full bg-[#fff0d1] px-4 py-2 text-xs font-semibold text-[#92501d]">
                                {t.loading}
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                            <p className="mt-1 text-xs">
                                Free API plan mein date range limited ho sakti hai. Aaj ki date select karke dobara try karein.
                            </p>
                        </div>
                    )}

                    {!loading && !error && !panchang && (
                        <p className="mt-5 text-sm text-[#94785a]">{t.unavailable}</p>
                    )}

                    {panchang && !loading && (
                        <>
                            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    { label: t.tithi, value: tithi, icon: "🌙" },
                                    { label: t.nakshatra, value: nakshatra, icon: "⭐" },
                                    { label: t.yoga, value: yoga, icon: "✨" },
                                    { label: t.karana, value: karana, icon: "🙏" },
                                    { label: t.sunrise, value: sunrise, icon: "🌅" },
                                    { label: t.sunset, value: sunset, icon: "🌇" },
                                    { label: t.bengaliDate, value: bengaliDate, icon: "🌺" },
                                    { label: t.samvat, value: samvat, icon: "📜" },
                                    { label: t.festivals, value: festivals, icon: "🪔" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-[#f0e1c9] bg-[#fffaf2] p-4"
                                    >
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#90602f]">
                                            <span className="text-xl">{item.icon}</span>
                                            {item.label}
                                        </div>
                                        <p className="mt-2 break-words text-base font-bold text-[#55351f]">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <p className="mt-5 text-xs text-[#9b8268]">
                                {/* Panchang information is supplied by the connected DevDarsha API. Availability of fields depends on the API plan and selected date. */}
                            </p>
                        </>
                    )}
                </section>

                <footer className="py-8 text-center text-xs text-[#9b8268]">
                    🪷 DARSHAN DHAM — Your guide to India&apos;s sacred traditions 🪷
                </footer>
            </div>
        </main>
    );
}
