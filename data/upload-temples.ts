
import { createClient } from "@supabase/supabase-js";
import { temples } from "./temples";
import { templeExtras } from "./templeExtras";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
    throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL ya SUPABASE_SERVICE_ROLE_KEY .env.local mein missing hai."
    );
}

const supabase = createClient(url, key, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
    },
    db: {
        schema: "public",
    },

});
console.log("Supabase URL:", url);
console.log("Table:", "temples");
const rows = temples.map((t, i) => {
    const x = templeExtras[t.slug] ?? {};

    return {
        slug: t.slug,
        name: t.name,
        state: t.state,
        city: t.city,
        deity: t.deity,
        timings: t.timings,
        pujas: t.pujas ?? [],
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
        published: true,
        sort_order: i + 1,
    };
});

async function main() {
    console.log(`Total temples: ${rows.length}`);

    for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50);

        const { error } = await supabase
            .from("temples")
            .upsert(batch, { onConflict: "slug" });

        if (error) {
            console.error("Upload error:", error.message);
            process.exitCode = 1;
            return;
        }

        console.log(
            `Uploaded: ${Math.min(i + batch.length, rows.length)} / ${rows.length}`
        );
    }

    console.log("SUCCESS! Saare temples Supabase mein upload ho gaye.");
}

main().catch((error) => {
    console.error("Upload failed:", error);
    process.exitCode = 1;
});
