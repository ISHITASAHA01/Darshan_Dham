"use client";

import { useState } from "react";

/**
 * Asli kamal (lotus) ki photo dikhata hai.
 *
 * KAISE LAGAYEN:
 *   1. Ek asli lotus ki photo lo (transparent background wali PNG ya WebP sabse acchi,
 *      lagbhag 256 x 256 px).
 *   2. Use is naam se rakho:  public/images/calendar/lotus.png
 *   3. Bas. Code badalne ki zaroorat nahi.
 *
 * Agar photo nahi mili to apne aap neeche wala sundar SVG kamal dikhta hai (emoji nahi).
 */
export default function Lotus({
    size = 28,
    src = "/images/calendar/lotus.png",
    className = "",
}: {
    size?: number;
    src?: string;
    className?: string;
}) {
    const [failed, setFailed] = useState(false);

    if (!failed) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt=""
                width={size}
                height={size}
                loading="lazy"
                decoding="async"
                onError={() => setFailed(true)}
                className={`inline-block shrink-0 object-contain ${className}`}
                style={{ width: size, height: size }}
            />
        );
    }

    return (
        <svg
            viewBox="0 0 64 64"
            width={size}
            height={size}
            aria-hidden="true"
            className={`inline-block shrink-0 ${className}`}
        >
            {/* patte */}
            <ellipse cx="32" cy="54" rx="26" ry="5" fill="#4f9d78" opacity="0.55" />
            <ellipse cx="14" cy="53" rx="9" ry="3" fill="#3f8a67" opacity="0.7" />
            <ellipse cx="50" cy="53" rx="9" ry="3" fill="#3f8a67" opacity="0.7" />
            {/* peeche ki pankhudiyan */}
            <path d="M32 52C16 46 8 32 10 20C22 24 30 36 32 52Z" fill="#f6a3bf" />
            <path d="M32 52C48 46 56 32 54 20C42 24 34 36 32 52Z" fill="#f6a3bf" />
            {/* beech ki pankhudiyan */}
            <path d="M32 52C20 46 15 32 20 14C28 22 32 36 32 52Z" fill="#f47fa8" />
            <path d="M32 52C44 46 49 32 44 14C36 22 32 36 32 52Z" fill="#f47fa8" />
            {/* beech ki bari pankhudi */}
            <path d="M32 52C23 44 23 22 32 6C41 22 41 44 32 52Z" fill="#ff9fc0" />
            <path d="M32 48C28 40 28 24 32 12" fill="none" stroke="#ffd0e0" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
            {/* sunehri kendra */}
            <ellipse cx="32" cy="50" rx="5" ry="2.4" fill="#f5b942" />
        </svg>
    );
}