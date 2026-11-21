/**
 * FESTIVAL DATA + IMAGE MAPPING
 * -----------------------------
 * Is file ko "src/lib/festivals.ts" (ya "lib/festivals.ts") me rakho.
 * Import path "@/lib/festivals" tabhi chalega jab aapke tsconfig me "@/*" alias ho.
 *
 * Naya festival image add karna ho:
 *   1. Image public/images/calendar/festivals/ me daalo (jaise janmashtami.jpg)
 *   2. Neeche MEDIA me ek line add karo: { keys: ["janmashtami"], image: "...", banner?: "..." }
 *
 * API se jo festival ka naam aata hai, usme "keys" ka koi bhi shabd mile
 * (chhote/bade akshar se farak nahi padta) to wahi image dikhegi.
 */

export type Festival = {
    name: string;
    date: string;      // YYYY-MM-DD
    image?: string;    // optional: is festival ke liye alag image
};

type Media = { keys: string[]; image: string; banner?: string };

const DIR = "/images/calendar/festivals";

export const DEFAULT_IMAGE = `${DIR}/default.jpg`;

const MEDIA: Media[] = [
    { keys: ["akshaya", "akshay", "tritiya"], image: `${DIR}/akshaya-tritiya.jpg`, banner: `${DIR}/kalash-banner.jpg` },
    { keys: ["shivaratri", "shivratri", "mahadev", "pradosh", "sawan", "shravan"], image: `${DIR}/maha-shivaratri.jpg` },
    { keys: ["holi", "holika"], image: `${DIR}/holi.jpg` },
    { keys: ["diwali", "deepavali", "dipawali", "dhanteras", "lakshmi", "tulasi", "tulsi", "dev diwali"], image: `${DIR}/diwali.jpg` },
    // Neeche apne naye festivals add karo, jaise:
    // { keys: ["janmashtami"], image: `${DIR}/janmashtami.jpg` },
    // { keys: ["ram navami"], image: `${DIR}/ram-navami.jpg` },
    // { keys: ["navratri", "durga"], image: `${DIR}/navratri.jpg` },
    // { keys: ["ganesh"], image: `${DIR}/ganesh-chaturthi.jpg` },
];

function find(name: string): Media | undefined {
    const n = name.toLowerCase();
    return MEDIA.find((m) => m.keys.some((k) => n.includes(k)));
}

export const getFestivalImage = (name: string) => find(name)?.image ?? DEFAULT_IMAGE;
export const getFestivalBanner = (name: string) => {
    const m = find(name);
    return m?.banner ?? m?.image ?? DEFAULT_IMAGE;
};

/** Upcoming list (dates har saal update karna; verify kar lena) */
export const FESTIVALS: Festival[] = [
    { name: "Dev Diwali", date: "2026-11-24" },
    { name: "Makar Sankranti", date: "2027-01-14" },
    { name: "Maha Shivaratri", date: "2027-03-06" },
    { name: "Holi", date: "2027-03-22" },
    { name: "Ram Navami", date: "2027-04-15" },
    { name: "Akshaya Tritiya", date: "2027-05-09" },
    { name: "Diwali", date: "2027-10-29" },
];