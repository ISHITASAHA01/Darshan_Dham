// Chalane ka tarika (project ke root folder se):
//   node scripts/fetch-missing-images.mjs
//
// Ye script data/temples.ts + data/moreTemples.ts padhti hai, dekhti hai kis mandir ki
// photo public/images/temples/ me nahi hai, aur Wikipedia / Wikimedia Commons se
// khud dhoondh kar download kar deti hai. Har mandir ko haath se list me daalne ki zarurat nahi.
//
// Jo photo nahi milti unki list `missing-images-report.txt` me aa jayegi.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "images", "temples");
fs.mkdirSync(OUT, { recursive: true });

const EXTS = ["jpg", "jpeg", "png", "webp"];
const HEADERS = { "User-Agent": "DarshanDham/1.0 (student temple project)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// lib/temple-image.ts wale aliases (in slugs ko dobara download nahi karna)
const ALIASES = {
    "ghrishneshwar-temple": ["grishneshwar-temple"],
    "kalika-mata-temple-pavagadh": ["pavagadh-kalika-mata-temple"],
    "karni-mata-temple-deshnok": ["karni-mata-temple"],
    "khatu-shyam-temple": ["khatu-shyam-ji-temple"],
    "udupi-krishna-temple": ["udupi-sri-krishna-matha"],
    "shantadurga-temple-goa": ["shantadurga-temple"],
    "mahalasa-temple-goa": ["mahalasa-narayani-temple"],
    "mangueshi-temple-goa": ["mangueshi-temple"],
    "saptakoteshwar-temple-goa": ["saptakoteshwar-temple"],
    "durgiana-temple-amritsar": ["durgiana-temple"],
};

// Kuch mandir ke liye Wikipedia ka exact title pata ho to yahan daal sakti ho (optional)
const TITLE_HINTS = {
    "prem-mandir-vrindavan": "Prem Mandir",
    "hanuman-garhi-ayodhya": "Hanuman Garhi",
    "vindhyavasini-devi-temple": "Vindhyavasini Temple",
    "radha-raman-temple-vrindavan": "Radha Raman Temple",
    "rangji-temple-vrindavan": "Rangaji Temple",
    "madan-mohan-temple-vrindavan": "Madan Mohan Temple, Vrindavan",
    "govind-dev-temple-vrindavan": "Govind Dev Temple, Vrindavan",
    "radha-rani-temple-barsana": "Radha Rani Temple",
    "dwarkadhish-temple-mathura": "Dwarkadhish Temple, Mathura",
    "bhimashankar-temple": "Bhimashankar Temple",
    "palani-murugan-temple": "Palani Murugan Temple",
    "chamundeshwari-temple": "Chamundeshwari Temple",
    "mookambika-temple-kollur": "Kollur Mookambika Temple",
    "biraja-temple": "Biraja Temple",
    "samaleswari-temple": "Samaleswari Temple",
    "bhoramdeo-temple": "Bhoramdeo Temple",
    "maluti-temple-complex": "Maluti temples",
    "parshuram-kund-temple": "Parshuram Kund",
    "nartiang-durga-temple": "Nartiang Durga Temple",
};

// ---------- temples ki list data files se nikalo ----------
function readTemples() {
    const list = [];
    for (const file of ["temples.ts", "moreTemples.ts"]) {
        const p = path.join(ROOT, "data", file);
        if (!fs.existsSync(p)) continue;
        const src = fs.readFileSync(p, "utf8");
        const re = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*state:\s*"([^"]+)",\s*city:\s*"([^"]+)"/g;
        let m;
        while ((m = re.exec(src))) {
            list.push({ slug: m[1], name: m[2], state: m[3], city: m[4] });
        }
    }
    return list;
}

function hasImage(slug) {
    return [slug, ...(ALIASES[slug] ?? [])].some((n) =>
        EXTS.some((e) => fs.existsSync(path.join(OUT, `${n}.${e}`)))
    );
}

// ---------- Wikipedia / Commons search ----------
async function getJson(url) {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function byTitle(title) {
    const d = await getJson(
        "https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1" +
        `&prop=pageimages&pithumbsize=1200&titles=${encodeURIComponent(title)}`
    );
    const p = Object.values(d.query?.pages ?? {})[0];
    return p?.thumbnail?.source ?? null;
}

async function byWikiSearch(text) {
    const d = await getJson(
        "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search" +
        `&gsrlimit=5&prop=pageimages&pithumbsize=1200&gsrsearch=${encodeURIComponent(text)}`
    );
    const pages = Object.values(d.query?.pages ?? {}).sort((a, b) => a.index - b.index);
    return pages.find((p) => p.thumbnail)?.thumbnail.source ?? null;
}

// Commons me seedhi photo search. Map / logo / svg / flag jaisi galat files chhod deta hai.
const BAD_WORDS = /(map|logo|flag|locator|emblem|symbol|plan|diagram|stamp|coat_of_arms|poster|banner|\.svg|\.pdf|\.tif)/i;
async function byCommons(text) {
    const d = await getJson(
        "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
        "&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=1200" +
        `&gsrsearch=${encodeURIComponent(text)}`
    );
    const pages = Object.values(d.query?.pages ?? {}).sort((a, b) => a.index - b.index);
    const okMime = ["image/jpeg", "image/png", "image/webp"];
    const hit = pages.find((p) => {
        const info = p.imageinfo?.[0];
        if (!info || !okMime.includes(info.mime)) return false;
        if (BAD_WORDS.test(p.title)) return false;
        return (info.width ?? 0) >= (info.height ?? 0) * 0.9 && (info.width ?? 0) >= 800; // landscape + bada
    });
    return hit?.imageinfo[0]?.thumburl ?? null;
}

async function findImage(t) {
    const city = t.city.split(",")[0].trim();
    const steps = [];
    if (TITLE_HINTS[t.slug]) steps.push(() => byTitle(TITLE_HINTS[t.slug]));
    steps.push(() => byTitle(t.name));
    steps.push(() => byWikiSearch(`${t.name} ${city}`));
    steps.push(() => byCommons(`${t.name} ${city}`));
    steps.push(() => byCommons(`${t.name} ${t.state}`));

    for (const step of steps) {
        try {
            const url = await step();
            if (url) return url;
        } catch { /* agla tarika try karo */ }
        await sleep(300);
    }
    return null;
}

// ---------- main ----------
async function main() {
    const all = readTemples();
    const todo = all.filter((t) => !hasImage(t.slug));
    console.log(`Total mandir: ${all.length}, bina photo ke: ${todo.length}\n`);

    const ok = [];
    const failed = [];

    for (const t of todo) {
        try {
            const src = await findImage(t);
            if (!src) throw new Error("photo nahi mili");
            const img = await fetch(src, { headers: HEADERS });
            if (!img.ok) throw new Error(`download fail (${img.status})`);
            const ext = (src.split("?")[0].split(".").pop() || "jpg").toLowerCase();
            const finalExt = EXTS.includes(ext) ? ext : "jpg";
            fs.writeFileSync(
                path.join(OUT, `${t.slug}.${finalExt}`),
                Buffer.from(await img.arrayBuffer())
            );
            console.log(`✓ ${t.slug}`);
            ok.push(t.slug);
        } catch (e) {
            console.log(`✗ ${t.slug}: ${e.message}`);
            failed.push(t);
        }
        await sleep(600);
    }

    console.log(`\nNayi photos mili: ${ok.length}, nahi mili: ${failed.length}`);

    if (failed.length) {
        const lines = failed.map(
            (t) => `${t.slug}.jpg   <- ${t.name}, ${t.city}, ${t.state}`
        );
        fs.writeFileSync(
            path.join(ROOT, "missing-images-report.txt"),
            "Ye photos haath se public/images/temples/ me daalni hain (file ka naam bilkul yahi rakho):\n\n" +
            lines.join("\n") + "\n"
        );
        console.log("List `missing-images-report.txt` me save ho gayi.");
    }
    if (ok.length) {
        console.log("\nZaroor dekh lo: kuch photos galat ho sakti hain (script pehli matching photo leti hai).");
    }
}

main();
