/**
 * FESTIVAL DATABASE (21 Nov 2026 se 31 Dec 2027 tak)
 * --------------------------------------------------
 * - Dates North India (Delhi) panchang ke hisaab se hain (purnimanta months).
 *   Kuch tyohaar (Diwali, Janmashtami, Ekadashi aadi) South/West me 1 din aage-peeche ho sakte hain.
 * - Kalabhairav Jayanti (2026): kuch panchang 30 Nov dete hain, kuch 1 Dec. Yahan 1 Dec rakha hai.
 * - Naya tyohaar jodna ho to FESTIVALS me ek line add karo. Image na ho to
 *   category ka emoji aur rang apne aap dikhta hai.
 * - Jis festival ki apni image ho: public/images/calendar/festivals/ me rakho
 *   aur neeche IMAGE_BY_NAME me ek line jodo.
 */

export type Category =
    | "shiva" | "vishnu" | "krishna" | "rama" | "hanuman" | "ganesh" | "devi"
    | "lakshmi" | "surya" | "guru" | "colors" | "ancestors" | "newyear" | "shani" | "rakshabandhan";

export type Festival = {
    name: string;
    date: string;        // YYYY-MM-DD
    category: Category;
    image?: string;      // optional: sirf is ek festival ke liye alag image
};

/* ------------------------------------------------------------------ */
/*  IMAGES                                                              */
/* ------------------------------------------------------------------ */
const DIR = "/images/calendar/festivals";

/** Kisi khaas festival ki image (naam me keyword mile to). Naya image yahin jodo. */
const IMAGE_BY_NAME: { keys: string[]; image: string; banner?: string }[] = [
    { keys: ["akshaya"], image: `${DIR}/akshaya-tritiya.jpg`, banner: `${DIR}/kalash-banner.jpg` },
    { keys: ["holi", "holika"], image: `${DIR}/holi.jpg` },
    { keys: ["shivaratri", "shivratri"], image: `${DIR}/maha-shivaratri.jpg` },
    { keys: ["diwali", "deepawali", "dhanteras"], image: `${DIR}/diwali.jpg` },
    { keys: ["janmashtami"], image: `${DIR}/janmashtami.jpg` },
    // { keys: ["ganesh chaturthi"], image: `${DIR}/ganesh-chaturthi.jpg` },
];

/** Category ki image (jis category ki image hai, uske sab festivals me dikhegi). */
const IMAGE_BY_CATEGORY: Partial<Record<Category, string>> = {
    shiva: `${DIR}/maha-shivaratri.jpg`,
    lakshmi: `${DIR}/diwali.jpg`,
    colors: `${DIR}/holi.jpg`,
    // Neeche wali images jaise hi public/images/calendar/festivals/ me rakhoge,
    // apne aap dikhne lagengi. File na ho to emoji dikhta rehta hai.
    vishnu: `${DIR}/vishnu.jpg`,
    krishna: `${DIR}/krishna.jpg`,
    rama: `${DIR}/rama.jpg`,
    hanuman: `${DIR}/hanuman.jpg`,
    ganesh: `${DIR}/ganesh.jpg`,
    devi: `${DIR}/devi.jpg`,
    surya: `${DIR}/surya.jpg`,
    guru: `${DIR}/guru.jpg`,
    ancestors: `${DIR}/ancestors.jpg`,
    newyear: `${DIR}/newyear.jpg`,
    shani: `${DIR}/shani.jpg`,
    rakshabandhan: `${DIR}/rakshabandhan.jpg`,
};

/** Image na ho to ye emoji + rang dikhta hai. */
export const CATEGORY_STYLE: Record<Category, { emoji: string; gradient: string }> = {
    shiva: { emoji: "🔱", gradient: "linear-gradient(135deg,#1f2a44,#4a5d8f)" },
    vishnu: { emoji: "🪷", gradient: "linear-gradient(135deg,#1d3b5c,#3f7fb0)" },
    krishna: { emoji: "🦚", gradient: "linear-gradient(135deg,#17406b,#2f8f9d)" },
    rama: { emoji: "🏹", gradient: "linear-gradient(135deg,#7a3f08,#e0952f)" },
    hanuman: { emoji: "🙏", gradient: "linear-gradient(135deg,#8a2f0b,#e8742a)" },
    ganesh: { emoji: "🐘", gradient: "linear-gradient(135deg,#b34a0d,#f2a33a)" },
    devi: { emoji: "🌺", gradient: "linear-gradient(135deg,#7a1f3d,#d6527a)" },
    lakshmi: { emoji: "🪔", gradient: "linear-gradient(135deg,#6b3406,#f0a93f)" },
    surya: { emoji: "☀️", gradient: "linear-gradient(135deg,#a8480a,#f5b942)" },
    guru: { emoji: "📿", gradient: "linear-gradient(135deg,#4a2d6b,#9b6fd1)" },
    colors: { emoji: "🎨", gradient: "linear-gradient(135deg,#9b1d6e,#f0a93f)" },
    ancestors: { emoji: "🕯️", gradient: "linear-gradient(135deg,#2b2b38,#6a6a85)" },
    newyear: { emoji: "🎉", gradient: "linear-gradient(135deg,#0f5a4a,#3fbf9b)" },
    shani: { emoji: "🌑", gradient: "linear-gradient(135deg,#1b1b24,#4a4a68)" },
    rakshabandhan: { emoji: "🕉️", gradient: "linear-gradient(135deg,#7a4a12,#d9a54a)" },
};

/* ------------------------------------------------------------------ */
/*  FESTIVALS                                                           */
/* ------------------------------------------------------------------ */
const RAW: Festival[] = [
    /* ---- Nov - Dec 2026 ---- */
    { name: "Tulsi Vivah", date: "2026-11-21", category: "vishnu" },
    { name: "Dev Diwali (Kartik Purnima)", date: "2026-11-24", category: "lakshmi" },
    { name: "Kalabhairav Jayanti", date: "2026-12-01", category: "shiva" },
    { name: "Utpanna Ekadashi", date: "2026-12-04", category: "vishnu" },
    { name: "Vivah Panchami", date: "2026-12-14", category: "rama" },
    { name: "Skanda (Champa) Shashti", date: "2026-12-15", category: "shiva" },
    { name: "Dhanu Sankranti", date: "2026-12-16", category: "surya" },
    { name: "Gita Jayanti and Mokshada Ekadashi", date: "2026-12-20", category: "krishna" },
    { name: "Datta Jayanti", date: "2026-12-23", category: "guru" },

    /* ---- 2027 ---- */
    { name: "Lohri", date: "2027-01-14", category: "surya" },
    { name: "Makar Sankranti and Pongal", date: "2027-01-15", category: "surya" },
    { name: "Vasant Panchami (Saraswati Puja)", date: "2027-02-11", category: "devi" },
    { name: "Maha Shivaratri", date: "2027-03-06", category: "shiva" },
    { name: "Holika Dahan", date: "2027-03-21", category: "colors" },
    { name: "Holi", date: "2027-03-22", category: "colors" },
    { name: "Chaitra Navratri begins", date: "2027-04-07", category: "devi" },
    { name: "Ugadi and Gudi Padwa", date: "2027-04-07", category: "newyear" },
    { name: "Baisakhi and Vishu", date: "2027-04-14", category: "newyear" },
    { name: "Ram Navami", date: "2027-04-15", category: "rama" },
    { name: "Hanuman Jayanti", date: "2027-04-20", category: "hanuman" },
    { name: "Akshaya Tritiya", date: "2027-05-09", category: "lakshmi" },
    { name: "Buddha Purnima", date: "2027-05-20", category: "vishnu" },
    { name: "Shani Jayanti and Vat Savitri Vrat", date: "2027-06-04", category: "shani" },
    { name: "Nirjala Ekadashi", date: "2027-06-14", category: "vishnu" },
    { name: "Jagannath Rath Yatra", date: "2027-07-05", category: "krishna" },
    { name: "Devshayani Ekadashi", date: "2027-07-14", category: "vishnu" },
    { name: "Guru Purnima", date: "2027-07-18", category: "guru" },
    { name: "Shravan (Sawan) month begins", date: "2027-07-19", category: "shiva" },
    { name: "Hariyali Teej", date: "2027-08-04", category: "devi" },
    { name: "Nag Panchami", date: "2027-08-06", category: "shiva" },
    { name: "Varalakshmi Vrat", date: "2027-08-13", category: "lakshmi" },
    { name: "Raksha Bandhan", date: "2027-08-17", category: "rakshabandhan" },
    { name: "Krishna Janmashtami", date: "2027-08-25", category: "krishna" },
    { name: "Hartalika Teej", date: "2027-09-03", category: "devi" },
    { name: "Ganesh Chaturthi", date: "2027-09-04", category: "ganesh" },
    { name: "Onam (Thiruvonam)", date: "2027-09-12", category: "rakshabandhan" },
    { name: "Anant Chaturdashi and Ganesh Visarjan", date: "2027-09-14", category: "ganesh" },
    { name: "Pitru Paksha begins", date: "2027-09-16", category: "ancestors" },
    { name: "Sarva Pitru Amavasya", date: "2027-09-29", category: "ancestors" },
    { name: "Sharad Navratri begins", date: "2027-09-30", category: "devi" },
    { name: "Durga Ashtami", date: "2027-10-07", category: "devi" },
    { name: "Maha Navami", date: "2027-10-08", category: "devi" },
    { name: "Vijayadashami (Dussehra)", date: "2027-10-09", category: "rama" },
    { name: "Sharad Purnima", date: "2027-10-14", category: "lakshmi" },
    { name: "Karwa Chauth", date: "2027-10-18", category: "devi" },
    { name: "Ahoi Ashtami", date: "2027-10-22", category: "devi" },
    { name: "Dhanteras", date: "2027-10-27", category: "lakshmi" },
    { name: "Choti Diwali (Narak Chaturdashi)", date: "2027-10-28", category: "lakshmi" },
    { name: "Diwali (Lakshmi Puja)", date: "2027-10-29", category: "lakshmi" },
    { name: "Govardhan Puja", date: "2027-10-30", category: "krishna" },
    { name: "Bhai Dooj", date: "2027-10-31", category: "rakshabandhan" },
    { name: "Chhath Puja", date: "2027-11-04", category: "surya" },
    { name: "Dev Uthani Ekadashi", date: "2027-11-10", category: "vishnu" },
    { name: "Tulsi Vivah", date: "2027-11-11", category: "vishnu" },
    { name: "Dev Deepawali (Kartik Purnima)", date: "2027-11-14", category: "lakshmi" },
    { name: "Kalabhairav Jayanti", date: "2027-11-20", category: "shiva" },
    { name: "Dhanu Sankranti", date: "2027-12-16", category: "surya" },
    // Dec 2027 ke baaki tyohaar (Gita Jayanti, Vivah Panchami, Datta Jayanti) tithi pakki
    // hone par yahin jod dena.
];

export const FESTIVALS: Festival[] = [...RAW].sort((a, b) => a.date.localeCompare(b.date));

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */
const GUESS: [string[], Category][] = [
    [["shiv", "mahadev", "bhairav", "sawan", "shravan", "nag panchami", "skanda", "kartikeya"], "shiva"],
    [["hanuman"], "hanuman"],
    [["ganesh", "vinayak", "ganpati"], "ganesh"],
    [["janmashtami", "krishna", "govardhan", "radha", "gita", "jagannath"], "krishna"],
    [["ram ", "rama", "dussehra", "vijayadashami"], "rama"],
    [["diwali", "deepawali", "dhanteras", "lakshmi", "akshaya", "purnima"], "lakshmi"],
    [["holi", "holika"], "colors"],
    [["navratri", "durga", "devi", "kali", "saraswati", "teej", "navami", "ashtami", "karwa"], "devi"],
    [["sankranti", "pongal", "lohri", "chhath", "surya"], "surya"],
    [["guru", "datta"], "guru"],
    [["pitru", "shraddh", "amavasya"], "ancestors"],
    [["ugadi", "gudi", "baisakhi", "vishu", "new year"], "newyear"],
    [["shani"], "shani"],
    [["ekadashi", "vishnu", "tulsi", "tulasi", "anant"], "vishnu"],
];

/** Festival ka category: pehle apni list me naam dhundho, warna naam ke shabdon se andaaza. */
export function getCategory(name: string): Category {
    const n = name.toLowerCase();
    const exact = FESTIVALS.find((f) => f.name.toLowerCase() === n);
    if (exact) return exact.category;
    const partial = FESTIVALS.find((f) => n.includes(f.name.toLowerCase()) || f.name.toLowerCase().includes(n));
    if (partial) return partial.category;
    for (const [keys, cat] of GUESS) if (keys.some((k) => n.includes(k))) return cat;
    return "rakshabandhan";
}

function findMedia(name: string) {
    const n = name.toLowerCase();
    return IMAGE_BY_NAME.find((m) => m.keys.some((k) => n.includes(k)));
}

/** Image ka path, ya null (tab emoji + gradient dikhta hai). */
export function getFestivalImage(name: string): string | null {
    const own = FESTIVALS.find((f) => f.name === name)?.image;
    return own ?? findMedia(name)?.image ?? IMAGE_BY_CATEGORY[getCategory(name)] ?? null;
}

export function getFestivalBanner(name: string): string | null {
    const m = findMedia(name);
    return m?.banner ?? getFestivalImage(name);
}

/** Har tyohaar ka apna emoji (image na ho tab dikhta hai). Khaas wale pehle, aam wale baad me. */
const EMOJI_BY_KEY: [string[], string][] = [
    [["tulsi", "tulasi"], "🌿"],
    [["dev diwali", "dev deepawali", "deepawali"], "🪔"],
    [["bhairav"], "🔱"],
    [["gita"], "📖"],
    [["datta"], "📿"],
    [["vivah panchami"], "💍"],
    [["shashti", "skanda"], "🦚"],
    [["lohri"], "🔥"],
    [["makar"], "🪁"],
    [["sankranti"], "☀️"],
    [["vasant", "saraswati"], "📚"],
    [["shivaratri", "shivratri"], "🔱"],
    [["holika"], "🔥"],
    [["holi"], "🎨"],
    [["navratri"], "🌺"],
    [["ugadi", "gudi"], "🌼"],
    [["baisakhi", "vishu"], "🌾"],
    [["ram navami"], "🏹"],
    [["dussehra", "vijayadashami"], "🏹"],
    [["hanuman"], "🚩"],
    [["akshaya"], "🪙"],
    [["buddha"], "☸️"],
    [["shani"], "🪐"],
    [["rath yatra", "jagannath"], "🛕"],
    [["nirjala"], "💧"],
    [["devshayani", "uthani", "ekadashi"], "🙏"],
    [["guru purnima"], "📿"],
    [["shravan", "sawan"], "🌧️"],
    [["teej"], "🌿"],
    [["nag panchami"], "🐍"],
    [["varalakshmi"], "🪔"],
    [["raksha"], "🧵"],
    [["janmashtami"], "🦚"],
    [["ganesh", "anant"], "🐘"],
    [["onam"], "🌸"],
    [["pitru"], "🕯️"],
    [["durga ashtami"], "🔱"],
    [["navami"], "🌺"],
    [["sharad purnima"], "🌕"],
    [["karwa"], "🌙"],
    [["ahoi"], "⭐"],
    [["dhanteras"], "🪙"],
    [["choti diwali", "narak"], "🪔"],
    [["diwali"], "🪔"],
    [["govardhan"], "⛰️"],
    [["bhai dooj"], "👫"],
    [["chhath"], "🌅"],
];

export function getFestivalEmoji(name: string): string {
    const n = name.toLowerCase();
    const hit = EMOJI_BY_KEY.find(([keys]) => keys.some((k) => n.includes(k)));
    return hit ? hit[1] : CATEGORY_STYLE[getCategory(name)].emoji;
}

export const getFestivalStyle = (name: string) => ({
    emoji: getFestivalEmoji(name),
    gradient: CATEGORY_STYLE[getCategory(name)].gradient,
});

export function toISO(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Aaj ya uske baad ke festivals, date ke kram me. */
export function getUpcoming(from: Date = new Date(), limit?: number): Festival[] {
    const t = toISO(from);
    const list = FESTIVALS.filter((f) => f.date >= t);
    return limit ? list.slice(0, limit) : list;
}