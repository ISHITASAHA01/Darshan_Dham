
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
    { id: "lucknow", name: "Lucknow" },
    { id: "patna", name: "Patna" },
    { id: "bhopal", name: "Bhopal" },
    { id: "indore", name: "Indore" },
    { id: "chandigarh", name: "Chandigarh" },
    { id: "ayodhya", name: "Ayodhya" },
    { id: "mathura", name: "Mathura" },
    { id: "haridwar", name: "Haridwar" },
    { id: "ujjain", name: "Ujjain" },
    { id: "nagpur", name: "Nagpur" },
    { id: "surat", name: "Surat" },
    { id: "bhubaneswar", name: "Bhubaneswar" },
    { id: "guwahati", name: "Guwahati" },
    { id: "ranchi", name: "Ranchi" },
    { id: "amritsar", name: "Amritsar" },
    { id: "kochi", name: "Kochi" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Handles API responses wrapped inside multiple data objects.
function normalizePanchang(response: any): any {
    let current = response;

    for (let i = 0; i < 6; i++) {
        if (!current || typeof current !== "object") {
            break;
        }

        const hasPanchangFields =
            current.calendars ||
            current.festivals ||
            current.udaya_tithi ||
            current.tithi ||
            current.sun;

        if (hasPanchangFields) {
            return current;
        }

        if (current.data && typeof current.data === "object") {
            current = current.data;
            continue;
        }

        break;
    }

    return current ?? {};
}

// Reads nested values such as calendars.bengali.day.
function getNestedValue(data: any, path: string): any {
    return path.split(".").reduce(
        (value, key) => value?.[key],
        data
    );
}

function getFirst(data: any, paths: string[]): string {
    for (const path of paths) {
        const value = getNestedValue(data, path);

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            if (
                typeof value === "string" ||
                typeof value === "number"
            ) {
                return String(value);
            }

            if (typeof value === "object" && !Array.isArray(value)) {
                const text =
                    value.name ??
                    value.value ??
                    value.time ??
                    value.start;

                if (text !== undefined && text !== null) {
                    return String(text);
                }
            }
        }
    }

    return "Not available";
}

// Extracts festival names from festivals.data.
function getFestivalNames(data: any): string[] {
    const festivalValue = data?.festivals;

    let festivalList: any[] = [];

    if (Array.isArray(festivalValue)) {
        festivalList = festivalValue;
    } else if (Array.isArray(festivalValue?.data)) {
        festivalList = festivalValue.data;
    } else if (Array.isArray(festivalValue?.festivals)) {
        festivalList = festivalValue.festivals;
    }

    return festivalList
        .map((festival) => {
            if (typeof festival === "string") {
                return festival;
            }

            return festival?.name ?? festival?.title ?? "";
        })
        .filter((name) => Boolean(name));
}

export default function CalendarPage() {
    const today = new Date();

    const [mode, setMode] = useState<CalendarMode>("hindu");
    const [city, setCity] = useState("delhi");
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState(formatDate(today));

    const [panchang, setPanchang] = useState<PanchangResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const days = useMemo(() => {
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        return [
            ...Array(firstDay).fill(null),
            ...Array.from(
                { length: totalDays },
                (_, index) => index + 1
            ),
        ];
    }, [month, year]);

    // Load Panchang data from the API.
    useEffect(() => {
        let cancelled = false;

        async function loadPanchang() {
            setLoading(true);
            setError("");
            setPanchang(null);

            try {
                const response = await fetch("/api/panchang", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        date: selectedDate,
                        city_id: city,
                    }),
                });

                const result = await response.json();

                console.log("PANCHANG API RESPONSE:", result);

                if (!response.ok) {
                    throw new Error(
                        result.error ||
                        result.message ||
                        "Unable to load Panchang."
                    );
                }

                if (!cancelled) {
                    setPanchang(result);
                }
            } catch (err: any) {
                if (!cancelled) {
                    setError(
                        err.message || "Unable to load Panchang."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
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

    function goToToday() {
        setMonth(today.getMonth());
        setYear(today.getFullYear());
        setSelectedDate(formatDate(today));
    }

    // Normalize nested API response.
    const data = normalizePanchang(panchang);

    // Hindu Panchang values.
    const tithi = getFirst(data, [
        "udaya_tithi.name",
        "tithi.0.name",
        "tithi.0",
        "tithi",
    ]);

    const nakshatra = getFirst(data, [
        "udaya_nakshatra.name",
        "nakshatra.0.name",
        "nakshatra.0",
        "nakshatra",
    ]);

    const yoga = getFirst(data, [
        "udaya_yoga.name",
        "yoga.0.name",
        "yoga.0",
        "yoga",
    ]);

    const karana = getFirst(data, [
        "karana.0.name",
        "karana.0",
        "karana",
    ]);

    const sunrise = getFirst(data, [
        "sun.rise",
        "sunrise",
        "sun.sunrise",
    ]);

    const sunset = getFirst(data, [
        "sun.set",
        "sunset",
        "sun.sunset",
    ]);

    // Bengali Panjika: separate day, month and year.
    const bengaliDay = getFirst(data, [
        "calendars.bengali.day",
        "bengali.day",
        "bengali_date.day",
    ]);

    const bengaliMonth = getFirst(data, [
        "calendars.bengali.month",
        "bengali.month",
        "bengali_date.month",
    ]);

    const bengaliYear = getFirst(data, [
        "calendars.bengali.year",
        "bengali.year",
        "bengali_date.year",
    ]);

    // Vikram Samvat.
    const samvat = getFirst(data, [
        "calendars.vikram_samvat",
        "vikram_samvat",
    ]);

    // Festivals from festivals.data.
    const festivals = getFestivalNames(data);

    const selected = new Date(`${selectedDate}T12:00:00`);

    const selectedLabel = selected.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

    const calendarDetails = [
        { label: "Tithi", value: tithi, icon: "🌙" },
        { label: "Nakshatra", value: nakshatra, icon: "⭐" },
        { label: "Yoga", value: yoga, icon: "✨" },
        { label: "Karana", value: karana, icon: "🙏" },
        { label: "Sunrise", value: sunrise, icon: "🌅" },
        { label: "Sunset", value: sunset, icon: "🌇" },
        { label: "Vikram Samvat", value: samvat, icon: "📜" },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#fff9ed] via-[#fff4df] to-[#fffaf1] px-3 py-8 text-[#49321e] sm:px-6">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <section className="relative overflow-hidden rounded-[2rem] border border-[#e8c98e] bg-gradient-to-br from-[#fff0c9] via-[#ffe2a3] to-[#f7c66e] p-7 shadow-lg sm:p-12">

                    <div className="pointer-events-none absolute -right-10 -top-16 text-[180px] opacity-10">
                        🪷
                    </div>

                    <div className="relative z-10">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#9c5b17]">
                            DARSHAN DHAM • SANATAN CALENDAR
                        </p>

                        <h1 className="font-heading text-3xl font-bold text-[#713c16] sm:text-5xl">
                            Sacred Calendar
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm text-[#80552c] sm:text-base">
                            Discover Hindu Panchang and Bengali Panjika
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <button
                                onClick={() => setMode("hindu")}
                                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${mode === "hindu"
                                    ? "bg-[#8d451b] text-white shadow-md"
                                    : "border border-[#b77b39] bg-white/60 text-[#75421f]"
                                    }`}
                            >
                                🕉️ Hindu Panchang
                            </button>

                            <button
                                onClick={() => setMode("bengali")}
                                className={`rounded-full px-6 py-3 text-sm font-semibold transition ${mode === "bengali"
                                    ? "bg-[#8d451b] text-white shadow-md"
                                    : "border border-[#b77b39] bg-white/60 text-[#75421f]"
                                    }`}
                            >
                                🌺 Bengali Panjika
                            </button>
                        </div>
                    </div>
                </section>

                {/* Calendar and city */}
                <section className="mt-7 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">

                    {/* Calendar */}
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
                                    onClick={goToToday}
                                    className="rounded-full border border-[#e5c99e] px-4 py-2 text-sm font-semibold hover:bg-[#fff5e3]"
                                >
                                    Today
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
                                <div
                                    key={day}
                                    className="py-2 text-center text-xs font-bold text-[#9b6c3c]"
                                >
                                    {day}
                                </div>
                            ))}

                            {days.map((day, index) => {
                                if (!day) {
                                    return <div key={`empty-${index}`} />;
                                }

                                const dateString = formatDate(
                                    new Date(year, month, day)
                                );

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
                                <span className="h-2.5 w-2.5 rounded-full bg-[#934a20]" />
                                Selected date
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full border-2 border-[#d18a35]" />
                                Today
                            </span>
                        </div>
                    </div>

                    {/* City and selected date */}
                    <aside className="space-y-5">

                        <div className="rounded-3xl border border-[#ead8b9] bg-white p-5 shadow-sm">
                            <label className="text-sm font-bold text-[#80552c]">
                                Select your city
                            </label>

                            <select
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                                className="mt-2 w-full rounded-xl border border-[#e8d6b8] bg-[#fffaf1] px-4 py-3 text-sm outline-none focus:border-[#bd7933]"
                            >
                                {CITIES.map((item) => (
                                    <option key={item.id} value={item.id}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-[#843f1c] to-[#572b18] p-6 text-white shadow-lg">
                            <p className="text-xs font-semibold uppercase tracking-widest text-[#f5d49d]">
                                {mode === "hindu"
                                    ? "🕉️ Hindu Panchang"
                                    : "🌺 Bengali Panjika"}
                            </p>

                            <p className="mt-3 font-heading text-2xl font-bold">
                                {selectedLabel}
                            </p>

                            <p className="mt-2 text-sm text-white/70">
                                {city.toUpperCase()}
                            </p>

                            <div className="mt-5 h-px bg-white/20" />

                            <p className="mt-4 text-xs text-[#f5d49d]">
                                Selected Date
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                                {selectedDate}
                            </p>
                        </div>
                    </aside>
                </section>

                {/* Daily Panchang details */}
                <section className="mt-7 rounded-3xl border border-[#ead8b9] bg-white p-5 shadow-sm sm:p-8">

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#a36b31]">
                                DARSHAN DHAM • DAILY DETAILS
                            </p>

                            <h2 className="mt-1 font-heading text-2xl font-bold">
                                {mode === "hindu"
                                    ? "Daily Panchang Details"
                                    : "Bengali Panjika Details"}
                            </h2>
                        </div>

                        {loading && (
                            <span className="animate-pulse rounded-full bg-[#fff0d1] px-4 py-2 text-xs font-semibold text-[#92501d]">
                                Fetching sacred calendar...
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}

                            <p className="mt-1 text-xs">
                                The free API plan may have a limited date range.
                                Try selecting today's date.
                            </p>
                        </div>
                    )}

                    {!loading && !error && !panchang && (
                        <p className="mt-5 text-sm text-[#94785a]">
                            Panchang data is not available for this date.
                        </p>
                    )}

                    {panchang && !loading && (
                        <>
                            {/* Hindu Panchang */}
                            {mode === "hindu" && (
                                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {calendarDetails.map((item) => (
                                        <div
                                            key={item.label}
                                            className="rounded-2xl border border-[#f0e1c9] bg-[#fffaf2] p-4"
                                        >
                                            <div className="flex items-center gap-2 text-sm font-semibold text-[#90602f]">
                                                <span className="text-xl">
                                                    {item.icon}
                                                </span>
                                                {item.label}
                                            </div>

                                            <p className="mt-2 break-words text-base font-bold text-[#55351f]">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Bengali Panjika */}
                            {mode === "bengali" && (
                                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                    <div className="rounded-2xl border border-[#f0e1c9] bg-[#fffaf2] p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#90602f]">
                                            <span className="text-xl">📅</span>
                                            Bengali Day
                                        </div>

                                        <p className="mt-2 text-2xl font-bold text-[#55351f]">
                                            {bengaliDay}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-[#f0e1c9] bg-[#fffaf2] p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#90602f]">
                                            <span className="text-xl">🌺</span>
                                            Bengali Month
                                        </div>

                                        <p className="mt-2 text-2xl font-bold text-[#55351f]">
                                            {bengaliMonth}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl border border-[#f0e1c9] bg-[#fffaf2] p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#90602f]">
                                            <span className="text-xl">📜</span>
                                            Bengali Year
                                        </div>

                                        <p className="mt-2 text-2xl font-bold text-[#55351f]">
                                            {bengaliYear}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Festivals */}
                            <div className="mt-6 rounded-2xl border border-[#f0e1c9] bg-[#fffaf2] p-5">
                                <div className="flex items-center gap-2 text-sm font-semibold text-[#90602f]">
                                    <span className="text-xl">🪔</span>
                                    Festivals & Observances
                                </div>

                                {festivals.length > 0 ? (
                                    <ul className="mt-3 space-y-2">
                                        {festivals.map((festival, index) => (
                                            <li
                                                key={`${festival}-${index}`}
                                                className="flex items-start gap-2 text-base font-bold text-[#55351f]"
                                            >
                                                <span>🪷</span>
                                                <span>{festival}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="mt-3 text-sm text-[#94785a]">
                                        No festival information available for this date.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </section>

                {/* Footer */}
                <footer className="py-8 text-center text-xs text-[#9b8268]">
                    🪷 DARSHAN DHAM — Your guide to India's sacred traditions 🪷
                </footer>
            </div>
        </main>
    );
}
