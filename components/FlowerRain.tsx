"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Phoolon ki halki, dheemi barsaat. Ye teen jagah dikhti hai:
 *   1. Site pehli baar khulte hi (loader ke baad).
 *   2. Kisi bhi BUTTON par click karne par (tabs, Count bead, Start, Know More ...).
 *   3. Kisi bhi menu / section LINK par click karne par (Home, Temples, Calendar ...).
 * - Har baar kuch phool upar se girte hain aur neeche pahunch kar apne aap hat jaate hain.
 * - Mala jaisi jagah par tezi se tap karne par bhi screen bhari nahi hoti (MAX_PETALS ki seema).
 * - Mouse/touch ko rokta nahi (pointer-events-none), navbar ke neeche rehta hai (z-40).
 * - Phone me "Reduce motion" on ho to kuch nahi dikhata.
 *
 * Use: <FlowerRain /> ko sirf app/layout.tsx me ek baar rakho (page me alag se mat rakho).
 */

type Petal = {
    id: number;
    left: number;     // % (screen ki chaudai me)
    size: number;     // px
    fall: number;     // girne me kitne second
    delay: number;    // thoda ruk kar shuru (second)
    sway: number;     // left-right jhoolne ki doori (px)
    swayDur: number;
    opacity: number;
    color: [string, string];
};

const PALETTE: [string, string][] = [
    ["#ffc2d4", "#f06292"], // gulabi
    ["#ffe08a", "#f5a623"], // genda (marigold)
    ["#ffb98a", "#f2711c"], // kesari
    ["#fff0f4", "#f4a6c0"], // halka gulabi
    ["#ffd9a0", "#e8902a"], // sunehra
];

const MAX_PETALS = 36; // ek saath screen par isse zyada nahi

let uid = 0;
function build(n: number): Petal[] {
    return Array.from({ length: n }, () => ({
        id: ++uid,
        left: Math.random() * 100,
        size: 14 + Math.random() * 16,
        fall: 9 + Math.random() * 7, // 9 se 16 second: dheere dheere
        delay: Math.random() * 1.2,
        sway: 20 + Math.random() * 50,
        swayDur: 3.5 + Math.random() * 3.5,
        opacity: 0.5 + Math.random() * 0.4,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }));
}

export default function FlowerRain() {
    const [petals, setPetals] = useState<Petal[]>([]);
    const enabled = useRef(false);

    useEffect(() => {
        enabled.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const shower = (n: number) => setPetals((old) => [...old, ...build(n)].slice(-MAX_PETALS));
        const small = () => window.innerWidth < 640;

        // 1. site khulte hi (agar loader dikh raha hai to uske jaane ke baad)
        let seen = false;
        try { seen = sessionStorage.getItem("dd-loader-seen") === "1"; } catch { /* ignore */ }
        const first = enabled.current
            ? setTimeout(() => shower(small() ? 10 : 16), seen ? 400 : 1600)
            : undefined;

        // 2 + 3. button ya internal link par click
        const onClick = (e: MouseEvent) => {
            if (!enabled.current) return;
            const el = (e.target as Element | null)?.closest?.("button, a[href]");
            if (!el) return;
            if (el instanceof HTMLButtonElement) {
                if (el.disabled) return;
            } else {
                const a = el as HTMLAnchorElement;
                const href = a.getAttribute("href") || "";
                if (a.target === "_blank" || /^(mailto:|tel:)/.test(href)) return;
                if (a.origin && a.origin !== window.location.origin) return; // bahar ki site
            }
            shower(small() ? 5 : 8);
        };

        document.addEventListener("click", onClick, true);
        return () => {
            if (first) clearTimeout(first);
            document.removeEventListener("click", onClick, true);
        };
    }, []);

    if (petals.length === 0) return null;

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
            {petals.map((p) => (
                <div
                    key={p.id}
                    className="dd-petal"
                    onAnimationEnd={(e) => {
                        // sirf girne wali animation khatam hone par hatao (jhoolne wali kabhi khatam nahi hoti)
                        if (e.target === e.currentTarget) setPetals((old) => old.filter((x) => x.id !== p.id));
                    }}
                    style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size,
                        animationDuration: `${p.fall}s`,
                        animationDelay: `${p.delay}s`,
                        animationIterationCount: 1,
                        animationFillMode: "both",
                        ["--po" as string]: p.opacity,
                        ["--sway" as string]: `${p.sway}px`,
                    } as React.CSSProperties}
                >
                    <span style={{ animationDuration: `${p.swayDur}s` }}>
                        <svg viewBox="0 0 24 24" width="100%" height="100%">
                            <path d="M12 1.5C5.5 8 4 14.5 12 22.5C20 14.5 18.5 8 12 1.5Z" fill={p.color[0]} />
                            <path d="M12 4.5C9 9.5 9 14.5 12 20" fill="none" stroke={p.color[1]} strokeWidth="1" opacity="0.55" />
                            <path d="M12 1.5C5.5 8 4 14.5 12 22.5C20 14.5 18.5 8 12 1.5Z" fill="none" stroke={p.color[1]} strokeWidth="0.8" opacity="0.5" />
                        </svg>
                    </span>
                </div>
            ))}
        </div>
    );
}