import fs from "node:fs";

const args = process.argv.slice(2);
if (args.length === 0 || args.length % 4 !== 0) {
    console.log('Aise likho: node scripts/add-city.mjs lucknow Lucknow 26.8467 80.9462');
    process.exit(1);
}

const pages = ["app/calendar/page.tsx", "app/calander/page.tsx"].filter((p) => fs.existsSync(p));
const genFile = "scripts/generate-panchang.mjs";
let gen = fs.readFileSync(genFile, "utf8");
const pageSrc = Object.fromEntries(pages.map((p) => [p, fs.readFileSync(p, "utf8")]));

for (let i = 0; i < args.length; i += 4) {
    const [id, name, lat, lon] = args.slice(i, i + 4);
    if (!/^[a-z0-9-]+$/.test(id)) { console.log(`✗ ${id}: id sirf chhote letters, number aur - me hona chahiye`); continue; }
    if (isNaN(+lat) || isNaN(+lon)) { console.log(`✗ ${id}: latitude/longitude number hona chahiye`); continue; }

    if (gen.includes(`${id}: [`)) { console.log(`- ${id}: generator me pehle se hai`); }
    else {
        const re = /(const CITIES = \{[\s\S]*?)(\n\};)/;
        if (!re.test(gen)) { console.log("generator me CITIES nahi mila"); process.exit(1); }
        gen = gen.replace(re, `$1\n    ${id}: [${lat}, ${lon}],$2`);
    }
    for (const p of pages) {
        if (pageSrc[p].includes(`id: "${id}"`)) { console.log(`- ${id}: ${p} me pehle se hai`); continue; }
        const re = /(const CITIES = \[[\s\S]*?)(\n\];)/;
        if (!re.test(pageSrc[p])) { console.log(`${p} me CITIES nahi mila`); process.exit(1); }
        pageSrc[p] = pageSrc[p].replace(re, `$1\n    { id: "${id}", name: "${name}" },$2`);
    }
    console.log(`✓ ${name} jud gaya`);
}

fs.writeFileSync(genFile, gen);
for (const p of pages) fs.writeFileSync(p, pageSrc[p]);
console.log("\nAb ye chalao: node scripts/generate-panchang.mjs");
