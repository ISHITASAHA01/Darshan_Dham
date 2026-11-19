import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "data", "panchang");
fs.mkdirSync(OUT_DIR, { recursive: true });

const URL_ = "https://panchang.devdarsha.com/v1/panchang/daily";
const CITIES = ["delhi", "kolkata", "mumbai", "bangalore", "chennai", "hyderabad", "ahmedabad", "pune", "jaipur", "varanasi"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readKey() {
    if (process.env.DEVDARSHA_API_KEY) return process.env.DEVDARSHA_API_KEY;
    const p = path.join(ROOT, ".env.local");
    if (fs.existsSync(p)) {
        const m = fs.readFileSync(p, "utf8").match(/^DEVDARSHA_API_KEY=(.*)$/m);
        if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    }
    return null;
}
const KEY = readKey();
if (!KEY) {
    console.log("DEVDARSHA_API_KEY .env.local me nahi mili.");
    process.exit(1);
}

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const now = new Date();
const START = process.argv[2] || iso(new Date(now.getFullYear(), now.getMonth(), 1));
const END = process.argv[3] || "2027-12-31";

function* dateRange(from, to) {
    const d = new Date(from + "T00:00:00");
    const end = new Date(to + "T00:00:00");
    while (d <= end) {
        yield iso(d);
        d.setDate(d.getDate() + 1);
    }
}

async function call(date, city) {
    for (let i = 1; i <= 5; i++) {
        const res = await fetch(URL_, {
            method: "POST",
            headers: { "X-Api-Key": KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ date, city_id: city, timezone: "Asia/Kolkata" }),
        });
        if (res.status === 429) {
            const wait = Number(res.headers.get("retry-after") || 0);
            if (wait > 300) {
                const at = new Date(Date.now() + wait * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
                console.log(`\nAaj ki free limit khatam. Server kehta hai ${Math.round(wait / 3600)} ghante baad aana. Dobara chalao: ${at} (India time) ke baad.`);
                process.exit(0);
            }
            console.log(`   server ne roka (429), 60 second ruk rahe hain`);
            await sleep(60000);
            continue;
        }
        let body = null;
        try { body = await res.json(); } catch { }
        if (res.ok) return { ok: true, data: body };
        return { ok: false, message: body?.message || body?.error || `HTTP ${res.status}` };
    }
    console.log("\nServer abhi bhi limit laga raha hai. 15 minute baad script dobara chalao, jo save ho chuka hai wo safe hai aur script wahin se aage badhegi.");
    process.exit(0);
}

const load = (city) => {
    try { return JSON.parse(fs.readFileSync(path.join(OUT_DIR, `${city}.json`), "utf8")); } catch { return {}; }
};
const save = (city, obj) => {
    const sorted = Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(path.join(OUT_DIR, `${city}.json`), JSON.stringify(sorted, null, 1));
};

async function main() {
    console.log(`Dates: ${START} se ${END} tak\n`);

    const first = CITIES[0];
    const saved = load(first);
    let firstOk = null, lastOk = null, fails = 0, lastMsg = "";

    for (const date of dateRange(START, END)) {
        if (saved[date]) {
            firstOk ??= date; lastOk = date; fails = 0;
            continue;
        }
        const r = await call(date, first);
        if (r.ok) {
            saved[date] = r.data;
            firstOk ??= date; lastOk = date; fails = 0;
            console.log(`✓ ${first} ${date}`);
            save(first, saved);
        } else {
            fails++; lastMsg = r.message;
            if (firstOk && fails >= 2) break;
            if (!firstOk && fails >= 40) break;
        }
        await sleep(6000);
    }

    if (!firstOk) {
        console.log(`\nKoi bhi date nahi mili. API ka jawab: ${lastMsg}`);
        process.exit(1);
    }
    console.log(`\nFree dates: ${firstOk} se ${lastOk} tak\n`);

    for (const city of CITIES.slice(1)) {
        const data = load(city);
        for (const date of dateRange(firstOk, lastOk)) {
            if (data[date]) continue;
            const r = await call(date, city);
            if (r.ok) {
                data[date] = r.data;
                console.log(`✓ ${city} ${date}`);
                save(city, data);
            } else {
                console.log(`✗ ${city} ${date}: ${r.message}`);
            }
            await sleep(6000);
        }
    }

    console.log("\nKhatam. Files data/panchang/ me save ho gayi.");
}
main();
