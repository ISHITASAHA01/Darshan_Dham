import Link from "next/link";
import FestivalVisual from "@/components/FestivalVisual";
import { getUpcoming, toISO } from "@/lib/festivals";

export const metadata = { title: "Festivals | Darshan Dham" };

export default function FestivalsPage() {
    const todayISO = toISO(new Date());
    const upcoming = getUpcoming(new Date());

    // Mahine ke hisaab se group
    const groups = new Map<string, typeof upcoming>();
    for (const f of upcoming) {
        const key = new Date(`${f.date}T12:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
        groups.set(key, [...(groups.get(key) ?? []), f]);
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
            <Link href="/calendar" className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-saffron-dark)] hover:underline">
                ← Back to calendar
            </Link>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-saffron-dark)]">Sacred celebrations</p>
            <h1 className="mt-2 font-heading text-[2rem] font-bold leading-tight sm:text-5xl">Festivals and Pujas</h1>
            <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
                Upcoming Hindu festivals, vrats and puja days. Dates follow the Delhi panchang, so your local temple may differ by a day.
            </p>

            {groups.size === 0 && <p className="mt-10 text-[var(--muted)]">No upcoming festivals in the list.</p>}

            {[...groups.entries()].map(([month, list]) => (
                <section key={month} className="mt-8 sm:mt-10">
                    <h2 className="font-heading text-2xl font-bold">{month}</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                        {list.map((f) => (
                            <article key={f.name + f.date}
                                className="group overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                                <div className="relative h-40 overflow-hidden sm:h-44">
                                    <FestivalVisual name={f.name} sizes="(max-width:768px) 100vw, 33vw"
                                        className="transition duration-500 group-hover:scale-110" />
                                    {f.date === todayISO && (
                                        <span className="absolute left-3 top-3 rounded-full bg-[#d68b2e] px-3 py-1 text-xs font-bold text-white">Today</span>
                                    )}
                                </div>
                                <div className="p-4 sm:p-5">
                                    <h3 className="font-heading text-xl font-bold">{f.name}</h3>
                                    <p className="mt-1 text-sm text-[var(--muted)]">
                                        {new Date(`${f.date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                    <Link href={`/calendar?date=${f.date}`} className="mt-3 inline-block text-sm font-bold text-[var(--color-saffron-dark)]">
                                        View in calendar →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}