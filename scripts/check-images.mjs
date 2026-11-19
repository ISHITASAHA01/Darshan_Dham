import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "public", "images", "temples");
const OK_EXT = ["jpg", "jpeg", "png", "webp"];

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

const temples = [];
for (const f of ["temples.ts", "moreTemples.ts", "moreTemples2.ts"]) {
    const p = path.join(ROOT, "data", f);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");
    const re = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*state:\s*"([^"]+)"/g;
    let m;
    while ((m = re.exec(src))) temples.push({ slug: m[1], name: m[2], state: m[3] });
}

const files = fs.existsSync(DIR) ? fs.readdirSync(DIR) : [];
const exact = new Set(files.filter((f) => OK_EXT.includes(f.split(".").pop())).map((f) => f.replace(/\.[^.]+$/, "")));
const missing = temples.filter((t) => ![t.slug, ...(ALIASES[t.slug] ?? [])].some((n) => exact.has(n)));

console.log(`Total mandir: ${temples.length}, photo wali: ${temples.length - missing.length}, bina photo: ${missing.length}\n`);

for (const t of missing) {
    const key = t.slug.split("-").filter((w) => w.length > 3 && !["temple", "mandir"].includes(w));
    const near = files.filter((f) => key.filter((k) => f.toLowerCase().includes(k)).length >= 2);
    console.log(`✗ ${t.slug}  (${t.name}, ${t.state})`);
    if (near.length) console.log(`    shayad galat naam wali file: ${near.join(", ")}  ->  rename karke ${t.slug}.jpg karo`);
}

const bad = files.filter((f) => !OK_EXT.includes(f.split(".").pop()));
if (bad.length) console.log(`\nGalat extension: ${bad.join(", ")}`);
