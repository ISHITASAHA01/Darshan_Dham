
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Sun, Moon, UserCircle } from "lucide-react";
import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
const links = [
  { key: "nav_home", href: "/" },
  { key: "nav_temples", href: "/temples" },
  { key: "nav_calendar", href: "/calendar" },
  { key: "nav_favorites", href: "/favorites" },
  { key: "nav_states", href: "/states" },
  { key: "nav_about", href: "/about" },
  { key: "nav_contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useLanguage();



  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createSupabaseBrowserClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (mounted) setIsLoggedIn(!!user);

      supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          if (mounted) setIsLoggedIn(!!session?.user);
        });
    }

    checkUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const dark = document.documentElement.classList.contains("dark");
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;

    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);

    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-saffron-light bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/logo/logo.png"
            alt="DARSHAN DHAM"
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
          />
          <div className="notranslate whitespace-nowrap leading-tight">
            <p className="font-heading text-base font-semibold text-foreground sm:text-xl">
              DARSHAN DHAM
            </p>
            <p className="hidden text-[11px] text-brown sm:block">
              {t("tagline")}
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`whitespace-nowrap pb-1 text-sm font-medium transition-colors hover:text-saffron ${active
                    ? "border-b-2 border-saffron text-saffron"
                    : "text-foreground"
                    }`}
                >
                  {t(link.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Desktop search */}
          <form
            action="/temples"
            method="get"
            className="hidden items-center gap-2 rounded-full bg-saffron-light/50 px-4 py-2 xl:flex"
          >
            <button type="submit" aria-label="Search">
              <Search className="h-4 w-4 text-brown" />
            </button>
            <input
              type="text"
              name="q"
              placeholder="Search temples, states..."
              className="w-36 bg-transparent text-sm outline-none placeholder:text-brown/60"
            />
          </form>

          {/* Search icon: chhoti screen par poora search box nahi */}
          <Link href="/temples" aria-label="Search temples" title="Search temples" className="hidden items-center justify-center rounded-full border border-saffron-light p-2 text-foreground transition hover:bg-saffron-light lg:flex xl:hidden">
            <Search className="h-4 w-4" />
          </Link>

          {/* Language switcher */}
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Theme toggle */}

          <Link
            href={isLoggedIn ? "/account" : "/login"}
            aria-label={isLoggedIn ? "My Account" : "Login"}
            title={isLoggedIn ? "My Account" : "Login"}
            className="flex items-center justify-center rounded-full bg-saffron p-2 text-white transition hover:bg-saffron-dark"
          >
            <UserCircle className="h-4 w-4" />
          </Link>

          <button
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
            className="rounded-full border border-saffron-light p-2 text-foreground transition hover:bg-saffron-light"
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden"
          >
            {open ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-saffron-light bg-background px-4 pb-5 pt-3 lg:hidden">
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
          <li>
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-md bg-saffron px-3 py-2.5 text-sm font-semibold text-white"
            >
              <UserCircle className="h-4 w-4" />
              {isLoggedIn ? "My Account" : "Login / Sign Up"}
            </Link>
          </li>
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
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile language switcher */}
          <div className="mt-4 border-t border-saffron-light pt-4">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
