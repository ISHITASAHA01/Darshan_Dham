"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { states } from "@/data/temples";
import { useLanguage } from "@/i18n/LanguageContext";

const images = [
  "/images/hero/hero1.jpg",
  "/images/hero/hero2.jpg",
  "/images/hero/hero3.jpg",
  "/images/hero/hero4.jpg",
  "/images/hero/hero5.jpg",
  "/images/hero/hero6.jpg",
];

export default function Hero() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[520px] w-full overflow-hidden">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Indian temple"
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 text-white">
        <p className="font-heading text-2xl">{t("hero_welcome")}</p>

        <h1 className="font-heading text-5xl font-semibold md:text-7xl">
          DARSHAN <span className="text-saffron">DHAM</span>
        </h1>
        <h2 className="mt-2 font-heading text-2xl md:text-3xl">
          {t("hero_tagline")}
        </h2>
        <p className="mt-3 max-w-lg text-white/85">
          {t("hero_subtext")}
        </p>

        {/* Search form: /temples?q=...&state=... pe le jayega */}
        <form
          action="/temples"
          method="get"
          className="mt-6 flex max-w-2xl flex-col gap-2 rounded-lg bg-white p-2 sm:flex-row"
        >
          <div className="flex flex-1 items-center gap-2 px-3">
            <Search className="h-5 w-5 text-brown" />
            <input
              type="text"
              name="q"
              placeholder={t("hero_search_placeholder")}
              className="w-full py-2 text-sm text-foreground outline-none"
            />
          </div>
          <div className="flex items-center gap-2 border-l border-saffron-light px-3">
            <MapPin className="h-5 w-5 text-brown" />
            <select
              name="state"
              defaultValue=""
              className="bg-transparent py-2 text-sm text-foreground outline-none"
            >
              <option value="">All States</option>
              {states.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="rounded-md bg-saffron px-6 py-2 font-medium text-white hover:bg-saffron-dark"
          >
            {t("search_button")}
          </button>
        </form>
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-saffron" : "w-2 bg-white/60"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
