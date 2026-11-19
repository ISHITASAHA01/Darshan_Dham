// Chalao: node scripts/generate-panchang.mjs
// API ki zarurat nahi. Sooraj-chandrama ki position se Panchang khud calculate karke
// data/panchang-computed/<city>.json me 2026-11-01 se 2027-12-31 tak save karta hai.
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "data", "panchang-computed");
const FROM = "2026-11-01", TO = "2027-12-31";
const CITIES = {
    delhi: [28.6139, 77.2090], kolkata: [22.5726, 88.3639], mumbai: [19.0760, 72.8777],
    bangalore: [12.9716, 77.5946], chennai: [13.0827, 80.2707], hyderabad: [17.3850, 78.4867],
    ahmedabad: [23.0225, 72.5714], pune: [18.5204, 73.8567], jaipur: [26.9124, 75.7873],
    varanasi: [25.3176, 82.9739],
    lucknow: [26.8467, 80.9462],
    patna: [25.5941, 85.1376],
    bhopal: [23.2599, 77.4126],
    indore: [22.7196, 75.8577],
    chandigarh: [30.7333, 76.7794],
    ayodhya: [26.7922, 82.1998],
    mathura: [27.4924, 77.6737],
    haridwar: [29.9457, 78.1642],
    ujjain: [23.1765, 75.7885],
    nagpur: [21.1458, 79.0882],
    surat: [21.1702, 72.8311],
    bhubaneswar: [20.2961, 85.8245],
    guwahati: [26.1445, 91.7362],
    ranchi: [23.3441, 85.3096],
    amritsar: [31.6340, 74.8723],
    kochi: [9.9312, 76.2673],
};

// ---------- astronomy (Meeus) ----------
const R = Math.PI / 180, J2000 = 2451545.0;
const norm = (x) => ((x % 360) + 360) % 360;
const wrap = (x) => { x = norm(x); return x > 180 ? x - 360 : x; };
const Tc = (jd) => (jd + 69 / 86400 - J2000) / 36525;
const jdOfMs = (ms) => ms / 86400000 + 2440587.5;
const msOfJd = (jd) => (jd - 2440587.5) * 86400000;

function sunTrop(jd) {
    const T = Tc(jd);
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * R) +
        (0.019993 - 0.000101 * T) * Math.sin(2 * M * R) + 0.000289 * Math.sin(3 * M * R);
    return norm(L0 + C - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * R));
}
const MT = [[0,0,1,0,6288774],[2,0,-1,0,1274027],[2,0,0,0,658314],[0,0,2,0,213618],[0,1,0,0,-185116],[0,0,0,2,-114332],[2,0,-2,0,58793],[2,-1,-1,0,57066],[2,0,1,0,53322],[2,-1,0,0,45758],[0,1,-1,0,-40923],[1,0,0,0,-34720],[0,1,1,0,-30383],[2,0,0,-2,15327],[0,0,1,2,-12528],[0,0,1,-2,10980],[4,0,-1,0,10675],[0,0,3,0,10034],[4,0,-2,0,8548],[2,1,-1,0,-7888],[2,1,0,0,-6766],[1,0,-1,0,-5163],[1,1,0,0,4987],[2,-1,1,0,4036],[2,0,2,0,3994],[4,0,0,0,3861],[2,0,-3,0,3665],[0,1,-2,0,-2689],[2,0,-1,2,-2602],[2,-1,-2,0,2390],[1,0,1,0,-2348],[2,-2,0,0,2236],[0,1,2,0,-2120],[0,2,0,0,-2069],[2,-2,-1,0,2048],[2,0,1,-2,-1773],[2,0,0,2,-1595],[4,-1,-1,0,1215],[0,0,2,2,-1110],[3,0,-1,0,-892],[2,1,1,0,-810],[4,-1,-2,0,759],[0,2,-1,0,-713],[2,2,-1,0,-700],[2,1,-2,0,691],[2,-1,0,-2,596],[4,0,1,0,549],[0,0,4,0,537],[4,-1,0,0,520],[1,0,-2,0,-487],[2,1,0,-2,-399],[0,0,2,-2,-381],[1,1,1,0,351],[3,0,-2,0,-340],[4,0,-3,0,330],[2,-1,2,0,327],[0,2,1,0,-323],[1,1,-1,0,299],[2,0,3,0,294]];
function moonTrop(jd) {
    const T = Tc(jd), T2 = T * T, T3 = T2 * T, T4 = T3 * T;
    const Lp = norm(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000);
    const D = norm(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000);
    const M = norm(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000);
    const Mp = norm(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000);
    const F = norm(93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000);
    const E = 1 - 0.002516 * T - 0.0000074 * T2;
    let s = 0;
    for (const [d, m, mp, f, c] of MT) {
        const am = Math.abs(m);
        s += c * (am === 1 ? E : am === 2 ? E * E : 1) * Math.sin((d * D + m * M + mp * Mp + f * F) * R);
    }
    s += 3958 * Math.sin(norm(119.75 + 131.849 * T) * R) + 1962 * Math.sin((Lp - F) * R) + 318 * Math.sin(norm(53.09 + 479264.290 * T) * R);
    return norm(Lp + s / 1e6 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * R));
}
const ayan = (jd) => 23.8676 + 1.3969 * Tc(jd);            // Lahiri
const sidSun = (jd) => norm(sunTrop(jd) - ayan(jd));
const sidMoon = (jd) => norm(moonTrop(jd) - ayan(jd));
const elong = (jd) => norm(moonTrop(jd) - sunTrop(jd));
const yogaVal = (jd) => norm(sidSun(jd) + sidMoon(jd));

function solveTo(fn, target, jd, rate) {
    for (let i = 0; i < 14; i++) {
        const d = wrap(target - fn(jd));
        jd += d / rate;
        if (Math.abs(d) < 1e-7) break;
    }
    return jd;
}
function sunAlt(jd, lat, lon) {
    const T = Tc(jd), eps = (23.43929 - 0.0130042 * T) * R, l = sunTrop(jd) * R;
    const ra = Math.atan2(Math.cos(eps) * Math.sin(l), Math.cos(l));
    const dec = Math.asin(Math.sin(eps) * Math.sin(l));
    const H = norm(280.46061837 + 360.98564736629 * (jd - J2000) + lon) * R - ra;
    return Math.asin(Math.sin(lat * R) * Math.sin(dec) + Math.cos(lat * R) * Math.cos(dec) * Math.cos(H)) / R;
}
function bisect(f, a, b) {
    const fa = f(a) > 0;
    for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if ((f(m) > 0) === fa) a = m; else b = m; }
    return (a + b) / 2;
}
const midnightJd = (y, m, d) => jdOfMs(Date.UTC(y, m - 1, d) - 19800000);   // IST midnight
function riseSet(y, m, d, lat, lon) {
    const t0 = midnightJd(y, m, d), f = (j) => sunAlt(j, lat, lon) + 0.833;
    return [bisect(f, t0 + 0.15, t0 + 0.5), bisect(f, t0 + 0.5, t0 + 0.95)];
}

// ---------- names ----------
const TN = ["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi"];
const tithiName = (i) => i === 14 ? "Purnima" : i === 29 ? "Amavasya" : `${i < 15 ? "Shukla" : "Krishna"} ${TN[i % 15]}`;
const NAK = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"];
const YOG = ["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"];
const KAR7 = ["Bava","Balava","Kaulava","Taitila","Gara","Vanija","Vishti (Bhadra)"];
const karName = (i) => i === 0 ? "Kimstughna" : i >= 57 ? ["Shakuni","Chatushpada","Naga"][i - 57] : KAR7[(i - 1) % 7];
const LMONTH = ["Chaitra","Vaishakha","Jyeshtha","Ashadha","Shravana","Bhadrapada","Ashwin","Kartika","Margashirsha","Pausha","Magha","Phalguna"];
const RASHI = ["Mesha","Vrishabha","Mithuna","Karka","Simha","Kanya","Tula","Vrishchika","Dhanu","Makara","Kumbha","Meena"];
const BMONTH = ["Boishakh","Joishtho","Asharh","Srabon","Bhadro","Ashwin","Kartik","Agrahayan","Poush","Magh","Falgun","Choitro"];
const WD = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const EK_SH = ["Kamada","Mohini","Nirjala","Devshayani","Putrada (Pavitropana)","Parivartini","Papankusha","Dev Uthani (Prabodhini)","Mokshada","Putrada","Jaya","Amalaki"];
const EK_KR = ["Papmochani","Varuthini","Apara","Yogini","Kamika","Aja","Indira","Rama","Utpanna","Saphala","Shattila","Vijaya"];

// ---------- formatting ----------
const istDate = (jd) => new Date(msOfJd(jd) + 19800000);
const p2 = (n) => String(n).padStart(2, "0");
const fmtDT = (jd) => { const d = istDate(jd); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())} ${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; };
const fmtT = (jd) => { const d = istDate(jd); const h = d.getUTCHours(); return `${p2(h % 12 || 12)}:${p2(d.getUTCMinutes())} ${h < 12 ? "AM" : "PM"}`; };
const istKey = (jd) => { const d = istDate(jd); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`; };
const keyToUtcMs = (k) => Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
const addDays = (k, n) => { const d = new Date(keyToUtcMs(k) + n * 86400000); return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}`; };

function segments(fn, unit, rate, nameOf, sr, sr2) {
    const out = [], v = fn(sr);
    let idx = Math.floor(v / unit);
    let start = solveTo(fn, norm(idx * unit), sr - (v - idx * unit) / rate, rate);
    for (let g = 0; g < 6; g++) {
        const end = solveTo(fn, norm((idx + 1) * unit), start + unit / rate, rate);
        out.push({ name: nameOf(idx), start: fmtDT(start), end: fmtDT(end) });
        if (end >= sr2) break;
        start = end; idx++;
    }
    return out;
}

// ---------- lunations & sankrantis ----------
const NM = [];
{
    let g = jdOfMs(Date.UTC(2025, 11, 20, 1, 43));
    for (let i = 0; i < 32; i++) { g = solveTo(elong, 0, g, 12.19); NM.push(g); g += 29.53; }
}
const LUN = [];
{
    let vs = 2082;
    for (let i = 0; i < NM.length - 1; i++) {
        const rs = Math.floor(sidSun(NM[i]) / 30), re = Math.floor(sidSun(NM[i + 1]) / 30);
        const adhika = rs === re, mi = (rs + 1) % 12;
        if (mi === 0 && !adhika) vs++;
        LUN.push({ start: NM[i], end: NM[i + 1], mi, adhika, vs });
    }
}
const lunAt = (jd) => LUN.find((l) => jd >= l.start && jd < l.end);

const SANK = [];
{
    let prev = null;
    for (let k = addDays("2025-12-01", 0), n = 0; n < 800; n++, k = addDays(k, 1)) {
        const jd = midnightJd(+k.slice(0, 4), +k.slice(5, 7), +k.slice(8, 10));
        const r = Math.floor(sidSun(jd) / 30);
        if (prev !== null && r !== prev) {
            const s = solveTo(sidSun, r * 30, jd - 0.5, 0.9856);
            SANK.push({ jd: s, rashi: r, civil: istKey(s) });
        }
        prev = r;
    }
}
const BSTART = SANK.map((s) => ({ key: addDays(s.civil, 1), rashi: s.rashi }));   // Bengali month sankranti ke agle din shuru
function bengali(key) {
    let cur = null, boishakh = null;
    for (const b of BSTART) { if (b.key <= key) { cur = b; if (b.rashi === 0) boishakh = b; } }
    if (!cur) return null;
    const day = Math.round((keyToUtcMs(key) - keyToUtcMs(cur.key)) / 86400000) + 1;
    return { day, month: BMONTH[cur.rashi], year: boishakh ? +boishakh.key.slice(0, 4) - 593 : null };
}

// ---------- festivals ----------
// [name, amanta month, tithi (1-30), time of day]
const FEST = [
    ["Vasant Panchami","Magha",5,"purvahna"],["Ratha Saptami","Magha",7,"sunrise"],
    ["Maha Shivratri","Magha",29,"nishita"],["Holika Dahan","Phalguna",15,"pradosh"],
    ["Chaitra Navratri begins / Ugadi / Gudi Padwa","Chaitra",1,"sunrise"],["Ram Navami","Chaitra",9,"madhyahna"],["Hanuman Jayanti","Chaitra",15,"sunrise"],
    ["Akshaya Tritiya","Vaishakha",3,"purvahna"],["Buddha Purnima","Vaishakha",15,"sunrise"],
    ["Rath Yatra","Ashadha",2,"sunrise"],["Guru Purnima","Ashadha",15,"sunrise"],
    ["Nag Panchami","Shravana",5,"sunrise"],["Raksha Bandhan","Shravana",15,"aparahna"],["Janmashtami","Shravana",23,"nishita"],
    ["Ganesh Chaturthi","Bhadrapada",4,"madhyahna"],["Anant Chaturdashi","Bhadrapada",14,"sunrise"],["Mahalaya Amavasya (Sarva Pitru)","Bhadrapada",30,"sunrise"],
    ["Sharad Navratri begins","Ashwin",1,"sunrise"],["Maha Shashthi (Durga Puja)","Ashwin",6,"sunrise"],["Maha Saptami (Durga Puja)","Ashwin",7,"sunrise"],
    ["Maha Ashtami (Durga Ashtami)","Ashwin",8,"sunrise"],["Maha Navami","Ashwin",9,"sunrise"],["Vijayadashami / Dussehra","Ashwin",10,"aparahna"],
    ["Sharad Purnima","Ashwin",15,"pradosh"],["Karwa Chauth","Ashwin",19,"night"],["Dhanteras","Ashwin",28,"pradosh"],
    ["Naraka Chaturdashi (Choti Diwali)","Ashwin",29,"sunrise"],["Diwali (Lakshmi Puja)","Ashwin",30,"pradosh"],
    ["Govardhan Puja","Kartika",1,"sunrise"],["Bhai Dooj","Kartika",2,"aparahna"],["Chhath Puja (Sandhya Arghya)","Kartika",6,"pradosh"],
    ["Tulsi Vivah","Kartika",12,"sunrise"],["Kartik Purnima / Dev Diwali","Kartika",15,"pradosh"],
];
const FIXED = { "01-01": "New Year's Day", "01-26": "Republic Day", "08-15": "Independence Day", "10-02": "Gandhi Jayanti", "12-25": "Christmas" };

function buildCity(city, lat, lon) {
    const PAD = 5;
    const start = addDays(FROM, -PAD), total = Math.round((keyToUtcMs(TO) - keyToUtcMs(FROM)) / 86400000) + 1 + PAD * 2;
    const days = [];
    for (let i = 0, k = start; i < total + 1; i++, k = addDays(k, 1)) {
        const [y, m, d] = [+k.slice(0, 4), +k.slice(5, 7), +k.slice(8, 10)];
        const [sr, ss] = riseSet(y, m, d, lat, lon);
        days.push({ key: k, y, m, d, sr, ss });
    }
    for (let i = 0; i < days.length - 1; i++) {
        const D = days[i], len = D.ss - D.sr, night = days[i + 1].sr - D.ss;
        D.t = { sunrise: D.sr, purvahna: D.sr + 0.3 * len, madhyahna: D.sr + 0.5 * len, aparahna: D.sr + 0.7 * len,
            pradosh: D.ss + 1 / 24, night: D.ss + 3 / 24, nishita: D.ss + night / 2 };
        D.tithiSr = Math.floor(elong(D.sr) / 12);
    }
    const N = days.length - 1;
    const tAt = (jd) => Math.floor(elong(jd) / 12) + 1;
    const fest = new Map();
    const add = (k, n) => { if (!fest.has(k)) fest.set(k, []); if (!fest.get(k).includes(n)) fest.get(k).push(n); };

    for (const [name, month, tithi, when] of FEST) {
        const mi = LMONTH.indexOf(month), done = new Set();
        for (let i = 0; i < N; i++) {
            const jd = days[i].t[when], L = lunAt(jd);
            if (!L || L.adhika || L.mi !== mi || done.has(L.start)) continue;
            if (tAt(jd) === tithi) { add(days[i].key, name); done.add(L.start); }
        }
        for (const L of LUN) {
            if (L.adhika || L.mi !== mi || done.has(L.start)) continue;
            for (let i = 0; i < N; i++) {
                if (days[i].sr < L.start || days[i].sr >= L.end) continue;
                const a = days[i].tithiSr + 1, b = days[i + 1].tithiSr + 1;
                const prev = tithi === 1 ? 30 : tithi - 1, next = tithi === 30 ? 1 : tithi + 1;
                if (a === tithi || (a === prev && b === next)) { add(days[i].key, name); break; }
            }
        }
    }
    for (const [k, v] of [...fest]) if (v.includes("Holika Dahan")) add(addDays(k, 1), "Holi (Rangwali Holi / Dhulandi)");
    for (let i = 1; i < N; i++) {
        const D = days[i], a = D.tithiSr + 1, prevT = days[i - 1].tithiSr + 1, nextT = days[i + 1].tithiSr + 1;
        const L = lunAt(D.sr); if (!L) continue;
        const is = (t) => (a === t && prevT !== t) || (a === t - 1 && nextT === t + 1);
        for (const t of [11, 26]) if (is(t)) {
            const shukla = t === 11;
            const nm = L.adhika ? (shukla ? "Padmini" : "Parama") : shukla ? EK_SH[L.mi] : EK_KR[(L.mi + 1) % 12];
            add(D.key, `${nm} Ekadashi`);
        }
        if (is(15)) add(D.key, "Purnima (Full Moon)");
        if (is(30)) add(D.key, "Amavasya (New Moon)");
        const pa = tAt(D.t.pradosh), pp = tAt(days[i - 1].t.pradosh);
        if ((pa === 13 || pa === 28) && pp !== pa) add(D.key, "Pradosh Vrat");
        const na = tAt(D.t.night), np = tAt(days[i - 1].t.night);
        if (na === 19 && np !== 19) add(D.key, "Sankashti Chaturthi");
    }
    for (const s of SANK) {
        const D = days.find((x) => x.key === s.civil); if (!D) continue;
        const day = s.jd < D.ss ? D.key : addDays(D.key, 1);
        const nm = s.rashi === 9 ? "Makar Sankranti / Pongal / Uttarayan" : s.rashi === 0 ? "Mesha Sankranti / Baisakhi" : `${RASHI[s.rashi]} Sankranti`;
        add(day, nm);
        if (s.rashi === 9) add(addDays(day, -1), "Lohri");
    }

    const out = {};
    for (let i = PAD; i < N - PAD + 0; i++) {
        const D = days[i]; if (D.key < FROM || D.key > TO) continue;
        const sr2 = days[i + 1].sr, L = lunAt(D.sr), b = bengali(D.key);
        const tith = segments(elong, 12, 12.19, tithiName, D.sr, sr2);
        const nak = segments(sidMoon, 360 / 27, 13.176, (i) => NAK[i % 27], D.sr, sr2);
        const yog = segments(yogaVal, 360 / 27, 14.19, (i) => YOG[i % 27], D.sr, sr2);
        const kar = segments(elong, 6, 12.19, (i) => karName(i % 60), D.sr, sr2);
        const names = [...(fest.get(D.key) || []), ...(FIXED[D.key.slice(5)] ? [FIXED[D.key.slice(5)]] : [])];
        const krishna = tith[0].name.startsWith("Krishna") || tith[0].name === "Amavasya";
        out[D.key] = { data: {
            date: D.key, city, source: "computed",
            weekday: WD[new Date(keyToUtcMs(D.key)).getUTCDay()],
            udaya_tithi: { name: tith[0].name }, tithi: tith,
            udaya_nakshatra: { name: nak[0].name }, nakshatra: nak,
            udaya_yoga: { name: yog[0].name }, yoga: yog,
            karana: kar,
            sun: { rise: fmtT(D.sr), set: fmtT(D.ss) },
            paksha: krishna ? "Krishna" : "Shukla",
            lunar_month: { amanta: LMONTH[L.mi], purnimanta: LMONTH[(L.mi + (krishna ? 1 : 0)) % 12], adhika: L.adhika },
            calendars: { vikram_samvat: String(L.vs), bengali: b },
            festivals: { data: names.map((n) => ({ name: n })) },
        } };
    }
    return out;
}

// ---------- main ----------
fs.mkdirSync(OUT_DIR, { recursive: true });
for (const [city, [lat, lon]] of Object.entries(CITIES)) {
    const out = buildCity(city, lat, lon);
    fs.writeFileSync(path.join(OUT_DIR, `${city}.json`), JSON.stringify(out));
    console.log(`✓ ${city}: ${Object.keys(out).length} din`);
}
console.log("\nKhatam. Files data/panchang-computed/ me save ho gayi.");
