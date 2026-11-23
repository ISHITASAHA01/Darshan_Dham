import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { temples as fileTemples, slugify } from "@/data/temples";
import { templeExtras } from "@/data/templeExtras";
import type { TempleFull } from "@/lib/temple-types";

type Row = {
    slug: string;
    name: string;
    state: string;
    city: string;
    deity: string;
    timings: string;
    pujas: { name: string; time: string }[] | null;
    story: string;
    note: string | null;
    lat: number;
    lng: number;
    image: string | null;
    website: string | null;
    best_time: string | null;
    nearest_railway: string | null;
    nearest_airport: string | null;
    entry_fee: string | null;
    dress_code: string | null;
    checked: string | null;
};

function fromRow(r: Row): TempleFull {
    return {
        slug: r.slug,
        name: r.name,
        state: r.state,
        city: r.city,
        deity: r.deity,
        timings: r.timings,
        pujas: r.pujas ?? [],
        story: r.story,
        note: r.note ?? undefined,
        lat: r.lat,
        lng: r.lng,
        image: r.image ?? undefined,
        website: r.website ?? undefined,
        bestTime: r.best_time ?? undefined,
        nearestRailway: r.nearest_railway ?? undefined,
        nearestAirport: r.nearest_airport ?? undefined,
        entryFee: r.entry_fee ?? undefined,
        dressCode: r.dress_code ?? undefined,
        checked: r.checked ?? undefined,
    };
}

// Safety: database na chale to purani files se kaam chalao
function fromFiles(): TempleFull[] {
    return fileTemples.map((t) => ({ ...t, ...(templeExtras[t.slug] ?? {}) }));
}



export const getAllTemples = cache(async (): Promise<TempleFull[]> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Local file se shuru karo
    const merged = new Map<string, TempleFull>(
        fromFiles().map((temple) => [temple.slug, temple])
    );

    // Supabase configured nahi hai to local data return karo
    if (!url || !key) {
        return Array.from(merged.values());
    }

    try {
        const supabase = createClient(url, key, {
            auth: { persistSession: false },
        });

        const { data, error } = await supabase
            .from("temples")
            .select("*")
            .eq("published", true)
            .order("sort_order", { ascending: true })
            .order("name", { ascending: true });

        if (error) {
            console.error("Supabase error, local temples use ho rahe hain:", error.message);
            return Array.from(merged.values());
        }

        // Supabase ka data bhi add karo.
        // Same slug hua to Supabase ka updated record use hoga.
        if (data && data.length > 0) merged.clear();

        // Supabase ka data bhi add karo.
        // Same slug hua to Supabase ka updated record use hoga.
        for (const row of (data ?? []) as Row[]) {
            merged.set(row.slug, fromRow(row));
        }

        return Array.from(merged.values());


        return Array.from(merged.values());
    } catch (error) {
        console.error("Supabase error:", error);
        return Array.from(merged.values());
    }
});

export async function getTempleBySlug(slug: string) {
    const all = await getAllTemples();
    return all.find((t) => t.slug === slug);
}

export async function getPopularTemples(n = 8) {
    const all = await getAllTemples();
    return all.slice(0, n);
}

export type StateItem = { name: string; slug: string; count: number };

export const getStates = cache(async (): Promise<StateItem[]> => {
    const all = await getAllTemples();
    const names = Array.from(new Set(all.map((t) => t.state)));
    return names.map((name) => ({
        name,
        slug: slugify(name),
        count: all.filter((t) => t.state === name).length,
    }));
});