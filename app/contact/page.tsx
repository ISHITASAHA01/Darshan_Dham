"use client";

import { useState } from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const inputClass =
  "w-full rounded-md border border-saffron-light bg-white px-3 py-2 text-sm outline-none focus:border-saffron";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const { t } = useLanguage();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
          website: fd.get("website"),
        }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main>
      <section className="bg-gradient-to-br from-navy to-saffron-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-heading text-4xl font-semibold md:text-5xl">
            {t("contact_title")}
          </h1>
          <p className="mt-2 text-white/85">{t("contact_sub")}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-2">
        {/* Contact info: apni asli details yahan likhna */}
        <div>
          <h2 className="mb-4 font-heading text-2xl font-semibold">
            {t("contact_info")}
          </h2>
          <ul className="space-y-4 text-sm text-brown">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-saffron" />
              {t("contact_addr")}
            </li>
            <li className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-saffron" />
              your-ishitasaha675@gmail.com
            </li>
            <li className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-saffron" />
              +91 1234567890
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-saffron" />
              {t("contact_hours")}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-2xl font-semibold">
            {t("send_msg")}
          </h2>

          {status === "sent" ? (
            <div className="rounded-lg border border-saffron/40 bg-saffron-light/50 p-6 text-brown">
              {t("thanks_msg")}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Bots ke liye jaal: insaan ko ye dikhta nahi */}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              <input name="name" required maxLength={100} className={inputClass} placeholder={t("your_name")} />
              <input
                name="email"
                required
                type="email"
                maxLength={150}
                className={inputClass}
                placeholder={t("your_email")}
              />
              <textarea
                name="message"
                required
                rows={5}
                maxLength={3000}
                className={inputClass}
                placeholder={t("your_message")}
              />

              {status === "error" && (
                <p className="text-sm text-red-600">{t("send_error")}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-md bg-saffron py-2.5 text-sm font-medium text-white hover:bg-saffron-dark disabled:opacity-60"
              >
                {status === "sending" ? t("sending") : t("send_button")}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}