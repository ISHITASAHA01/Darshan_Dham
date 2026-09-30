"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

const links = [
  { name: "Home", href: "/" },
  { name: "Temples", href: "/temples" },
  { name: "States", href: "/states" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-saffron-light">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo/logo.png"
            alt="DARSHAN DHAM"
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
          />
          <div className="notranslate leading-tight">
            <p className="font-heading text-base font-semibold text-foreground sm:text-xl">
              DARSHAN DHAM
            </p>
            <p className="hidden text-[11px] text-brown sm:block">
              {t("tagline")}
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`pb-1 text-sm font-medium transition-colors hover:text-saffron ${active
                    ? "border-b-2 border-saffron text-saffron"
                    : "text-foreground"
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: search (desktop only), translate, hamburger */}
        <div className="flex items-center gap-2 sm:gap-4">
          <form
            action="/temples"
            method="get"
            className="hidden items-center gap-2 rounded-full bg-saffron-light/50 px-4 py-2 lg:flex"
          >
            <button type="submit" aria-label="Search">
              <Search className="h-4 w-4 text-brown" />
            </button>
            <input
              type="text"
              name="q"
              placeholder="Search temples, states..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-brown/60"
            />
          </form>

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Hamburger button, sirf mobile/tablet pe dikhega */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden"
          >
            {open ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu: khulne wala panel */}
      {open && (
        <div className="border-t border-saffron-light bg-white px-4 pb-5 pt-3 md:hidden">
          {/* Mobile search */}
          <form
            action="/temples"
            method="get"
            className="mb-4 flex items-center gap-2 rounded-full bg-saffron-light/50 px-4 py-2"
          >
            <Search className="h-4 w-4 shrink-0 text-brown" />
            <input
              type="text"
              name="q"
              placeholder="Search temples, states..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-brown/60"
            />
          </form>

          {/* Mobile links */}
          <ul className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium ${active
                      ? "bg-saffron-light text-saffron-dark"
                      : "text-foreground hover:bg-saffron-light/40"
                      }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 border-t border-saffron-light pt-4">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}