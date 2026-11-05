"use client";

import { Share2 } from "lucide-react";

export default function WhatsAppShare({ name, city }: { name: string; city: string }) {
    const share = () => {
        const url = window.location.href;
        const text = `🛕 ${name}, ${city}\nDarshan timings, aarti aur directions yaha dekho:\n${url}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={share}
            className="flex items-center justify-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-600 hover:text-white"
        >
            <Share2 className="h-4 w-4" /> WhatsApp pe bhejo
        </button>
    );
}