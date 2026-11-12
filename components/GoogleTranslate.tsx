
"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        google?: {
            translate: {
                TranslateElement: new (
                    options: {
                        pageLanguage: string;
                        includedLanguages: string;
                        autoDisplay: boolean;
                    },
                    elementId: string
                ) => unknown;
            };
        };
        googleTranslateElementInit?: () => void;
        setGoogleTranslateLanguage?: (code: string) => void;
    }
}

export default function GoogleTranslate() {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            if (!window.google) return;

            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "hi,ur,bn,ta",
                    autoDisplay: false,
                },
                "google_translate_element"
            );
        };

        window.setGoogleTranslateLanguage = (code: string) => {
            const combo =
                document.querySelector<HTMLSelectElement>(".goog-te-combo");

            if (code === "en") {
                document.cookie =
                    "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

                document.cookie =
                    `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

                window.location.reload();
                return;
            }
            document.cookie = `googtrans=/en/${code}; path=/`;

            if (combo) {
                combo.value = code;
                combo.dispatchEvent(new Event("change"));
            } else {
                window.location.reload();
            }
        };

        if (!document.querySelector('script[data-google-translate="true"]')) {
            const script = document.createElement("script");

            script.src =
                "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

            script.async = true;
            script.dataset.googleTranslate = "true";

            document.body.appendChild(script);
        }
    }, []);

    return <div id="google_translate_element" style={{ display: "none" }} />;
}
