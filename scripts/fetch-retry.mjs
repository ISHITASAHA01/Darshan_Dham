
// node scripts/fetch-retry.mjs
// mandir check kar ne k liye kitni mandiro ki photo public/images/temples/ me nahi hai aur Wikipedia
//  Wikimedia Commons se khud dhoondh kar download kar deti hai. Har mandir ko haath se list me daalne ki zarurat nahi.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "images", "temples");
const EXTS = ["jpg", "jpeg", "png", "webp"];
const HEADERS = { "User-Agent": "DarshanDham/1.0 (student temple project; contact: local)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

function readTemples() {
    const list = [];
    for (const file of ["temples.ts", "moreTemples.ts", "moreTemples2.ts"]) {
        const p = path.join(ROOT, "data", file);
        if (!fs.existsSync(p)) continue;
        const src = fs.readFileSync(p, "utf8");
        const re = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*state:\s*"([^"]+)",\s*city:\s*"([^"]+)"/g;
        let m;
        while ((m = re.exec(src))) list.push({ slug: m[1], name: m[2], state: m[3], city: m[4] });
    }
    return list;
}
const hasImage = (slug) =>
    [slug, ...(ALIASES[slug] ?? [])].some((n) => EXTS.some((e) => fs.existsSync(path.join(OUT, `${n}.${e}`))));

// 429 aaye to ruk kar dobara try karta hai
async function get(url, asJson) {
    for (let i = 1; i <= 5; i++) {
        const res = await fetch(url, { headers: HEADERS });
        if (res.status === 429 || res.status >= 500) {
            console.log(`   ...server ne roka (${res.status}), ${i * 8} second ruk rahe hain`);
            await sleep(i * 8000);
            continue;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return asJson ? res.json() : res;
    }
    throw new Error("server baar baar mana kar raha hai");
}

const BAD = /(map|logo|flag|locator|emblem|symbol|plan\b|diagram|stamp|poster|banner|\.svg|\.pdf|\.tif|\.ogg|\.webm)/i;

async function byCommons(q) {
    const d = await get(
        "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
        "&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=960" +
        `&gsrsearch=${encodeURIComponent(q + " filetype:bitmap")}`, true);
    const pages = Object.values(d.query?.pages ?? {}).sort((a, b) => a.index - b.index);
    const hit = pages.find((p) => {
        const i = p.imageinfo?.[0];
        return i && ["image/jpeg", "image/png"].includes(i.mime) && !BAD.test(p.title) && (i.width ?? 0) >= 500;
    });
    return hit?.imageinfo[0]?.thumburl ?? null;
}
async function byWiki(q) {
    const d = await get(
        "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search" +
        `&gsrlimit=5&prop=pageimages&pithumbsize=960&gsrsearch=${encodeURIComponent(q)}`, true);
    const pages = Object.values(d.query?.pages ?? {}).sort((a, b) => a.index - b.index);
    return pages.find((p) => p.thumbnail && !BAD.test(decodeURIComponent(p.thumbnail.source)))?.thumbnail.source ?? null;
}

function queries(t) {
    const city = t.city.split(",")[0].trim();
    const core = t.name.replace(/\(.*?\)/g, "").replace(/\b(shri|sri|shree|maa|ma|temple|mandir|devi)\b/gi, "").replace(/\s+/g, " ").trim();
    return [
        () => byWiki(`${t.name} ${city}`),
        () => byCommons(`${t.name} ${city}`),
        () => byCommons(`${core} ${city}`),
        () => byCommons(`${core} temple ${t.state}`),
        () => byCommons(`${core} mandir`),
        () => byCommons(core),
    ];
}

async function main() {
    const todo = readTemples().filter((t) => !hasImage(t.slug));
    console.log(`Bina photo ke: ${todo.length}\n`);
    const failed = [];
    let ok = 0;

    for (const t of todo) {
        let src = null;
        for (const q of queries(t)) {
            try { src = await q(); } catch { }
            if (src) break;
            await sleep(700);
        }
        try {
            if (!src) throw new Error("photo nahi mili");
            const img = await get(src, false);
            const ext = (src.split("?")[0].split(".").pop() || "jpg").toLowerCase();
            fs.writeFileSync(path.join(OUT, `${t.slug}.${EXTS.includes(ext) ? ext : "jpg"}`), Buffer.from(await img.arrayBuffer()));
            console.log(`✓ ${t.slug}`);
            ok++;
        } catch (e) {
            console.log(`✗ ${t.slug}: ${e.message}`);
            failed.push(t);
        }
        await sleep(1500);
    }

    console.log(`\nMili: ${ok}, nahi mili: ${failed.length}`);
    if (failed.length) {
        fs.writeFileSync(path.join(ROOT, "missing-images-report.txt"),
            "Ye photos haath se public/images/temples/ me daalni hain:\n\n" +
            failed.map((t) => `${t.slug}.jpg   <- ${t.name}, ${t.city}, ${t.state}`).join("\n") + "\n");
        console.log("List missing-images-report.txt me save ho gayi.");
    }
}
main();
