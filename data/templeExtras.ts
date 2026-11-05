export type TempleExtra = {
    website?: string;
    bestTime?: string;
    nearestRailway?: string;
    nearestAirport?: string;
    entryFee?: string;
    dressCode?: string;
    checked?: string; // sirf tab likho jab khud official site se dekha ho
};

export const templeExtras: Record<string, TempleExtra> = {
    "kashi-vishwanath-temple": {
        website: "https://shrikashivishwanath.org",
        bestTime: "October to March",
        nearestRailway: "Varanasi Cantt",
        nearestAirport: "Lal Bahadur Shastri Airport, Varanasi",
        entryFee: "Free. Special darshan and pujas are paid.",
        dressCode: "Decent, covered clothing",
        checked: "Nov 2026",
    },
    "ayodhya-ram-mandir": {
        website: "https://srjbtkshetra.org",
        bestTime: "October to March",
        nearestRailway: "Ayodhya Dham Junction",
        nearestAirport: "Maharishi Valmiki International Airport, Ayodhya",
        entryFee: "Free. Aarti passes are free but need online booking.",
        dressCode: "Modest clothing",
        checked: "Nov 2026",
    },
    "kedarnath-temple": {
        bestTime: "May to June and September to October",
        nearestRailway: "Rishikesh",
        nearestAirport: "Jolly Grant Airport, Dehradun",
        entryFee: "Free",
        dressCode: "Warm clothes and trekking shoes (about 16 km trek from Gaurikund)",
        checked: "Nov 2026",
    },
    "tirumala-venkateswara-temple": {
        website: "https://tirumala.org",
        bestTime: "September to February",
        nearestRailway: "Tirupati",
        nearestAirport: "Tirupati Airport",
        dressCode: "Traditional clothing",
        entryFee: "Free darshan. Special entry darshan is ticketed.",
    },
    "somnath-temple": {
        website: "https://somnath.org",
        bestTime: "October to March",
        nearestRailway: "Veraval",
        nearestAirport: "Diu Airport",
        dressCode: "Traditional clothing",
        entryFee: "Free",
    },
    "vaishno-devi-temple": {
        website: "https://maavaishnodevi.org",
        bestTime: "March to October",
        nearestRailway: "Shri Mata Vaishno Devi Katra",
        dressCode: "Traditional clothing",
        nearestAirport: "Jammu Airport",
        entryFee: "Free. Yatra registration is required.",
    },
    "siddhivinayak-temple": {
        website: "https://siddhivinayak.org",
        bestTime: "All year (Tuesdays are the busiest)",
        nearestRailway: "Prabhadevi / Dadar",
        dressCode: "Traditional clothing",
        nearestAirport: "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
        entryFee: "Free",
    },
    "shirdi-sai-baba-temple": {
        website: "https://sai.org.in",
        bestTime: "October to March",
        nearestRailway: "Sainagar Shirdi",
        nearestAirport: "Shirdi Airport",
        entryFee: "Free",
        dressCode: "Traditional clothing",
    },

};