import { Target, Eye, Heart } from "lucide-react";

const cards = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To make temple exploration easy, accessible and reliable for everyone.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    text: "To connect every devotee with India's divine heritage.",
  },
  {
    icon: Heart,
    title: "Our Values",
    text: "Faith, accuracy, simplicity and community.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-navy to-saffron-dark py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="font-heading text-4xl font-semibold md:text-5xl">
            About DARSHAN DHAM
          </h1>
          <p className="mt-2 text-white/85">Our Mission, Vision & Story</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="font-heading text-3xl font-semibold">
          Connecting People with India&apos;s Divine Heritage
        </h2>
        <p className="mt-4 leading-relaxed text-brown">
          DARSHAN DHAM is a platform to discover temples across India.. For
          each temple you can find its real location on a map, its history and
          story, opening and closing times, and puja and aarti timings, all in
          one place, so that your journey is meaningful and easy.
        </p>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-6 pb-16 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-saffron-light bg-white p-6 shadow-sm"
          >
            <Icon className="h-8 w-8 text-saffron" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-brown">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
