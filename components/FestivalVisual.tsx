"use client";

import { useState } from "react";
import Image from "next/image";
import { getFestivalImageChain, getFestivalStyle } from "@/lib/festivals";

/**
 * Festival ki photo dikhata hai (public/festivals/ se).
 * Pehle us festival ki apni photo (jaise ram-navami.jpg), na mile to category wali photo,
 * wo bhi na mile to rang ka background aur halka ॐ dikhta hai.
 * Parent element me "relative" class hona zaroori hai.
 */
export default function FestivalVisual({
    name,
    banner = false,
    sizes = "33vw",
    className = "",
}: {
    name: string;
    banner?: boolean;
    sizes?: string;
    className?: string;
}) {
    const chain = getFestivalImageChain(name, banner);
    const [tried, setTried] = useState(0); // kitni photos fail ho chuki
    const failed = tried >= chain.length;
    const image = chain[Math.min(tried, chain.length - 1)];

    return (
        <div className={`absolute inset-0 ${className}`} style={{ background: getFestivalStyle(name).gradient }}>
            {!failed ? (
                <Image key={image} src={image} alt="" fill sizes={sizes} onError={() => setTried((t) => t + 1)} className="object-cover" />
            ) : (
                <span className="absolute inset-0 flex select-none items-center justify-center text-6xl text-white/25">ॐ</span>
            )}
        </div>
    );
}