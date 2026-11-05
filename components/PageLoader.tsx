"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function PageLoader({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Agar is session me loader pehle dikh chuka hai, to dobara mat dikhao
        let seen = false;
        try {
            seen = sessionStorage.getItem("dd-loader-seen") === "1";
        } catch { }

        if (seen) {
            setLoading(false);
            return;
        }

        const timer = setTimeout(() => {
            setLoading(false);
            try {
                sessionStorage.setItem("dd-loader-seen", "1");
            } catch { }
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#fff4dc] via-[#fdecc8] to-[#fbe4b0]">
                    <Image
                        src="/images/logo/logo.png"
                        alt="DARSHAN DHAM"
                        width={220}
                        height={220}
                        className="h-36 w-36 animate-pulse object-contain sm:h-44 sm:w-44"
                        priority
                    />
                    <p className="font-heading text-xl font-semibold text-saffron-dark">
                        DARSHAN DHAM
                    </p>
                    <div className="h-1 w-48 overflow-hidden rounded-full bg-saffron-light">
                        <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] rounded-full bg-saffron" />
                    </div>
                    <p className="mt-2 text-xs tracking-wide text-brown/70">
                        Ishita&apos;s Creation
                    </p>
                </div>
            )}
            {children}
        </>
    );
}