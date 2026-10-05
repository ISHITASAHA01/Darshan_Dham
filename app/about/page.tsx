"use client";

import { Target, Eye, Heart } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const cards = [
  { icon: Target, title: "mission_t", text: "mission_x" },
  { icon: Eye, title: "vision_t", text: "vision_x" },
  { icon: Heart, title: "values_t", text: "values_x" },
];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main>
      <section className="bg-gradient-to-br from-navy to-saffron-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-heading text-4xl font-semibold md:text-5xl">
            {t("about_title")}
          </h1>
          <p className="mt-2 text-white/85">{t("about_sub")}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="font-heading text-3xl font-semibold">{t("about_h2")}</h2>
        <p className="mt-4 leading-relaxed text-brown">{t("about_p")}</p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-6 pb-16 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-saffron-light bg-white p-6 shadow-sm"
          >
            <Icon className="h-8 w-8 text-saffron" />
            <h3 className="mt-3 font-semibold">{t(title)}</h3>
            <p className="mt-1 text-sm text-brown">{t(text)}</p>
          </div>
        ))}
      </section>
    </main>
  );
}