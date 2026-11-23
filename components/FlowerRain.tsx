"use client";

import { useEffect, useState } from "react";

/**
 * Poori screen par phoolon ki halki barsaat (dheemi gati se).
 * - Mouse/touch ko rokta nahi (pointer-events-none).
 * - Navbar ke neeche rehta hai (z-40), isliye menu par asar nahi.
 * - "Reduce motion" on ho to kuch nahi dikhata.
 * - Mobile par kam petals, taaki phone halka chale.
 *
 * Use: <FlowerRain />   ya   <FlowerRain count={30} />
 */

type Petal = {
    left: number;   // % (screen ki chaudai me)
    size: number;   // px
    fall: number;   // girne me kitne second
    delay: number;  // negative delay = shuru se hi screen par bikhre hue
    sway: number;   // left-right jhoolne ki doori (px)
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

function build(n: number): Petal[] {
    return Array.from({ length: n }, () => {
        const fall = 18 + Math.random() * 16; // 18 se 34 second: bahut dheere
        return {
            left: Math.random() * 100,
            size: 14 + Math.random() * 16,
            fall,
            delay: -Math.random() * fall,
            sway: 20 + Math.random() * 50,
            swayDur: 4 + Math.random() * 4,
            opacity: 0.45 + Math.random() * 0.4,
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        };
    });
}

export default function FlowerRain({ count }: { count?: number }) {
    const [petals, setPetals] = useState<Petal[]>([]);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const n = count ?? (window.innerWidth < 640 ? 12 : 22);
        setPetals(build(n));
    }, [count]);

    if (petals.length === 0) return null;

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
            {petals.map((p, i) => (
                <div
                    key={i}
                    className="dd-petal"
                    style={{
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size,
                        animationDuration: `${p.fall}s`,
                        animationDelay: `${p.delay}s`,
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