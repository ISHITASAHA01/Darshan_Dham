"use client";

import { useState } from "react";
import Image from "next/image";
import { getFestivalBanner, getFestivalImage, getFestivalStyle } from "@/lib/festivals";

/**
 * Festival ki photo dikhata hai (public/festivals/ se).
 * Photo load na ho to rang ka background aur halka ॐ dikhta hai.
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

    return (
        <div className={`absolute inset-0 ${className}`} style={{ background: getFestivalStyle(name).gradient }}>
            {!failed ? (
                <Image src={image} alt="" fill sizes={sizes} onError={() => setFailed(true)} className="object-cover" />
            ) : (
                <span className="absolute inset-0 flex select-none items-center justify-center text-6xl text-white/25">ॐ</span>
            )}
        </div>
    );
}
