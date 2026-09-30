"use client";

import { useEffect } from "react";

export default function ClearGoogleTranslate() {
    useEffect(() => {
        // Purani Google Translate cookie hamesha ke liye saaf karo
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    }, []);

    return null;
}