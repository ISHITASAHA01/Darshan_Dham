import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public", "images", "temples");
fs.mkdirSync(OUT, { recursive: true });

// node scripts/fetch-temple-images.mjs   command for create image


// [slug, Wikipedia title, search text]
const temples = [
    ["kedarnath-temple", "Kedarnath Temple", "Kedarnath Temple Uttarakhand"],
    ["kashi-vishwanath-temple", "Kashi Vishwanath Temple", "Kashi Vishwanath Temple Varanasi"],
    ["ayodhya-ram-mandir", "Ram Mandir", "Ram Mandir Ayodhya"],
    ["meenakshi-amman-temple", "Meenakshi Temple", "Meenakshi Amman Temple Madurai"],
    ["brahma-temple-pushkar", "Brahma Temple, Pushkar", "Brahma Temple Pushkar"],
    ["jagannath-temple-puri", "Jagannath Temple, Puri", "Jagannath Temple Puri"],
    ["somnath-temple", "Somnath temple", "Somnath Temple Veraval"],
    ["tirumala-venkateswara-temple", "Venkateswara Temple, Tirumala", "Tirumala Venkateswara Temple Tirupati"],
    ["siddhivinayak-temple", "Siddhivinayak Temple, Mumbai", "Siddhivinayak Temple Mumbai"],
    ["udupi-sri-krishna-matha", "Udupi Sri Krishna Matha", "Udupi Sri Krishna Matha"],
    ["padmanabhaswamy-temple", "Padmanabhaswamy Temple", "Padmanabhaswamy Temple Thiruvananthapuram"],
    ["bhadrachalam-temple", "Bhadrachalam Temple", "Bhadrachalam Sri Rama Temple Telangana"],
    ["mahakaleshwar-temple", "Mahakaleshwar Jyotirlinga", "Mahakaleshwar Temple Ujjain"],
    ["vishnupad-temple", "Vishnupad Temple", "Vishnupad Temple Gaya Bihar"],
    ["dakshineswar-kali-temple", "Dakshineswar Kali Temple", "Dakshineswar Kali Temple Kolkata"],
    ["durgiana-temple", "Durgiana Temple", "Durgiana Temple Amritsar"],
    ["mansa-devi-temple", "Mansa Devi Temple, Panchkula", "Mansa Devi Temple Panchkula"],
    ["jwala-ji-temple", "Jwalamukhi Temple", "Jwalamukhi Temple Kangra"],
    ["vaishno-devi-temple", "Vaishno Devi", "Vaishno Devi Temple Katra"],
    ["kamakhya-temple", "Kamakhya Temple", "Kamakhya Temple Guwahati"],

    ["baidyanath-dham", "Baidyanath Temple, Deoghar", "Baidyanath Dham Deoghar"],
    ["danteshwari-temple", "Danteshwari Temple", "Danteshwari Temple Dantewada"],
    ["kalkaji-temple", "Kalkaji Mandir", "Kalkaji Temple Delhi"],
    ["mangueshi-temple", "Mangeshi Temple", "Mangueshi Temple Ponda Goa"],
    ["tripura-sundari-temple", "Tripura Sundari Temple", "Tripura Sundari Temple Udaipur Tripura"],
    ["badrinath-temple", "Badrinath Temple", "Badrinath Temple Uttarakhand"],
    ["gangotri-temple", "Gangotri Temple", "Gangotri Temple Uttarakhand"],
    ["yamunotri-temple", "Yamunotri Temple", "Yamunotri Temple Uttarakhand"],
    ["tungnath-temple", "Tungnath", "Tungnath Temple Chopta"],
    ["brihadeeswarar-temple", "Brihadishvara Temple, Thanjavur", "Brihadeeswarar Temple Thanjavur"],
    ["ramanathaswamy-temple", "Ramanathaswamy Temple", "Ramanathaswamy Temple Rameswaram"],
    ["ranganathaswamy-temple", "Ranganathaswamy Temple, Srirangam", "Ranganathaswamy Temple Srirangam"],
    ["arunachaleswarar-temple", "Arunachaleswarar Temple", "Arunachaleswarar Temple Thiruvannamalai"],
    ["konark-sun-temple", "Konark Sun Temple", "Konark Sun Temple Odisha"],
    ["lingaraj-temple", "Lingaraj Temple", "Lingaraj Temple Bhubaneswar"],
    ["tara-tarini-temple", "Tara Tarini", "Tara Tarini Temple Ganjam"],
    ["srisailam-mallikarjuna-temple", "Mallikarjuna Swamy Temple, Srisailam", "Srisailam Mallikarjuna Temple"],
    ["simhachalam-temple", "Simhachalam Temple", "Simhachalam Temple Visakhapatnam"],
    ["kanaka-durga-temple", "Kanaka Durga Temple", "Kanaka Durga Temple Vijayawada"],
    ["annavaram-temple", "Annavaram", "Annavaram Satyanarayana Temple"],
    ["dwarkadhish-temple", "Dwarkadhish Temple", "Dwarkadhish Temple Dwarka"],
    ["ambaji-temple", "Ambaji Temple", "Ambaji Temple Gujarat"],
    ["akshardham-gandhinagar", "Akshardham (Gandhinagar)", "Akshardham Temple Gandhinagar"],
    ["pavagadh-kalika-mata-temple", "Kalika Mata Temple, Pavagadh", "Pavagadh Kalika Mata Temple"],
    ["shirdi-sai-baba-temple", "Sai Baba Temple, Shirdi", "Shirdi Sai Baba Temple"],
    ["trimbakeshwar-temple", "Trimbakeshwar Shiva Temple", "Trimbakeshwar Temple Nashik"],
    ["vitthal-rukmini-temple", "Vithoba Temple, Pandharpur", "Vitthal Rukmini Temple Pandharpur"],
    ["grishneshwar-temple", "Grishneshwar Temple", "Grishneshwar Temple Aurangabad"],
    ["murudeshwar-temple", "Murudeshwara", "Murudeshwar Temple Karnataka"],
    ["virupaksha-temple", "Virupaksha Temple", "Virupaksha Temple Hampi"],
    ["kukke-subramanya-temple", "Kukke Subramanya Temple", "Kukke Subramanya Temple Karnataka"],
    ["dharmasthala-temple", "Dharmasthala", "Dharmasthala Manjunatha Temple"],
    ["sabarimala-temple", "Sabarimala", "Sabarimala Ayyappan Temple"],
    ["guruvayur-temple", "Guruvayur Temple", "Guruvayur Sri Krishna Temple"],
    ["attukal-bhagavathy-temple", "Attukal Bhagavathy Temple", "Attukal Temple Thiruvananthapuram"],
    ["vadakkunnathan-temple", "Vadakkunnathan Temple", "Vadakkunnathan Temple Thrissur"],
    ["yadagirigutta-temple", "Yadagirigutta", "Yadagirigutta Narasimha Temple"],
    ["banke-bihari-temple", "Banke Bihari Temple", "Banke Bihari Temple Vrindavan"],
    ["krishna-janmabhoomi-mathura", "Krishna Janmasthan", "Krishna Janmabhoomi Mathura"],
    ["sankat-mochan-hanuman-temple", "Sankat Mochan Hanuman Temple", "Sankat Mochan Temple Varanasi"],
    ["karni-mata-temple", "Karni Mata Temple", "Karni Mata Temple Deshnoke"],
    ["eklingji-temple", "Eklingji", "Eklingji Temple Udaipur"],
    ["govind-dev-ji-temple", "Govind Dev Ji Temple", "Govind Dev Ji Temple Jaipur"],
    ["khatu-shyam-ji-temple", "Khatu Shyam Ji", "Khatu Shyam Temple Sikar"],
    ["salasar-balaji-temple", "Salasar Balaji", "Salasar Balaji Temple Churu"],
    ["kalighat-kali-temple", "Kalighat Kali Temple", "Kalighat Temple Kolkata"],
    ["belur-math", "Belur Math", "Belur Math Howrah"],
    ["tarapith-temple", "Tarapith", "Tarapith Temple Birbhum"],
    ["tarakeswar-temple", "Tarakeswar Temple", "Tarakeswar Temple Hooghly"],
    ["mayapur-iskcon-temple", "ISKCON Sri Mayapur Chandrodaya Mandir", "Mayapur ISKCON Temple Nadia"],
    ["mahabodhi-temple", "Mahabodhi Temple", "Mahabodhi Temple Bodh Gaya"],
    ["mahavir-mandir-patna", "Mahavir Mandir", "Mahavir Mandir Patna"],
    ["janaki-mandir-sitamarhi", "Janaki Mandir, Sitamarhi", "Janaki Mandir Sitamarhi"],
    ["vemulawada-temple", "Vemulawada", "Vemulawada Rajarajeswara Temple"],

    ["chilkur-balaji-temple", "Chilkur Balaji Temple", "Chilkur Balaji Temple Hyderabad"],
    ["birla-mandir-hyderabad", "Birla Mandir, Hyderabad", "Birla Mandir Hyderabad"],
    ["omkareshwar-temple", "Omkareshwar", "Omkareshwar Temple Madhya Pradesh"],
    ["kandariya-mahadev-temple", "Kandariya Mahadeva Temple", "Kandariya Mahadev Temple Khajuraho"],
    ["maihar-sharda-devi-temple", "Maihar", "Maihar Sharda Devi Temple"],
    ["kal-bhairav-temple-ujjain", "Kal Bhairav Temple, Ujjain", "Kal Bhairav Temple Ujjain"],
    ["devi-talab-mandir", "Devi Talab Mandir", "Devi Talab Mandir Jalandhar"],
    ["kali-mata-mandir-patiala", "Kali Mata Temple, Patiala", "Kali Mata Mandir Patiala"],
    ["ram-tirath-temple", "Ram Tirath, Amritsar", "Ram Tirath Temple Amritsar"],
    ["sthaneshwar-mahadev-temple", "Sthanu Tirtha", "Sthaneshwar Mahadev Temple Kurukshetra"],
    ["bhadrakali-temple-kurukshetra", "Bhadrakali Temple, Kurukshetra", "Bhadrakali Temple Kurukshetra"],
    ["sheetla-mata-mandir-gurugram", "Sheetla Mata Mandir, Gurgaon", "Sheetla Mata Mandir Gurugram"],
    ["naina-devi-temple", "Naina Devi Temple", "Naina Devi Temple Himachal"],
    ["chintpurni-temple", "Chintpurni", "Chintpurni Temple Himachal"],
    ["baijnath-temple", "Baijnath Temple, Himachal Pradesh", "Baijnath Temple Kangra"],
    ["hidimba-devi-temple", "Hidimba Devi Temple", "Hidimba Devi Temple Manali"],
    ["amarnath-temple", "Amarnath Temple", "Amarnath Cave Temple"],
    ["raghunath-mandir-jammu", "Raghunath Temple, Jammu", "Raghunath Mandir Jammu"],
    ["shankaracharya-temple", "Shankaracharya Temple", "Shankaracharya Temple Srinagar"],

    ["umananda-temple", "Umananda Temple", "Umananda Temple Guwahati"],
    ["hayagriva-madhava-temple", "Hayagriva Madhava Temple", "Hayagriva Madhava Temple Hajo"],
    ["navagraha-temple-guwahati", "Navagraha Temple, Guwahati", "Navagraha Temple Guwahati"],
    ["rajrappa-temple", "Rajrappa Temple", "Rajrappa Temple Jharkhand"],
    ["pahari-mandir-ranchi", "Pahari Mandir, Ranchi", "Pahari Mandir Ranchi"],
    ["deori-mandir", "Deori Mandir", "Deori Mandir Ranchi"],
    ["bamleshwari-temple", "Bamleshwari Temple", "Bamleshwari Temple Dongargarh"],
    ["mahamaya-temple-ratanpur", "Mahamaya Temple, Ratanpur", "Mahamaya Devi Temple Ratanpur"],
    ["champaran-bhagwan-mahadev-temple", "Champaran, Chhattisgarh", "Champaran Mahadev Temple Chhattisgarh"],
    ["akshardham-delhi", "Akshardham (Delhi)", "Akshardham Temple Delhi"],
    ["laxminarayan-birla-mandir", "Laxminarayan Temple, Delhi", "Birla Mandir Delhi"],
    ["hanuman-mandir-connaught-place", "Hanuman Mandir, Connaught Place", "Hanuman Mandir Connaught Place Delhi"],
    ["chhatarpur-mandir", "Chhatarpur Temple", "Chhatarpur Mandir Delhi"],
    ["shantadurga-temple", "Shantadurga Temple", "Shantadurga Temple Goa"],
    ["mahalasa-narayani-temple", "Mahalasa Narayani Temple", "Mahalasa Narayani Temple Goa"],
    ["saptakoteshwar-temple", "Saptakoteshwar Temple", "Saptakoteshwar Temple Goa"],
    ["unakoti-temple", "Unakoti", "Unakoti rock carvings Tripura"],
    ["bhuvaneswari-temple-agartala", "Ujjayanta Palace", "Bhuvaneswari Temple Agartala"],
    ["bishnupur-govindajee-temple", "Bishnupur, Manipur", "Vishnu Temple Bishnupur Manipur"],
];

const HEADERS = { "User-Agent": "MndirMandoli/1.0 (student temple project)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
    const res = await fetch(url, { headers: HEADERS });
    return res.json();
}

// Tarika 1: Wikipedia page ka exact title
async function byTitle(title) {
    const d = await getJson(
        "https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1" +
        `&prop=pageimages&pithumbsize=1200&titles=${encodeURIComponent(title)}`
    );
    const p = Object.values(d.query?.pages ?? {})[0];
    return p?.thumbnail?.source ?? null;
}

// Tarika 2: Wikipedia me search karke pehli photo wala page
async function byWikiSearch(text) {
    const d = await getJson(
        "https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search" +
        `&gsrlimit=6&prop=pageimages&pithumbsize=1200&gsrsearch=${encodeURIComponent(text)}`
    );
    const pages = Object.values(d.query?.pages ?? {}).sort((a, b) => a.index - b.index);
    return pages.find((p) => p.thumbnail)?.thumbnail.source ?? null;
}

// Tarika 3: Wikimedia Commons me seedhi photo search
async function byCommons(text) {
    const d = await getJson(
        "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search" +
        "&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|mime&iiurlwidth=1200" +
        `&gsrsearch=${encodeURIComponent(text)}`
    );
    const pages = Object.values(d.query?.pages ?? {}).sort((a, b) => a.index - b.index);
    const okMime = ["image/jpeg", "image/png", "image/webp"];
    const hit = pages.find((p) => okMime.includes(p.imageinfo?.[0]?.mime));
    return hit?.imageinfo[0]?.thumburl ?? null;
}

async function findImage(title, text) {
    for (const step of [() => byTitle(title), () => byWikiSearch(text), () => byCommons(text)]) {
        try {
            const url = await step();
            if (url) return url;
        } catch { }
        await sleep(300);
    }
    return null;
}

async function main() {
    const ok = [];
    const failed = [];

    for (const [slug, title, text] of temples) {
        const exists = ["jpg", "jpeg", "png", "webp"].some((e) =>
            fs.existsSync(path.join(OUT, `${slug}.${e}`))
        );
        if (exists) {
            console.log(`- ${slug}: pehle se hai`);
            continue;
        }
        try {
            const src = await findImage(title, text);
            if (!src) throw new Error("photo nahi mili");
            const img = await fetch(src, { headers: HEADERS });
            if (!img.ok) throw new Error(`download fail (${img.status})`);
            const ext = (src.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z]/g, "");
            const finalExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
            fs.writeFileSync(path.join(OUT, `${slug}.${finalExt}`), Buffer.from(await img.arrayBuffer()));
            console.log(`✓ ${slug}`);
            ok.push(slug);
        } catch (e) {
            console.log(`✗ ${slug}: ${e.message}`);
            failed.push(slug);
        }
        await sleep(500);
    }

    console.log(`\nHo gaya. Nayi mili: ${ok.length}, abhi bhi nahi mili: ${failed.length}`);
    if (failed.length) {
        console.log("Ye manually daalni hongi (public/images/temples/<slug>.jpg):");
        failed.forEach((s) => console.log("  " + s));
    }
}

main();