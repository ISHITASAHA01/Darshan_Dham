
"use client";
import { useLanguage } from "@/i18n/LanguageContext";
import Image from "next/image";
import Link from "next/link";
// import TempleLogo from "./TempleLogo";
// import { Landmark } from "lucide-react";

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-navy text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:justify-between">
                <div className="flex items-center gap-3">
                    {/* <Landmark className="h-10 w-10 text-saffron" /> */}
                    <Image
                        src="/images/logo/logo.png"
                        alt="DHARSHAN DHAM"
                        width={56}
                        height={56}
                        className="h-14 w-14 object-contain"
                    />
                    {/* <TempleLogo className="h-12 w-12" /> */}
                    <div>
                        <p className="notranslate font-heading text-xl font-semibold text-saffron">
                            DARSHAN DHAM
                        </p>
                        <p className="text-xs text-white/70">{t("tagline")}</p>
                    </div>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold">Quick Links</p>
                    <ul className="space-y-1 text-sm text-white/70">
                        <li><Link href="/" className="hover:text-saffron">Home</Link></li>
                        <li><Link href="/temples" className="hover:text-saffron">Temples</Link></li>
                        <li><Link href="/states" className="hover:text-saffron">States</Link></li>
                        <li><Link href="/about" className="hover:text-saffron">About</Link></li>
                        <li><Link href="/contact" className="hover:text-saffron">Contact</Link></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
                © 2025 DARSHAN DHAM. All rights reserved. Temple photos: Wikipedia / Wikimedia Commons contributors.
            </div>
        </footer>
    );
}