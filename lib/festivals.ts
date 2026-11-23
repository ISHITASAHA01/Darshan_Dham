/**
 * FESTIVAL DATABASE (21 Nov 2026 se 31 Dec 2027 tak)
 * --------------------------------------------------
 * - Dates North India (Delhi) panchang ke hisaab se hain (purnimanta months).
 *   Kuch tyohaar (Diwali, Janmashtami, Ekadashi aadi) South/West me 1 din aage-peeche ho sakte hain.
 * - Kalabhairav Jayanti (2026): kuch panchang 30 Nov dete hain, kuch 1 Dec. Yahan 1 Dec rakha hai.
 * - Naya tyohaar jodna ho to FESTIVALS me ek line add karo. Image na ho to
 *   category ka rang aur ॐ dikhta hai.
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
const DIR = "/festivals";   // public/festivals/ folder

/** Kisi khaas festival ki image (naam me keyword mile to). Naya image yahin jodo. */
const IMAGE_BY_NAME: { keys: string[]; image: string; banner?: string }[] = [
    { keys: ["akshaya"], image: `${DIR}/akshaya-tritiya.jpg` },
    { keys: ["holi", "holika"], image: `${DIR}/holi.jpg` },
    { keys: ["shivaratri", "shivratri"], image: `${DIR}/maha-shivaratri.jpg` },
    { keys: ["diwali", "deepawali", "dhanteras"], image: `${DIR}/diwali.jpg` },
    // Kisi ek festival ki apni alag photo ho to yahan ek line jodo:
    // { keys: ["janmashtami"], image: `${DIR}/janmashtami.jpg` },
];

/** Category ki image: us category ke saare festivals me yahi dikhegi. */
const IMAGE_BY_CATEGORY: Record<Category, string> = {
    shiva: `${DIR}/maha-shivaratri.jpg`,
    vishnu: `${DIR}/vishnu.jpg`,
    krishna: `${DIR}/krishna.jpg`,
    rama: `${DIR}/rama.jpg`,
    hanuman: `${DIR}/hanuman.jpg`,
    ganesh: `${DIR}/ganesh.jpg`,
    devi: `${DIR}/devi.jpg`,
    lakshmi: `${DIR}/diwali.jpg`,
    surya: `${DIR}/surya.jpg`,
    guru: `${DIR}/guru.jpg`,
    colors: `${DIR}/holi.jpg`,
    ancestors: `${DIR}/ancestors.jpg`,
    newyear: `${DIR}/newyear.jpg`,
    shani: `${DIR}/shani.jpg`,
    rakshabandhan: `${DIR}/rakshabandhan.jpg`,
};

/** Image load na ho to ye rang dikhta hai (emoji nahi). */
export const CATEGORY_STYLE: Record<Category, { gradient: string }> = {
    shiva: { gradient: "linear-gradient(135deg,#1f2a44,#4a5d8f)" },
    vishnu: { gradient: "linear-gradient(135deg,#1d3b5c,#3f7fb0)" },
    krishna: { gradient: "linear-gradient(135deg,#17406b,#2f8f9d)" },
    rama: { gradient: "linear-gradient(135deg,#7a3f08,#e0952f)" },
    hanuman: { gradient: "linear-gradient(135deg,#8a2f0b,#e8742a)" },
    ganesh: { gradient: "linear-gradient(135deg,#b34a0d,#f2a33a)" },
    devi: { gradient: "linear-gradient(135deg,#7a1f3d,#d6527a)" },
    lakshmi: { gradient: "linear-gradient(135deg,#6b3406,#f0a93f)" },
    surya: { gradient: "linear-gradient(135deg,#a8480a,#f5b942)" },
    guru: { gradient: "linear-gradient(135deg,#4a2d6b,#9b6fd1)" },
    colors: { gradient: "linear-gradient(135deg,#9b1d6e,#f0a93f)" },
    ancestors: { gradient: "linear-gradient(135deg,#2b2b38,#6a6a85)" },
    newyear: { gradient: "linear-gradient(135deg,#0f5a4a,#3fbf9b)" },
    shani: { gradient: "linear-gradient(135deg,#1b1b24,#4a4a68)" },
    rakshabandhan: { gradient: "linear-gradient(135deg,#7a4a12,#d9a54a)" },
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

/** Festival ki image ka path. */
export function getFestivalImage(name: string): string {
    const own = FESTIVALS.find((f) => f.name === name)?.image;
    return own ?? findMedia(name)?.image ?? IMAGE_BY_CATEGORY[getCategory(name)];
}

export const getFestivalBanner = (name: string): string => findMedia(name)?.banner ?? getFestivalImage(name);

export const getFestivalStyle = (name: string) => CATEGORY_STYLE[getCategory(name)];

export function toISO(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Aaj ya uske baad ke festivals, date ke kram me. */
export function getUpcoming(from: Date = new Date(), limit?: number): Festival[] {
    const t = toISO(from);
    const list = FESTIVALS.filter((f) => f.date >= t);
    return limit ? list.slice(0, limit) : list;
}

/* ------------------------------------------------------------------ */
/*  KNOW MORE (festival ki jaankari)                                    */
/*  - Har category ki default jaankari CATEGORY_INFO me hai.            */
/*  - Kisi khaas festival ki alag jaankari ho to INFO_BY_NAME me ek     */
/*    line jodo (keys me naam ka koi shabd, chhote akshar me).          */
/* ------------------------------------------------------------------ */
export type FestivalInfo = {
    deity: string;
    about: string;
    todo: string[];
};

const CATEGORY_INFO: Record<Category, FestivalInfo> = {
    shiva: {
        deity: "Lord Shiva",
        about: "A day devoted to Mahadev, the destroyer of ego and giver of peace. Devotees visit Shiva temples and keep the mind calm and fearless.",
        todo: ["Offer water, milk and bel leaves on the Shivling", "Chant Om Namah Shivaya 108 times", "Light a lamp in the evening"],
    },
    vishnu: {
        deity: "Lord Vishnu",
        about: "A day of devotion to Lord Vishnu, the preserver of the universe. Fasting, prayer and charity are believed to bring peace and merit.",
        todo: ["Keep a fast or eat a simple satvik meal", "Offer tulsi leaves and yellow flowers", "Read or listen to Vishnu Sahasranama"],
    },
    krishna: {
        deity: "Lord Krishna",
        about: "A festival of Lord Krishna, remembered for his love, wisdom and the teachings of the Gita. Temples fill with bhajans and kirtan.",
        todo: ["Sing or listen to Krishna bhajans", "Offer butter, sugar candy and tulsi", "Read a few verses of the Bhagavad Gita"],
    },
    rama: {
        deity: "Lord Rama",
        about: "A day to remember Lord Rama, the ideal of dharma, truth and duty. Many devotees read the Ramayana and visit Rama temples.",
        todo: ["Chant Shri Ram Jai Ram Jai Jai Ram", "Read a chapter of the Ramcharitmanas or Sundarkand", "Visit a Ram temple if you can"],
    },
    hanuman: {
        deity: "Lord Hanuman",
        about: "A day for Lord Hanuman, the symbol of strength, courage and selfless devotion to Rama.",
        todo: ["Recite the Hanuman Chalisa", "Offer sindoor, red flowers and boondi or laddu", "Visit a Hanuman temple"],
    },
    ganesh: {
        deity: "Lord Ganesha",
        about: "A day for Lord Ganesha, the remover of obstacles. New beginnings are said to be blessed on this day.",
        todo: ["Offer durva grass and modak", "Chant Om Gan Ganapataye Namah", "Start any new task with his blessing"],
    },
    devi: {
        deity: "Goddess Durga and the Devi",
        about: "A day to honour the Divine Mother in her many forms, who gives strength, wisdom and protection.",
        todo: ["Light a lamp and offer red flowers", "Recite Durga Chalisa or Devi stuti", "Keep a simple fast if you wish"],
    },
    lakshmi: {
        deity: "Goddess Lakshmi",
        about: "A day of light and abundance, when homes are cleaned and decorated and lamps are lit to welcome prosperity.",
        todo: ["Light diyas at the entrance and in the home", "Offer lotus or marigold flowers", "Share sweets and help someone in need"],
    },
    surya: {
        deity: "Surya Dev, the Sun God",
        about: "A day to thank the Sun for light, warmth and harvest. Many people take a holy dip, give charity and offer prayers at sunrise.",
        todo: ["Offer water (arghya) to the rising sun", "Chant the Gayatri Mantra", "Donate food, sesame or warm clothes"],
    },
    guru: {
        deity: "Guru and Dattatreya",
        about: "A day to honour gurus and teachers who guide us from darkness to light.",
        todo: ["Bow to your teachers and elders", "Read a verse of wisdom", "Donate to a learning cause"],
    },
    colors: {
        deity: "Lord Vishnu, Prahlad and Krishna",
        about: "A festival of colours that celebrates the victory of good over evil and the joy of coming together.",
        todo: ["Light the holy fire in the evening", "Play with natural colours (gulal)", "Share sweets and forgive old grudges"],
    },
    ancestors: {
        deity: "Pitru (ancestors)",
        about: "A time to remember and thank our ancestors through prayer, water offerings and feeding the needy.",
        todo: ["Offer water and sesame (tarpan)", "Feed Brahmins, the poor or birds and cows", "Remember family elders with gratitude"],
    },
    newyear: {
        deity: "New beginnings",
        about: "A regional new year or harvest-season festival, celebrated with new clothes, special food and family gatherings.",
        todo: ["Clean and decorate the home", "Prepare the traditional festive dish", "Seek the blessings of elders"],
    },
    shani: {
        deity: "Shani Dev",
        about: "A day to worship Shani Dev, the lord of justice and discipline, and to pray for patience and relief from hardships.",
        todo: ["Light a mustard oil lamp", "Offer black sesame and blue flowers", "Help the poor and the elderly"],
    },
    rakshabandhan: {
        deity: "Family and togetherness",
        about: "A festival that celebrates love, care and family bonds, marked with gifts, sweets and blessings.",
        todo: ["Spend time with your family", "Share sweets and gifts", "Seek blessings from elders"],
    },
};

const INFO_BY_NAME: { keys: string[]; info: Partial<FestivalInfo> }[] = [
    {
        keys: ["dev diwali", "dev deepawali"], info: {
            deity: "Lord Shiva and all the Gods",
            about: "Celebrated on Kartik Purnima, fifteen days after Diwali. It is believed that the Gods come down to bathe in the Ganga, and the ghats of Varanasi shine with lakhs of diyas. It is also the day Shiva defeated the demon Tripurasura.",
            todo: ["Take a holy dip or bathe at home with a prayer", "Light diyas at a river, temple or home", "Donate food, ghee or a lamp"]
        }
    },
    {
        keys: ["kalabhairav"], info: {
            deity: "Kal Bhairav, fierce form of Shiva",
            about: "Marks the appearance of Kal Bhairav, the guardian of time and the protector of Kashi. Worship is believed to remove fear and negative energy.",
            todo: ["Offer mustard oil lamp at a Bhairav temple", "Feed dogs, which are considered sacred to him", "Chant Kal Bhairav Ashtakam"]
        }
    },
    {
        keys: ["utpanna"], info: {
            deity: "Lord Vishnu and Ekadashi Devi",
            about: "On this day Ekadashi Devi appeared from Lord Vishnu. Those who wish to begin the Ekadashi vrat usually start from this day.",
            todo: ["Fast and avoid grains", "Offer tulsi to Lord Vishnu", "Break the fast next morning after sunrise"]
        }
    },
    {
        keys: ["vivah panchami"], info: {
            deity: "Lord Rama and Goddess Sita",
            about: "Celebrates the divine wedding of Rama and Sita. It is celebrated with great joy at Ayodhya and Janakpur.",
            todo: ["Read the wedding chapter of the Ramcharitmanas", "Visit a Ram-Sita temple", "Sing wedding bhajans"]
        }
    },
    {
        keys: ["tulsi vivah"], info: {
            deity: "Tulsi Mata and Lord Vishnu (Shaligram)",
            about: "The symbolic wedding of the Tulsi plant with Lord Shaligram, a form of Vishnu. It marks the start of the wedding season.",
            todo: ["Decorate the Tulsi plant like a bride", "Perform the wedding rituals in the evening", "Distribute prasad"]
        }
    },
    {
        keys: ["skanda", "champa shashti"], info: {
            deity: "Lord Kartikeya (Murugan)",
            about: "Dedicated to Skanda, the commander of the divine army, who defeated the demon Tarakasura. Especially popular in South India.",
            todo: ["Visit a Murugan or Kartikeya temple", "Keep a fast", "Chant Skanda Shashti Kavacham"]
        }
    },
    {
        keys: ["dhanu sankranti"], info: {
            deity: "Surya Dev",
            about: "The day the Sun enters Dhanu (Sagittarius). The month that follows, Dhanurmas, is considered good for prayer and discipline.",
            todo: ["Offer water to the Sun", "Read devotional verses in the morning", "Donate warm clothes or food"]
        }
    },
    {
        keys: ["gita jayanti"], info: {
            deity: "Lord Krishna",
            about: "The day Lord Krishna delivered the Bhagavad Gita to Arjuna on the battlefield of Kurukshetra. It falls on Mokshada Ekadashi.",
            todo: ["Read or listen to the Bhagavad Gita", "Keep the Ekadashi fast", "Attend a Gita discourse"]
        }
    },
    {
        keys: ["datta jayanti"], info: {
            deity: "Lord Dattatreya",
            about: "Birth of Dattatreya, the combined form of Brahma, Vishnu and Shiva, honoured as the first Guru.",
            todo: ["Visit a Dattatreya temple", "Chant Avadhuta Gita or Datta Stotra", "Honour your guru"]
        }
    },
    {
        keys: ["lohri"], info: {
            deity: "Agni Dev and the harvest",
            about: "A winter harvest festival of Punjab, celebrated the night before Makar Sankranti with a bonfire, songs and dance.",
            todo: ["Light a bonfire with family", "Offer sesame, peanuts and rewri to the fire", "Enjoy gajak and popcorn"]
        }
    },
    {
        keys: ["makar sankranti", "pongal"], info: {
            deity: "Surya Dev",
            about: "The Sun enters Makar (Capricorn) and starts its northward journey. It is celebrated as Pongal in Tamil Nadu, with kite flying, til-gud and holy dips across India.",
            todo: ["Take a holy bath and offer water to the Sun", "Eat til-gud or khichdi", "Donate food, sesame and blankets"]
        }
    },
    {
        keys: ["vasant panchami"], info: {
            deity: "Goddess Saraswati",
            about: "Welcomes spring and honours Saraswati, goddess of knowledge, music and arts. Yellow is the colour of the day.",
            todo: ["Wear yellow", "Place books and instruments near the Goddess", "Start a child's first letters (Vidyarambh)"]
        }
    },
    {
        keys: ["maha shivaratri"], info: {
            deity: "Lord Shiva",
            about: "The great night of Shiva. Devotees fast, stay awake through the night and perform abhishek of the Shivling, believing it brings peace and spiritual progress.",
            todo: ["Fast and keep night vigil (jagran)", "Perform abhishek with water, milk and honey", "Chant Om Namah Shivaya through the night"]
        }
    },
    {
        keys: ["holika dahan"], info: {
            deity: "Prahlad and Lord Narasimha",
            about: "Marks the victory of devotion over evil, remembering how Prahlad was saved from Holika. A holy fire is lit at dusk.",
            todo: ["Join the Holika fire at the right muhurat", "Offer coconut, grains and flowers", "Pray for the end of negativity"]
        }
    },
    {
        keys: ["holi"], info: {
            deity: "Lord Krishna and Radha",
            about: "The festival of colours, celebrating the love of Radha and Krishna and the arrival of spring. Mathura and Vrindavan celebrate it for days.",
            todo: ["Play with natural, skin-safe colours", "Share gujiya and sweets", "Meet and forgive friends and family"]
        }
    },
    {
        keys: ["chaitra navratri"], info: {
            deity: "Goddess Durga",
            about: "Nine nights of worship of the nine forms of Durga. In many parts of India it also marks the start of the new Hindu year.",
            todo: ["Set up Ghatasthapana on day one", "Keep a fast or satvik diet", "Read Durga Saptashati"]
        }
    },
    {
        keys: ["ugadi", "gudi padwa"], info: {
            deity: "Lord Brahma",
            about: "New Year in Karnataka, Andhra, Telangana and Maharashtra. Homes are decorated with mango leaves, and special foods mix sweet, sour and bitter tastes.",
            todo: ["Decorate the door with mango leaves", "Prepare Ugadi pachadi or shrikhand", "Listen to the year's Panchang"]
        }
    },
    {
        keys: ["baisakhi", "vishu"], info: {
            deity: "Harvest and the solar new year",
            about: "The solar new year and harvest festival, celebrated as Baisakhi in Punjab and Vishu in Kerala.",
            todo: ["Visit a temple or gurdwara", "See the Vishukkani (Kerala) at dawn", "Share festive food"]
        }
    },
    {
        keys: ["ram navami"], info: {
            deity: "Lord Rama",
            about: "The birthday of Lord Rama, celebrated with bhajans, fasting and readings of the Ramayana. Ayodhya sees huge celebrations.",
            todo: ["Read the Ramayana or Sundarkand", "Fast and offer prasad at noon", "Visit a Ram temple"]
        }
    },
    {
        keys: ["hanuman jayanti"], info: {
            deity: "Lord Hanuman",
            about: "The birth of Lord Hanuman, the devoted servant of Rama and symbol of strength, courage and humility.",
            todo: ["Recite the Hanuman Chalisa", "Offer sindoor and jasmine oil", "Distribute prasad"]
        }
    },
    {
        keys: ["akshaya"], info: {
            deity: "Lord Vishnu and Goddess Lakshmi",
            about: "Akshaya means never diminishing. Anything good started or given on this day is believed to grow. It is a popular day to buy gold and begin new work.",
            todo: ["Donate food, water or clothes", "Start something new with a prayer", "Worship Lakshmi and Vishnu"]
        }
    },
    {
        keys: ["buddha purnima"], info: {
            deity: "Gautama Buddha",
            about: "Remembers the birth, enlightenment and passing of the Buddha. In Hindu tradition he is also honoured as an avatar of Vishnu.",
            todo: ["Meditate in silence", "Light a lamp and offer flowers", "Practise kindness and charity"]
        }
    },
    {
        keys: ["shani jayanti", "vat savitri"], info: {
            deity: "Shani Dev and Savitri",
            about: "Shani Jayanti is the birth of Shani Dev. Vat Savitri is when married women fast and tie threads around a banyan tree for the long life of their husbands, remembering Savitri and Satyavan.",
            todo: ["Offer mustard oil and black sesame to Shani", "Circle the banyan tree with thread", "Donate to the needy"]
        }
    },
    {
        keys: ["nirjala"], info: {
            deity: "Lord Vishnu",
            about: "The strictest Ekadashi, kept without food and even water. It is said to give the merit of all twenty-four Ekadashis in a year.",
            todo: ["Fast as per your health and ability", "Offer water pots and fruits in charity", "Chant Vishnu mantras"]
        }
    },
    {
        keys: ["rath yatra"], info: {
            deity: "Lord Jagannath, Balabhadra and Subhadra",
            about: "The grand chariot festival of Puri, where Lord Jagannath travels to the Gundicha Temple with his brother and sister. Lakhs of devotees pull the chariots.",
            todo: ["Watch the Rath Yatra or join online", "Take Mahaprasad if you visit Puri", "Chant Jai Jagannath"]
        }
    },
    {
        keys: ["devshayani"], info: {
            deity: "Lord Vishnu",
            about: "Lord Vishnu goes into his cosmic sleep and Chaturmas, the four holy months of restraint and devotion, begins.",
            todo: ["Fast and worship Vishnu", "Take up a vow for the four months", "Read Vishnu stotras"]
        }
    },
    {
        keys: ["guru purnima"], info: {
            deity: "Maharishi Vyasa and all Gurus",
            about: "Honours Maharishi Vyasa and every teacher and guide in our life.",
            todo: ["Touch the feet of your guru and elders", "Thank a teacher", "Read or listen to a spiritual teaching"]
        }
    },
    {
        keys: ["shravan", "sawan"], info: {
            deity: "Lord Shiva",
            about: "Shravan is the month most dear to Shiva. Devotees fast on Mondays and offer Ganga jal. Many take part in the Kanwar Yatra.",
            todo: ["Offer Ganga jal and bel leaves on Mondays", "Keep Monday fasts", "Chant Mahamrityunjaya Mantra"]
        }
    },
    {
        keys: ["hariyali teej"], info: {
            deity: "Goddess Parvati and Lord Shiva",
            about: "Celebrates the reunion of Parvati and Shiva during the green monsoon. Women wear green, sing songs and enjoy swings.",
            todo: ["Wear green and apply mehendi", "Fast for the family's wellbeing", "Enjoy swings and songs"]
        }
    },
    {
        keys: ["nag panchami"], info: {
            deity: "Nag Devta and Lord Shiva",
            about: "Snakes are worshipped as sacred beings who protect nature. Milk and flowers are offered at snake shrines.",
            todo: ["Offer milk and flowers at a Nag shrine", "Draw a snake picture at the entrance", "Pray for protection and harmony with nature"]
        }
    },
    {
        keys: ["varalakshmi"], info: {
            deity: "Goddess Varalakshmi",
            about: "Popular in South India, where married women worship Lakshmi for family prosperity and happiness.",
            todo: ["Decorate a kalash as the Goddess", "Prepare traditional sweets", "Invite women for haldi-kumkum"]
        }
    },
    {
        keys: ["raksha bandhan"], info: {
            deity: "Brother-sister bond",
            about: "Sisters tie a rakhi on their brothers' wrists and pray for their long life, and brothers promise to protect them.",
            todo: ["Tie rakhi and apply tilak", "Exchange gifts and sweets", "Remember siblings who live far away"]
        }
    },
    {
        keys: ["janmashtami"], info: {
            deity: "Lord Krishna",
            about: "The birth of Lord Krishna at midnight in Mathura. Temples are decorated, jhankis are made, and devotees fast till midnight.",
            todo: ["Fast and stay awake till midnight", "Bathe Laddu Gopal and swing the cradle", "Sing bhajans and offer makhan-mishri"]
        }
    },
    {
        keys: ["hartalika"], info: {
            deity: "Goddess Parvati and Lord Shiva",
            about: "Remembers Parvati's devotion that won Shiva as her husband. Women keep a strict fast and worship clay idols of Shiva and Parvati.",
            todo: ["Make or place clay idols of Shiva and Parvati", "Keep the fast", "Stay awake and sing devotional songs"]
        }
    },
    {
        keys: ["ganesh chaturthi"], info: {
            deity: "Lord Ganesha",
            about: "The birth of Lord Ganesha. Idols are installed in homes and pandals and are worshipped for several days.",
            todo: ["Install a clay idol of Ganesha", "Offer modak and durva", "Do aarti morning and evening"]
        }
    },
    {
        keys: ["onam"], info: {
            deity: "King Mahabali and Lord Vamana",
            about: "The harvest festival of Kerala, welcoming the spirit of King Mahabali with flower carpets (pookalam), boat races and a grand feast, the Onasadya.",
            todo: ["Make a pookalam at the entrance", "Enjoy the Onasadya on a banana leaf", "Watch Kathakali or boat races"]
        }
    },
    {
        keys: ["anant chaturdashi"], info: {
            deity: "Lord Vishnu (Ananta) and Lord Ganesha",
            about: "Worship of Lord Ananta, the endless form of Vishnu. It is also the day when Ganesha idols are immersed with devotion.",
            todo: ["Tie the Anant sutra thread", "Perform Ganesh visarjan with care for nature", "Chant Vishnu Sahasranama"]
        }
    },
    {
        keys: ["pitru paksha begins"], info: {
            deity: "Pitru (ancestors)",
            about: "A fortnight of remembering and honouring ancestors through shraddh and tarpan.",
            todo: ["Offer water and sesame (tarpan)", "Feed Brahmins or the poor", "Feed cows, crows and dogs"]
        }
    },
    {
        keys: ["sarva pitru"], info: {
            deity: "Pitru (ancestors)",
            about: "The last day of Pitru Paksha. Shraddh can be offered for all ancestors, especially if their date of passing is not known.",
            todo: ["Offer tarpan and shraddh", "Donate food and clothes", "Light a lamp for your ancestors"]
        }
    },
    {
        keys: ["sharad navratri"], info: {
            deity: "Goddess Durga",
            about: "Nine nights and ten days of worship of Goddess Durga, with fasting, garba, dandiya and Durga Puja pandals.",
            todo: ["Set up Ghatasthapana", "Fast and offer prayers to a different form each day", "Join garba or aarti"]
        }
    },
    {
        keys: ["durga ashtami"], info: {
            deity: "Goddess Durga (Mahagauri)",
            about: "One of the most sacred days of Navratri, when Kanya Pujan is performed and Sandhi Puja is held in Bengal.",
            todo: ["Perform Kanya Pujan", "Offer halwa, chana and puri", "Visit a Durga temple or pandal"]
        }
    },
    {
        keys: ["maha navami"], info: {
            deity: "Goddess Siddhidatri",
            about: "The ninth day of Navratri, honouring Goddess Siddhidatri, who is said to grant spiritual powers. Many perform Kanya Pujan today.",
            todo: ["Offer Havan and aarti", "Perform Kanya Pujan", "Break the Navratri fast with prasad"]
        }
    },
    {
        keys: ["vijayadashami", "dussehra"], info: {
            deity: "Lord Rama and Goddess Durga",
            about: "The victory of good over evil: Rama's win over Ravana and Durga's win over Mahishasura. Effigies of Ravana are burnt in the evening.",
            todo: ["Worship tools, books and vehicles (Shastra Puja)", "Watch the Ramleela or Ravan Dahan", "Seek blessings of elders"]
        }
    },
    {
        keys: ["sharad purnima"], info: {
            deity: "Goddess Lakshmi and the Moon",
            about: "The brightest full moon of the year. A bowl of kheer is kept under the moonlight and eaten the next morning as blessed prasad.",
            todo: ["Keep kheer in the moonlight", "Worship Lakshmi", "Stay up late in prayer and bhajans"]
        }
    },
    {
        keys: ["karwa chauth"], info: {
            deity: "Goddess Parvati and the Moon",
            about: "Married women fast from sunrise till moonrise for the long life of their husbands and break the fast after seeing the moon.",
            todo: ["Wake up for sargi before sunrise", "Listen to the Karwa Chauth katha", "Break the fast after moonrise"]
        }
    },
    {
        keys: ["ahoi ashtami"], info: {
            deity: "Ahoi Mata",
            about: "Mothers fast from sunrise till they see the stars for the wellbeing and long life of their children.",
            todo: ["Draw or place an image of Ahoi Mata", "Listen to the Ahoi Ashtami katha", "Break the fast after seeing the stars"]
        }
    },
    {
        keys: ["dhanteras"], info: {
            deity: "Lord Dhanvantari and Goddess Lakshmi",
            about: "The first day of Diwali. It is considered good to buy gold, silver or new utensils, and to pray for health and wealth.",
            todo: ["Light a diya outside the home in the evening", "Buy something new, such as a utensil", "Worship Dhanvantari and Lakshmi"]
        }
    },
    {
        keys: ["choti diwali", "narak chaturdashi"], info: {
            deity: "Lord Krishna and Goddess Kali",
            about: "Remembers Krishna's victory over the demon Narakasura. Early morning oil bath and many lamps mark the day.",
            todo: ["Take an early morning bath with oil and ubtan", "Light diyas in the evening", "Prepare rangoli and decorate the home"]
        }
    },
    {
        keys: ["diwali (lakshmi", "lakshmi puja"], info: {
            deity: "Goddess Lakshmi and Lord Ganesha",
            about: "The festival of lights, celebrating Rama's return to Ayodhya and the victory of light over darkness. Families worship Lakshmi and Ganesha in the evening.",
            todo: ["Do Lakshmi-Ganesh Puja at the muhurat", "Light diyas and draw rangoli", "Share sweets and gifts"]
        }
    },
    {
        keys: ["govardhan"], info: {
            deity: "Lord Krishna and Govardhan Hill",
            about: "Remembers how Krishna lifted Govardhan Hill to protect the people of Vrindavan. A mountain of food (Annakut) is offered to God.",
            todo: ["Make a Govardhan hill from cow dung or clay", "Offer Annakut prasad", "Worship cows"]
        }
    },
    {
        keys: ["bhai dooj"], info: {
            deity: "Yama and Yamuna",
            about: "Sisters put a tilak on their brothers' forehead and pray for their long life, remembering the bond of Yama and Yamuna.",
            todo: ["Apply tilak and do aarti for your brother", "Share a meal together", "Exchange gifts"]
        }
    },
    {
        keys: ["chhath"], info: {
            deity: "Surya Dev and Chhathi Maiya",
            about: "A four-day festival, mainly in Bihar, Jharkhand and eastern UP. Devotees fast and offer arghya to the setting and rising Sun while standing in water.",
            todo: ["Offer arghya at the river or pond at sunset and sunrise", "Prepare prasad such as thekua", "Keep the strict fast"]
        }
    },
    {
        keys: ["dev uthani"], info: {
            deity: "Lord Vishnu",
            about: "Lord Vishnu wakes from his four-month sleep, Chaturmas ends and weddings begin again.",
            todo: ["Fast and worship Vishnu", "Draw the footprints of Lord Vishnu with rangoli", "Prepare for Tulsi Vivah"]
        }
    },
];

/** Festival ki jaankari. Pehle naam se, phir category se. */
export function getFestivalInfo(name: string): FestivalInfo {
    const base = CATEGORY_INFO[getCategory(name)];
    const n = name.toLowerCase();
    const hit = INFO_BY_NAME.find((m) => m.keys.some((k) => n.includes(k)));
    return hit ? { ...base, ...hit.info } : base;
}

/** Aaj se kitne din baad (0 = aaj, negative = beet gaya). */
export function daysFromToday(iso: string, from: Date = new Date()): number {
    const a = new Date(`${iso}T12:00:00`).getTime();
    const b = new Date(`${toISO(from)}T12:00:00`).getTime();
    return Math.round((a - b) / 86400000);
}