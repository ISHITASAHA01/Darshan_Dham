"use client";

import { useState } from "react";
import Image from "next/image";
import { getFestivalBanner, getFestivalImage, getFestivalStyle } from "@/lib/festivals";

/**
 * Festival ki image dikhata hai. Image file na mile (ya load na ho) to
 * uski category ka emoji aur rang dikhata hai, kabhi toota hua icon nahi.
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
    const [failed, setFailed] = useState(false);
    const image = banner ? getFestivalBanner(name) : getFestivalImage(name);
    const style = getFestivalStyle(name);

    return (
        <div className={`absolute inset-0 ${className}`} style={{ background: style.gradient }}>
            {image && !failed ? (
                <Image src={image} alt="" fill sizes={sizes} onError={() => setFailed(true)} className="object-cover" />
            ) : (
                banner ? (
                    <span className="absolute right-6 top-1/2 hidden -translate-y-1/2 select-none text-[130px] leading-none opacity-40 sm:block">
                        {style.emoji}
                    </span>
                ) : (
                    <span className="absolute inset-0 flex select-none items-center justify-center text-5xl opacity-90">
                        {style.emoji}
                    </span>
                )
            )}
        </div>
    );
}