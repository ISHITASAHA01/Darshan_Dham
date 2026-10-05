"use client";
import { useLanguage } from "@/i18n/LanguageContext";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-navy text-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 md:flex-row md:justify-between">
                <div className="flex items-center gap-3">
                    <Image
                        src="/images/logo/logo.png"
                        alt="DHARSHAN DHAM"
                        width={56}
                        height={56}
                        className="h-14 w-14 object-contain"
                    />
                    <div>
                        <p className="notranslate font-heading text-xl font-semibold text-saffron">
                            DARSHAN DHAM
                        </p>
                        <p className="text-xs text-white/70">{t("tagline")}</p>
                    </div>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold">{t("footer_quick_links")}</p>
                    <ul className="space-y-1 text-sm text-white/70">
                        <li><Link href="/" className="hover:text-saffron">{t("nav_home")}</Link></li>
                        <li><Link href="/temples" className="hover:text-saffron">{t("nav_temples")}</Link></li>
                        <li><Link href="/states" className="hover:text-saffron">{t("nav_states")}</Link></li>
                        <li><Link href="/about" className="hover:text-saffron">{t("nav_about")}</Link></li>
                        <li><Link href="/contact" className="hover:text-saffron">{t("nav_contact")}</Link></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
                © 2025 DARSHAN DHAM. {t("footer_rights")} {t("footer_photo_credit")}
            </div>
        </footer>
    );
}