import { createClient } from "@supabase/supabase-js";
import { temples } from "../data/temples";
import { templeExtras } from "../data/templeExtras";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    console.error("`.env.local` me NEXT_PUBLIC_SUPABASE_URL aur SUPABASE_SERVICE_ROLE_KEY nahi mile.");
    process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const rows = temples.map((t, i) => {
    const x = templeExtras[t.slug] ?? {};
    return {
        slug: t.slug,
        name: t.name,
        state: t.state,
        city: t.city,
        deity: t.deity,
        timings: t.timings,
        pujas: t.pujas,
        story: t.story,
        note: t.note ?? null,
        lat: t.lat,
        lng: t.lng,
        image: t.image ?? null,
        website: x.website ?? null,
        best_time: x.bestTime ?? null,
        nearest_railway: x.nearestRailway ?? null,
        nearest_airport: x.nearestAirport ?? null,
        entry_fee: x.entryFee ?? null,
        dress_code: x.dressCode ?? null,
        checked: x.checked ?? null,
        sort_order: i + 1,
    };
});

async function main() {
    for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50);
        const { error } = await supabase
            .from("temples")
            .upsert(batch, { onConflict: "slug" });
        if (error) {
            console.error("Error:", error.message);
            process.exit(1);
        }
        console.log(`✓ ${Math.min(i + 50, rows.length)} / ${rows.length}`);
    }
    console.log("Ho gaya. Saare mandir database me hain.");
}

main();