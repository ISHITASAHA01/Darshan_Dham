import Link from "next/link";
import { states } from "@/data/temples";

export default function BrowseByState() {
    return (
        <section className="mx-auto max-w-7xl px-6 pb-16">
            <div className="mb-6 flex items-end justify-between">
                <div>
                    <h2 className="font-heading text-3xl font-semibold">Browse by State</h2>
                    <p className="text-sm text-brown">Find temples in your favorite state.</p>
                </div>
                <Link href="/states" className="text-sm text-saffron hover:underline">
                    View All States →
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {states.map((s) => (
                    <Link
                        key={s.name}
                        // href={`/states/${s.name.toLowerCase().replace(/\s+/g, "-")}`}
                        href={`/states/${s.slug}`}
                        className="rounded-xl border border-saffron-light bg-white p-4 text-center transition hover:border-saffron hover:shadow-md"
                    >
                        <p className="font-medium text-foreground">{s.name}</p>
                        {/* <p className="text-xs text-brown">({s.count} Temples)</p> */}
                        <p className="text-xs text-brown">({s.count} Temples)</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}