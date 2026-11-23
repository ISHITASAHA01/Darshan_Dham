"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FestivalVisual from "@/components/FestivalVisual";
import { FESTIVALS, getUpcoming, toISO } from "@/lib/festivals";

const card = "rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm";
const eyebrow = "text-xs font-bold uppercase tracking-[0.25em] text-[var(--color-saffron-dark)]";
const GOLD = "#f08a24";

function Heading({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
    return (
        <div className="mb-6 text-center">
            <p className={eyebrow}>{tag}</p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">{title}</h2>
            {sub && <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--muted)]">{sub}</p>}
        </div>
    );
}

/* ================= 1. STATS (kitne mandir, states, aarti ...) ================= */
type Stat = { label: string; value: number; suffix?: string; icon?: string };

const DEFAULT_STATS: Stat[] = [
    { label: "Temples", value: 100, suffix: "+", icon: "🛕" },
    { label: "States", value: 28, icon: "🇮🇳" },
    { label: "Aarti and pujas", value: 500, suffix: "+", icon: "🪔" },
    { label: "Festivals", value: FESTIVALS.length, suffix: "+", icon: "🌸" },
];

function CountUp({ to, run }: { to: number; run: boolean }) {
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!run) return;
        const start = performance.now();
        let raf = 0;
        const tick = (t: number) => {
            const p = Math.min(1, (t - start) / 1400);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [to, run]);
    return <>{n.toLocaleString("en-IN")}</>;
}

/** items me apni asli ginti bhejo, jaise: [{label:"Temples", value: temples.length}] */
export function StatsBar({ items = DEFAULT_STATS }: { items?: Stat[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const [seen, setSeen] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={ref} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map((s) => (
                <div key={s.label}
                    className={`${card} group relative overflow-hidden px-4 py-7 text-center transition hover:-translate-y-1 hover:shadow-xl`}>
                    <span className="pointer-events-none absolute -right-3 -top-3 text-6xl opacity-10 transition group-hover:scale-110">{s.icon}</span>
                    <p className="font-heading text-4xl font-bold text-[var(--color-saffron)] sm:text-5xl">
                        <CountUp to={s.value} run={seen} />{s.suffix}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{s.label}</p>
                </div>
            ))}
        </div>
    );
}

/* ================= 2. AAJ KA MANTRA + SHLOKA ================= */
const MANTRAS = [
    { name: "Gayatri Mantra", to: "Surya", text: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्", meaning: "We meditate on the divine light of the Sun, that it may illuminate our intellect." },
    { name: "Mahamrityunjaya Mantra", to: "Shiva", text: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्", meaning: "We worship the three-eyed Shiva. May he free us from fear and bondage." },
    { name: "Om Namah Shivaya", to: "Shiva", text: "ॐ नमः शिवाय", meaning: "I bow to Shiva, the auspicious one residing within all." },
    { name: "Ganesha Mantra", to: "Ganesha", text: "ॐ गं गणपतये नमः", meaning: "Salutations to Ganesha, the remover of obstacles." },
    { name: "Hare Krishna Mahamantra", to: "Krishna", text: "हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥", meaning: "A call to Krishna and Rama that awakens divine love." },
];

const SHLOKAS = [
    { text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥", meaning: "You have the right to act, never to the fruits of your actions.", source: "Bhagavad Gita 2.47" },
    { text: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥", meaning: "May all be happy, may all be free from illness, may none suffer.", source: "Shanti Mantra" },
];

export function TodayMantra() {
    const [day, setDay] = useState(0);
    useEffect(() => {
        const now = new Date();
        setDay(Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000));
    }, []);

    const m = MANTRAS[day % MANTRAS.length];
    const s = SHLOKAS[day % SHLOKAS.length];
    const items = [
        { chip: "Today’s mantra", title: `${m.name} · ${m.to}`, text: m.text, meaning: m.meaning, foot: "Chant it three times with a calm mind." },
        { chip: "Today’s shloka", title: "Sacred verse", text: s.text, meaning: s.meaning, foot: s.source },
    ];

    return (
        <section>
            <Heading tag="Daily practice" title="Today’s mantra and shloka" sub="A sacred sound and a verse of wisdom to begin your day." />
            <div className="grid gap-5 md:grid-cols-2">
                {items.map((c) => (
                    <article key={c.chip}
                        className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[#fff4e0] via-[var(--surface)] to-[var(--surface-soft)] p-7 shadow-md dark:from-[#2a1d12] dark:via-[var(--surface)] dark:to-[var(--surface-soft)]">
                        <span className="pointer-events-none absolute -bottom-10 -right-4 select-none text-[190px] leading-none text-[var(--color-saffron)] opacity-[0.09]">ॐ</span>
                        <span className="inline-block rounded-full bg-[var(--color-saffron)]/15 px-3 py-1 text-xs font-bold text-[var(--color-saffron-dark)]">{c.chip}</span>
                        <h3 className="mt-3 text-sm font-semibold text-[var(--muted)]">{c.title}</h3>
                        <p className="relative mt-3 font-heading text-2xl leading-[2.4rem] sm:text-[1.7rem]">{c.text}</p>
                        <p className="relative mt-4 text-sm leading-6 text-[var(--muted)]">{c.meaning}</p>
                        <p className="relative mt-5 flex items-center gap-2 border-t border-[var(--border)] pt-3 text-xs font-bold text-[var(--color-saffron-dark)]">
                            <span>🪷</span>{c.foot}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

/* ================= 3. FESTIVAL COUNTDOWN (agla tyohaar apne aap) ================= */
export function FestivalCountdown() {
    const [now, setNow] = useState<number | null>(null);
    useEffect(() => {
        setNow(Date.now());
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);
    if (now === null) return null;

    const upcoming = getUpcoming(new Date(now));
    const next = upcoming[0];
    if (!next) return null;

    const isToday = next.date === toISO(new Date(now));
    const diff = Math.max(0, new Date(`${next.date}T00:00:00`).getTime() - now);
    const parts: [string, number][] = [
        ["Days", Math.floor(diff / 86400000)],
        ["Hours", Math.floor(diff / 3600000) % 24],
        ["Minutes", Math.floor(diff / 60000) % 60],
        ["Seconds", Math.floor(diff / 1000) % 60],
    ];
    const pretty = (iso: string, long = false) =>
        new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", long
            ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
            : { day: "numeric", month: "short" });

    return (
        <section className="relative isolate overflow-hidden rounded-[2rem] shadow-xl">
            <FestivalVisual name={next.name} banner sizes="100vw" className="-z-10" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

            <div className="p-5 text-white sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ffd48a]">
                    {isToday ? "Today is a sacred day" : "Upcoming festival"}
                </p>
                <h2 className="mt-2 max-w-2xl font-heading text-3xl font-bold leading-tight sm:text-6xl">{next.name}</h2>
                <p className="mt-1 text-sm text-white/85">{pretty(next.date, true)}</p>

                {isToday ? (
                    <p className="mt-7 inline-block rounded-full border border-white/30 bg-black/25 px-6 py-3 text-lg font-bold backdrop-blur-md">
                        🙏 Aaj hai, shubh avsar!
                    </p>
                ) : (
                    <div className="mt-6 grid max-w-lg grid-cols-4 gap-2 sm:mt-7 sm:gap-3">
                        {parts.map(([k, v]) => (
                            <div key={k} className="rounded-2xl border border-white/30 bg-black/25 py-3 text-center backdrop-blur-md sm:py-4">
                                <p className="text-2xl font-bold tabular-nums sm:text-4xl">{String(v).padStart(2, "0")}</p>
                                <p className="mt-0.5 text-[11px] text-white/85">{k}</p>
                            </div>
                        ))}
                    </div>
                )}

                {upcoming.length > 1 && (
                    <div className="mt-7 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-white/70">Aage aane wale:</span>
                        {upcoming.slice(1, 4).map((f) => (
                            <span key={f.name + f.date} className="rounded-full border border-white/25 bg-black/25 px-3 py-1.5 backdrop-blur">
                                {f.name} · {pretty(f.date)}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ================= 4. DIGITAL MALA (bead ring) ================= */
const BEADS = Array.from({ length: 108 }, (_, i) => {
    const a = ((-90 + (i * 360) / 108) * Math.PI) / 180;
    // toFixed: server aur browser ke decimal alag aate the (hydration warning)
    return {
        x: Number((150 + 128 * Math.cos(a)).toFixed(2)),
        y: Number((150 + 128 * Math.sin(a)).toFixed(2)),
    };
});

/* bahar ki chamakti chingariyan (16 nikat) */
const SPARKS = Array.from({ length: 16 }, (_, i) => {
    const a = ((i * 360) / 16) * (Math.PI / 180);
    return {
        x: Number((150 + 141 * Math.cos(a)).toFixed(2)),
        y: Number((150 + 141 * Math.sin(a)).toFixed(2)),
        delay: (i % 6) * 0.5,
    };
});

/* hawa me upar udte roshni ke kan (fixed values, hydration safe) */
const RISERS = Array.from({ length: 10 }, (_, i) => ({
    left: 6 + i * 9.5,
    size: 4 + (i % 3) * 3,
    dur: 8 + (i % 4) * 2.5,
    delay: -(i * 1.9),
}));

/* guru bead (sumeru) 107 aur 0 number ke beech me */
const GURU = (() => {
    const a = ((-90 - 360 / 216) * Math.PI) / 180;
    return { x: Number((150 + 128 * Math.cos(a)).toFixed(2)), y: Number((150 + 128 * Math.sin(a)).toFixed(2)) };
})();

const PROG_R = 106;
const PROG_C = 2 * Math.PI * PROG_R;

export function DigitalMala() {
    const [count, setCount] = useState(0);
    const [rounds, setRounds] = useState(0);
    const [pulse, setPulse] = useState(0);

    function tap() {
        try { navigator.vibrate?.(15); } catch { /* ignore */ }
        setPulse((p) => p + 1);
        if (count + 1 >= 108) { setCount(0); setRounds((r) => r + 1); } else setCount(count + 1);
    }
    const pct = Math.round((count / 108) * 100);

    return (
        <section className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#2e1a0b] via-[#1f1209] to-[#120a05] p-5 text-[#f6e7d2] shadow-2xl sm:rounded-[2rem] sm:p-12">
            {/* peeche ki halki roshni */}
            <div className="dd-glow pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#f08a24]/10 blur-3xl" />
            <div className="dd-glow pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#f08a24]/10 blur-3xl" style={{ animationDelay: "-2.5s" }} />

            {/* hawa me upar udti chingariyan */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                {RISERS.map((r, i) => (
                    <span key={i} className="dd-riser"
                        style={{ left: `${r.left}%`, width: r.size, height: r.size, animationDuration: `${r.dur}s`, animationDelay: `${r.delay}s` }} />
                ))}
            </div>

            <div className="relative grid items-center gap-8 md:grid-cols-2 md:gap-10">
                {/* mobile par mala upar, text neeche */}
                <div className="order-2 md:order-1">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f08a24]/40 bg-[#f08a24]/10 text-2xl text-[#f08a24] sm:h-14 sm:w-14 sm:text-3xl">ॐ</span>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.3em] text-[#e8a257]">108 sacred repetitions</p>
                    <h2 className="mt-2 font-heading text-3xl font-bold sm:text-5xl">Find your rhythm.</h2>
                    <p className="mt-3 max-w-md text-sm leading-6 text-[#cdb79b]">
                        Tap the mala or use the button below. Let each count become a moment of stillness.
                    </p>

                    <div className="mt-6 grid max-w-sm grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#e8a257]">Current</p>
                            <p className="mt-1 text-2xl font-bold">{count}<span className="text-sm font-normal text-[#a8927a]"> /108</span></p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#e8a257]">Rounds</p>
                            <p className="mt-1 text-2xl font-bold">{rounds}</p>
                        </div>
                    </div>

                    <div className="mt-5 max-w-sm">
                        <div className="flex justify-between text-xs text-[#a8927a]"><span>Progress</span><span>{pct}%</span></div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-[#f08a24] to-[#ffc46b] transition-all duration-300" style={{ width: `${pct}%` }} />
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button onClick={tap} className="dd-tap rounded-full bg-gradient-to-r from-[#ff7a18] to-[#f0a93f] px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-900/40 transition hover:brightness-110 active:scale-95">
                            🙏 Count bead
                        </button>
                        <button onClick={() => { setCount(0); setRounds(0); }} className="dd-tap rounded-full border border-white/25 px-6 py-3 text-sm font-semibold transition hover:bg-white/10">
                            ↺ Reset
                        </button>
                    </div>
                </div>

                {/* mala: hawa me halka tairta hua */}
                <div className="dd-float order-1 mx-auto w-full max-w-[300px] sm:max-w-[380px] md:order-2">
                    <button onClick={tap} aria-label={`Count bead, ${count} of 108`} className="dd-tap relative block aspect-square w-full active:scale-[0.98]">
                        {/* mala ke peeche sunehri aabha */}
                        <span className="dd-glow pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(240,138,36,0.30),transparent_68%)]" />

                        {/* layer 1: sabse bahar ki dotted ring + chamakte kan (dheere ULTI disha me ghumti) */}
                        <svg viewBox="0 0 300 300" aria-hidden="true" className="dd-rot-rev pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                            <circle cx="150" cy="150" r="146" fill="none" stroke="#f08a24" strokeOpacity="0.22" strokeDasharray="2 5" />
                            {SPARKS.map((sp, i) => (
                                <circle key={i} cx={sp.x} cy={sp.y} r="1.9" fill="#ffd48a" className="dd-twinkle" style={{ animationDelay: `${sp.delay}s` }} />
                            ))}
                        </svg>

                        {/* layer 2: mala ke 108 moti (dheere dheere ghumte hain) */}
                        <svg viewBox="0 0 300 300" aria-hidden="true" className="dd-rot pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                            <defs>
                                <radialGradient id="ddBeadTodo" cx="35%" cy="30%" r="75%">
                                    <stop offset="0%" stopColor="#b98456" />
                                    <stop offset="60%" stopColor="#6b4529" />
                                    <stop offset="100%" stopColor="#3a2414" />
                                </radialGradient>
                                <radialGradient id="ddBeadDone" cx="35%" cy="30%" r="75%">
                                    <stop offset="0%" stopColor="#ffe3a6" />
                                    <stop offset="55%" stopColor="#d98a36" />
                                    <stop offset="100%" stopColor="#7a4312" />
                                </radialGradient>
                                <radialGradient id="ddBeadNow" cx="35%" cy="30%" r="75%">
                                    <stop offset="0%" stopColor="#fff6dc" />
                                    <stop offset="50%" stopColor="#ffb347" />
                                    <stop offset="100%" stopColor="#f08a24" />
                                </radialGradient>
                                <linearGradient id="ddProg" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#f08a24" />
                                    <stop offset="100%" stopColor="#ffd48a" />
                                </linearGradient>
                            </defs>
                            {/* andar ki progress line: moti ke saath hi ghumti hai, isliye dono hamesha mel khaate hain */}
                            <circle cx="150" cy="150" r={PROG_R} fill="none" stroke="#f08a24" strokeOpacity="0.12" strokeWidth="3" />
                            <circle cx="150" cy="150" r={PROG_R} fill="none" stroke="url(#ddProg)" strokeWidth="3" strokeLinecap="round"
                                strokeDasharray={`${(PROG_C * count) / 108} ${PROG_C}`}
                                transform="rotate(-90 150 150)" style={{ transition: "stroke-dasharray 0.3s ease" }} />
                            <circle cx="150" cy="150" r="128" fill="none" stroke="#8a5a34" strokeOpacity="0.6" strokeWidth="1.2" />
                            {BEADS.map((b, i) => {
                                const done = i < count;
                                const cur = i === count;
                                return (
                                    <g key={i}>
                                        {cur && <circle cx={b.x} cy={b.y} r="12" fill="#f08a24" opacity="0.28" className="dd-twinkle" />}
                                        <circle cx={b.x} cy={b.y} r={cur ? 6.5 : 3.8}
                                            fill={cur ? "url(#ddBeadNow)" : done ? "url(#ddBeadDone)" : "url(#ddBeadTodo)"} />
                                    </g>
                                );
                            })}
                            {/* guru bead aur jhalar */}
                            <line x1={GURU.x} y1={GURU.y} x2={GURU.x} y2={GURU.y + 20} stroke="#d98a36" strokeWidth="1.4" />
                            <line x1={GURU.x} y1={GURU.y} x2={GURU.x - 4} y2={GURU.y + 18} stroke="#d98a36" strokeWidth="1" opacity="0.8" />
                            <line x1={GURU.x} y1={GURU.y} x2={GURU.x + 4} y2={GURU.y + 18} stroke="#d98a36" strokeWidth="1" opacity="0.8" />
                            <circle cx={GURU.x} cy={GURU.y} r="7" fill="url(#ddBeadDone)" stroke="#ffe3a6" strokeWidth="0.8" />
                        </svg>

                        {/* layer 3: beech ka sthir hissa (progress ring + tap ring) */}
                        <svg viewBox="0 0 300 300" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                            <circle cx="150" cy="150" r="98" fill="#f08a24" fillOpacity="0.05" stroke="#f08a24" strokeOpacity="0.25" />
                            {pulse > 0 && (
                                <circle key={pulse} cx="150" cy="150" r="98" fill="none" stroke="#ffb35c" strokeWidth="2" className="dd-tap-ring" />
                            )}
                        </svg>

                        <span className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="dd-glow text-2xl text-[#f08a24]/80">ॐ</span>
                            <span className="text-5xl font-bold tabular-nums sm:text-6xl">{count}</span>
                            <span className="mt-1 text-[11px] uppercase tracking-[0.3em] text-[#a8927a]">tap to count</span>
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ================= 5. MEDITATION TIMER ================= */
const DURATIONS = [5, 10, 15, 20, 30];
const R = 112;
const C = 2 * Math.PI * R;

function bell() {
    try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = 528;
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
        o.connect(g).connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 3.5);
    } catch { /* ignore */ }
}

export function MeditationTimer() {
    const [mins, setMins] = useState(10);
    const [left, setLeft] = useState(600);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const [phase, setPhase] = useState<"in" | "out">("in");

    useEffect(() => {
        if (!running) return;
        const t = setInterval(() => {
            setLeft((s) => {
                if (s <= 1) { clearInterval(t); setRunning(false); setDone(true); bell(); return 0; }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [running]);

    /* 4 second saans andar, 4 second bahar (animation ke 8 second ke chakkar ke saath) */
    useEffect(() => {
        if (!running) return;
        const t = setInterval(() => setPhase((p) => (p === "in" ? "out" : "in")), 4000);
        return () => clearInterval(t);
    }, [running]);

    function choose(m: number) {
        if (running) return;
        setMins(m); setLeft(m * 60); setDone(false);
    }
    function reset() { setRunning(false); setDone(false); setLeft(mins * 60); setPhase("in"); }
    function toggle() {
        if (done || left === 0) { setDone(false); setLeft(mins * 60); setPhase("in"); setRunning(true); return; }
        if (!running) setPhase("in");
        setRunning((r) => !r);
    }

    const total = mins * 60;
    const mm = String(Math.floor(left / 60)).padStart(2, "0");
    const ss = String(left % 60).padStart(2, "0");
    const status = done
        ? "Session complete 🙏"
        : running
            ? (phase === "in" ? "Breathe in…" : "Breathe out…")
            : left < total ? "Paused" : "Ready";

    return (
        <section>
            <Heading tag="Inner peace" title="Meditation timer" sub="Find stillness with a quiet session. A soft bell rings when you finish." />
            <div className={`${card} relative mx-auto max-w-2xl overflow-hidden p-5 text-center sm:p-10`}>

                {/* peeche halka ghumta hua ॐ */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
                    <span className="dd-spin-html select-none text-[15rem] leading-none text-[var(--color-saffron)] opacity-[0.06] sm:text-[19rem]">ॐ</span>
                </div>

                {/* session chalte waqt upar udte kan */}
                {running && (
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                        {RISERS.slice(0, 7).map((r, i) => (
                            <span key={i} className="dd-riser" style={{ left: `${r.left}%`, width: r.size, height: r.size, animationDuration: `${r.dur + 3}s`, animationDelay: `${r.delay}s` }} />
                        ))}
                    </div>
                )}

                <div className="relative mx-auto h-60 w-60 sm:h-72 sm:w-72">
                    {/* saans lete waqt failti lehren (sirf session chalte waqt) */}
                    {running && [0, 2.6, 5.2].map((d) => (
                        <span key={d} aria-hidden="true"
                            className="dd-ripple pointer-events-none absolute inset-0 rounded-full border border-[#f0a93f]/60"
                            style={{ animationDelay: `${d}s` }} />
                    ))}

                    {/* sunehri aabha */}
                    <span aria-hidden="true"
                        className={`${running ? "dd-breath" : "dd-glow"} pointer-events-none absolute -inset-5 rounded-full bg-[radial-gradient(circle,rgba(240,169,63,0.35),transparent_68%)]`} />

                    {/* timer ring: chalte waqt saans ke saath phoolta hai */}
                    <div className={`relative h-full w-full ${running ? "dd-breath" : "dd-float-soft"}`}>
                        <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
                            <defs>
                                <linearGradient id="medGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#c9761a" />
                                    <stop offset="100%" stopColor="#ffc46b" />
                                </linearGradient>
                            </defs>
                            <circle cx="130" cy="130" r={R} fill="none" stroke="var(--border)" strokeWidth="8" />
                            <circle cx="130" cy="130" r={R} fill="none" stroke="url(#medGrad)" strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={C} strokeDashoffset={C * (1 - left / total)} style={{ transition: "stroke-dashoffset 1s linear" }} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="bg-gradient-to-r from-[#c9761a] to-[#f0a93f] bg-clip-text text-5xl font-bold tabular-nums text-transparent sm:text-6xl">{mm}:{ss}</p>
                            <p className="mt-2 px-6 text-xs text-[var(--muted)]" aria-live="polite">{status}</p>
                        </div>
                    </div>
                </div>

                <div className="relative mt-7 flex flex-wrap justify-center gap-2">
                    {DURATIONS.map((m) => (
                        <button key={m} onClick={() => choose(m)} aria-pressed={mins === m}
                            className={`dd-tap rounded-full border px-4 py-2 text-sm font-semibold transition ${mins === m
                                ? "border-transparent bg-gradient-to-r from-[#c9761a] to-[#f0a93f] text-white shadow-md"
                                : "border-[var(--border)] bg-[var(--surface-soft)] hover:border-[var(--color-saffron)]"} ${running ? "opacity-60" : ""}`}>
                            {m} min
                        </button>
                    ))}
                </div>

                <div className="relative mt-6 flex justify-center gap-3">
                    <button onClick={toggle}
                        className="dd-tap rounded-full bg-gradient-to-r from-[#c9761a] to-[#f0a93f] px-9 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95">
                        {running ? "⏸ Pause" : done ? "▶ Start again" : "▶ Start"}
                    </button>
                    <button onClick={reset} aria-label="Reset timer"
                        className="dd-tap rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:bg-[var(--surface-soft)]">
                        ↺
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ================= 0. AAJ KA PANCHANG (home page ki patti, asli data) ================= */
type Json = { [k: string]: unknown };

function getPath(obj: unknown, path: string): unknown {
    return path.split(".").reduce<unknown>((v, k) => (v && typeof v === "object" ? (v as Json)[k] : undefined), obj);
}

function pickText(data: unknown, paths: string[]): string {
    for (const p of paths) {
        const v = getPath(data, p);
        if (typeof v === "string" || typeof v === "number") return String(v);
        if (v && typeof v === "object" && !Array.isArray(v)) {
            const o = v as Json;
            const t = o.name ?? o.value ?? o.time ?? o.start;
            if (typeof t === "string" || typeof t === "number") return String(t);
        }
    }
    return "—";
}

function unwrapPanchang(res: unknown): unknown {
    let cur = res;
    for (let i = 0; i < 6; i++) {
        if (!cur || typeof cur !== "object") break;
        const o = cur as Json;
        if (o.calendars || o.festivals || o.udaya_tithi || o.tithi || o.sun) return cur;
        if (o.data && typeof o.data === "object") { cur = o.data; continue; }
        break;
    }
    return cur ?? {};
}

function festivalNames(data: unknown): string[] {
    const f = (data as Json | null)?.festivals;
    const fo = f as Json | undefined;
    const list: unknown[] = Array.isArray(f) ? f
        : Array.isArray(fo?.data) ? (fo?.data as unknown[])
            : Array.isArray(fo?.festivals) ? (fo?.festivals as unknown[]) : [];
    return list
        .map((x) => (typeof x === "string" ? x : String((x as Json)?.name ?? (x as Json)?.title ?? "")))
        .filter(Boolean);
}

function clock(v: string): string {
    const m = v.match(/(\d{1,2}):(\d{2})/);
    if (!m) return v;
    let h = parseInt(m[1], 10);
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${m[2]} ${ap}`;
}

export function TodayPanchangStrip({ cityId = "delhi", cityName = "Delhi" }: { cityId?: string; cityName?: string }) {
    const [data, setData] = useState<unknown>(null);
    const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
    const [iso, setIso] = useState("");

    useEffect(() => {
        const today = toISO(new Date());
        setIso(today);
        let cancelled = false;
        fetch("/api/panchang", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: today, city_id: cityId }),
        })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error("panchang"))))
            .then((j) => { if (!cancelled) { setData(unwrapPanchang(j)); setStatus("ok"); } })
            .catch(() => { if (!cancelled) setStatus("error"); });
        return () => { cancelled = true; };
    }, [cityId]);

    const label = iso
        ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        : "";
    const items: [string, string][] = status === "ok" ? [
        ["Tithi", pickText(data, ["udaya_tithi.name", "tithi.0.name", "tithi.0", "tithi"])],
        ["Nakshatra", pickText(data, ["udaya_nakshatra.name", "nakshatra.0.name", "nakshatra.0", "nakshatra"])],
        ["Sunrise", clock(pickText(data, ["sun.rise", "sunrise", "sun.sunrise"]))],
        ["Sunset", clock(pickText(data, ["sun.set", "sunset", "sun.sunset"]))],
    ] : [];
    const fest = status === "ok" ? festivalNames(data) : [];

    return (
        <section aria-label="Today's Panchang" className={`${card} overflow-hidden p-5 shadow-xl sm:p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className={eyebrow}>Today’s Panchang · {cityName}</p>
                    <h2 className="mt-1 font-heading text-xl font-bold sm:text-2xl">{label || "Loading…"}</h2>
                </div>
                <Link href="/calendar" className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-sm font-bold text-[var(--color-saffron-dark)] transition hover:border-[var(--color-saffron)]">
                    Open calendar →
                </Link>
            </div>

            {status === "loading" && (
                <div className="mt-5 grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-4">
                    {[0, 1, 2, 3].map((i) => <div key={i} className="h-14 rounded-2xl bg-[var(--surface-soft)]" />)}
                </div>
            )}

            {status === "error" && (
                <p className="mt-4 text-sm text-[var(--muted)]">Today’s Panchang is not available right now. Open the calendar to see other days.</p>
            )}

            {status === "ok" && (
                <>
                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {items.map(([k, v]) => (
                            <div key={k} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]">{k}</p>
                                <p className="mt-0.5 break-words text-sm font-bold sm:text-base">{v}</p>
                            </div>
                        ))}
                    </div>
                    {fest.length > 0 && (
                        <p className="mt-4 text-sm">
                            <span className="font-bold text-[var(--color-saffron-dark)]">Today: </span>
                            {fest.join(", ")}
                        </p>
                    )}
                </>
            )}
        </section>
    );
}