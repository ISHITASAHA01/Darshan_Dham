"use client";

import { useState } from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const inputClass =
  "w-full rounded-md border border-saffron-light bg-white px-3 py-2 text-sm outline-none focus:border-saffron";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main>
      <section className="bg-gradient-to-br from-navy to-saffron-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-heading text-4xl font-semibold md:text-5xl">
            Get in Touch
          </h1>
          <p className="mt-2 text-white/85">We&apos;d love to hear from you</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-2">
        {/* Contact info: apni asli details yahan likhna */}
        <div>
          <h2 className="mb-4 font-heading text-2xl font-semibold">
            Contact Information
          </h2>
          <ul className="space-y-4 text-sm text-brown">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-saffron" />
              DARSHAN DHAM, New Delhi, India
            </li>
            <li className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0 text-saffron" />
              your-email@example.com
            </li>
            <li className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0 text-saffron" />
              +91 00000 00000
            </li>
            <li className="flex gap-3">
              <Clock className="h-5 w-5 shrink-0 text-saffron" />
              Mon - Sun, 9:00 AM - 6:00 PM
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 font-heading text-2xl font-semibold">
            Send Us a Message
          </h2>

          {sent ? (
            <div className="rounded-lg border border-saffron/40 bg-saffron-light/50 p-6 text-brown">
              Thank you! Your message has been received.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4"
            >
              <input required className={inputClass} placeholder="Your name" />
              <input
                required
                type="email"
                className={inputClass}
                placeholder="Your email"
              />
              <textarea
                required
                rows={5}
                className={inputClass}
                placeholder="Your message"
              />
              <button
                type="submit"
                className="w-full rounded-md bg-saffron py-2.5 text-sm font-medium text-white hover:bg-saffron-dark"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
