export type Puja = { name: string; time: string };

export type Temple = {
    slug: string;
    name: string;
    state: string;
    city: string;
    deity: string;
    timings: string; // opening - closing
    pujas: Puja[]; // puja / aarti ka time
    story: string; // history / kahani
    note?: string; // special baat (dress code, season, etc.)
    lat: number;
    lng: number;
    image?: string;
};

// export const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
export const slugify = (s: string) =>
    s
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export const temples: Temple[] = [
    {
        slug: "kedarnath-temple",
        name: "Kedarnath Temple",
        state: "Uttarakhand",
        city: "Kedarnath",
        deity: "Lord Shiva",
        timings: "4:00 AM - 9:00 PM",
        pujas: [
            { name: "Maha Abhishek", time: "6:00 AM" },
            { name: "Shringar Darshan", time: "3:00 PM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "Legend says the Pandavas, after the Kurukshetra war, went searching for Shiva to seek forgiveness. Shiva hid as a bull in Kedar, and when Bhima caught him, the bull's hump remained on earth as a stone. The Pandavas built the first temple here, and Adi Shankaracharya later revived it. It stands at 3,583 m among snow peaks, and pilgrims still walk to it as an act of devotion.",
        note: "Open only from about April/May to October/November. Closed in winter due to snow.",
        lat: 30.7352,
        lng: 79.0669,
    },
    {
        slug: "kashi-vishwanath-temple",
        name: "Kashi Vishwanath Temple",
        state: "Uttar Pradesh",
        city: "Varanasi",
        deity: "Lord Shiva",
        timings: "3:00 AM - 11:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "3:00 AM" },
            { name: "Bhog Aarti", time: "11:15 AM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
            { name: "Shayan Aarti", time: "10:30 PM" },
        ],
        story:
            "Kashi is said to be older than history itself, and this Jyotirlinga is believed to be the centre of the city Shiva loves most. The temple was destroyed and rebuilt several times over the centuries. The present structure was built by Queen Ahilyabai Holkar in 1780, and its spire was later covered in gold. Hindus believe that dying in Kashi grants moksha.",
        lat: 25.3109,
        lng: 83.0107,
    },
    {
        slug: "ayodhya-ram-mandir",
        name: "Ayodhya Ram Mandir",
        state: "Uttar Pradesh",
        city: "Ayodhya",
        deity: "Lord Ram",
        timings: "7:00 AM - 7:00 PM",
        pujas: [
            { name: "Shringar Aarti", time: "6:30 AM" },
            { name: "Bhog Aarti", time: "12:00 PM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "Ayodhya is the city where Lord Ram was born, according to the Ramayana. The birthplace has been a centre of faith for centuries, and the modern temple was consecrated in January 2024 after a long legal and social journey. Built in the Nagara style with pink sandstone, it has become one of the most visited pilgrimage sites in India.",
        lat: 26.7956,
        lng: 82.1943,
    },
    {
        slug: "meenakshi-amman-temple",
        name: "Meenakshi Amman Temple",
        state: "Tamil Nadu",
        city: "Madurai",
        deity: "Goddess Meenakshi",
        timings: "5:00 AM - 12:30 PM, 4:00 PM - 10:00 PM",
        pujas: [
            { name: "Thirupalliyezhuchi", time: "5:00 AM" },
            { name: "Uchikala Puja", time: "10:30 AM" },
            { name: "Arthajama Puja", time: "9:30 PM" },
        ],
        story:
            "Goddess Meenakshi, a form of Parvati, was born with three breasts and was told the third would vanish when she met her husband. She conquered the world as a warrior queen, and the moment she faced Lord Shiva on Mount Kailash it disappeared. Their divine wedding is celebrated here every year. The temple has 14 colourful gopurams and a thousand-pillar hall.",
        lat: 9.9195,
        lng: 78.1193,
    },
    {
        slug: "brahma-temple-pushkar",
        name: "Brahma Temple",
        state: "Rajasthan",
        city: "Pushkar",
        deity: "Lord Brahma",
        timings: "6:00 AM - 1:30 PM, 3:00 PM - 9:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "At sunrise" },
            { name: "Evening Aarti", time: "At sunset" },
        ],
        story:
            "One of the very few temples in the world dedicated to Brahma, the creator. Legend says Brahma dropped a lotus flower here, and a lake, Pushkar, appeared where it fell. He performed a great yajna at this spot. Because of an old curse, Brahma is rarely worshipped elsewhere, which makes Pushkar unique. The famous Pushkar Fair happens every November.",
        lat: 26.4886,
        lng: 74.5525,
    },
    {
        slug: "jagannath-temple-puri",
        name: "Jagannath Temple",
        state: "Odisha",
        city: "Puri",
        deity: "Lord Jagannath",
        timings: "5:00 AM - 11:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "5:00 AM" },
            { name: "Madhyahna Dhupa", time: "12:00 PM" },
            { name: "Sandhya Dhupa", time: "7:00 PM" },
            { name: "Badasinghara", time: "11:00 PM" },
        ],
        story:
            "Jagannath is worshipped here with his brother Balabhadra and sister Subhadra, in wooden forms instead of stone. Every year, the three deities travel on giant chariots in the Rath Yatra, pulled by lakhs of devotees. The temple's kitchen, one of the largest in the world, cooks Mahaprasad in earthen pots on wood fires, with the top pot said to cook first.",
        note: "Only Hindus are allowed inside. Mobile phones and cameras are not permitted.",
        lat: 19.8048,
        lng: 85.818,
    },
    {
        slug: "somnath-temple",
        name: "Somnath Temple",
        state: "Gujarat",
        city: "Veraval",
        deity: "Lord Shiva",
        timings: "6:00 AM - 9:00 PM",
        pujas: [
            { name: "Aarti", time: "7:00 AM" },
            { name: "Aarti", time: "12:00 PM" },
            { name: "Aarti", time: "7:00 PM" },
        ],
        story:
            "The first of the twelve Jyotirlingas. The Moon god Soma was cursed to fade away, and he prayed to Shiva here to be healed, which is why the place is called Somnath, 'Lord of the Moon'. The temple was destroyed and rebuilt many times, and each time devotees raised it again. The present temple was rebuilt in 1951 and stands by the Arabian Sea.",
        lat: 20.888,
        lng: 70.4012,
    },
    {
        slug: "tirumala-venkateswara-temple",
        name: "Tirumala Venkateswara Temple",
        state: "Andhra Pradesh",
        city: "Tirupati",
        deity: "Lord Venkateswara",
        timings: "Open almost all day (darshan by slot)",
        pujas: [
            { name: "Suprabhatam", time: "3:00 AM" },
            { name: "Archana", time: "Early morning" },
            { name: "Ekanta Seva", time: "Late night" },
        ],
        story:
            "Lord Vishnu is said to have come to earth as Venkateswara to help humanity in the Kali Yuga. The story goes that he borrowed money from Kubera for his wedding with Padmavati, and devotees offer gifts and hair to help him repay the debt. It is among the richest and most visited temples in the world, and the Tirupati laddu is world famous.",
        note: "Book darshan slots online in advance.",
        lat: 13.6833,
        lng: 79.3474,
    },
    {
        slug: "siddhivinayak-temple",
        name: "Siddhivinayak Temple",
        state: "Maharashtra",
        city: "Mumbai",
        deity: "Lord Ganesha",
        timings: "5:30 AM - 9:50 PM",
        pujas: [
            { name: "Kakad Aarti", time: "5:30 AM" },
            { name: "Naivedya", time: "12:00 PM" },
            { name: "Evening Aarti", time: "7:30 PM" },
        ],
        story:
            "Built in 1801, this temple is famous for its Ganesha idol with the trunk curled to the right, which is rare and believed to be powerful. It began as a small shrine and is now visited by film stars, industrialists and common people alike, who all believe wishes made here are fulfilled. Tuesday is the busiest day.",
        lat: 19.0169,
        lng: 72.8306,
    },
    {
        slug: "udupi-sri-krishna-matha",
        name: "Udupi Sri Krishna Matha",
        state: "Karnataka",
        city: "Udupi",
        deity: "Lord Krishna",
        timings: "5:30 AM - 9:00 PM",
        pujas: [
            { name: "Morning Puja", time: "6:00 AM" },
            { name: "Maha Puja", time: "12:00 PM" },
            { name: "Ratri Puja", time: "8:00 PM" },
        ],
        story:
            "Saint Madhvacharya founded this matha in the 13th century, after finding a Krishna idol in a lump of clay from a shipwreck. Legend says the saint Kanakadasa, who was denied entry, sang so devotedly outside that the idol turned to face him, and Krishna is still seen through a small window called Kanakana Kindi.",
        lat: 13.3409,
        lng: 74.7519,
    },
    {
        slug: "padmanabhaswamy-temple",
        name: "Padmanabhaswamy Temple",
        state: "Kerala",
        city: "Thiruvananthapuram",
        deity: "Lord Vishnu",
        timings: "3:30 AM - 12:00 PM, 5:00 PM - 7:30 PM",
        pujas: [
            { name: "Nirmalya Darshan", time: "3:30 AM" },
            { name: "Deeparadhana", time: "6:30 PM" },
        ],
        story:
            "Lord Vishnu rests here on the serpent Anantha in a 'Yoga Nidra' pose. The temple was long protected by the Travancore royal family, who considered themselves servants of the deity. In 2011 hidden vaults were opened and found to contain treasures worth billions, making it one of the richest temples on earth.",
        note: "Strict dress code: dhoti for men, saree for women. Only Hindus allowed.",
        lat: 8.4828,
        lng: 76.944,
    },
    {
        slug: "bhadrachalam-temple",
        name: "Bhadrachalam Sri Rama Temple",
        state: "Telangana",
        city: "Bhadrachalam",
        deity: "Lord Ram",
        timings: "4:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
        pujas: [
            { name: "Suprabhatam", time: "4:00 AM" },
            { name: "Abhishekam", time: "Morning" },
            { name: "Nitya Kalyanam", time: "Daily, midday" },
        ],
        story:
            "In the 17th century, a devotee named Kancherla Gopanna, also called Bhakta Ramadasu, built this temple with tax money he had collected, and the Nawab imprisoned him for 12 years. Legend says Ram and Lakshmana secretly repaid the gold coins, and the Nawab freed him. The temple stands on the banks of the Godavari, near where Ram is said to have stayed during his exile.",
        lat: 17.6688,
        lng: 80.8934,
    },
    {
        slug: "mahakaleshwar-temple",
        name: "Mahakaleshwar Temple",
        state: "Madhya Pradesh",
        city: "Ujjain",
        deity: "Lord Shiva",
        timings: "4:00 AM - 11:00 PM",
        pujas: [
            { name: "Bhasma Aarti", time: "4:00 AM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
            { name: "Shayan Aarti", time: "10:30 PM" },
        ],
        story:
            "Ujjain was once the centre of time in Hindu astronomy, and Mahakal is the lord of time itself. The Jyotirlinga here faces south, which is unique, and is said to be self-manifested. The Bhasma Aarti, where the deity is adorned with sacred ash at dawn, is one of the most famous rituals in India.",
        note: "Bhasma Aarti needs advance online booking.",
        lat: 23.1828,
        lng: 75.7682,
    },
    {
        slug: "vishnupad-temple",
        name: "Vishnupad Temple",
        state: "Bihar",
        city: "Gaya",
        deity: "Lord Vishnu",
        timings: "5:00 AM - 8:00 PM",
        pujas: [
            { name: "Morning Puja", time: "6:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "A footprint of Lord Vishnu, about 40 cm long, lies on solid rock here. The story says Vishnu pressed the demon Gayasura into the earth with his foot, and the imprint remains. It is believed that offering pind daan here frees ancestors' souls, so lakhs of people come every year, especially during Pitru Paksha.",
        lat: 24.7476,
        lng: 84.9903,
    },
    {
        slug: "dakshineswar-kali-temple",
        name: "Dakshineswar Kali Temple",
        state: "West Bengal",
        city: "Kolkata",
        deity: "Goddess Bhavatarini (Kali)",
        timings: "6:00 AM - 12:30 PM, 3:00 PM - 8:30 PM",
        pujas: [
            { name: "Mangal Aarti", time: "5:30 AM" },
            { name: "Bhog", time: "12:00 PM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "Rani Rashmoni, a wealthy widow, built this temple in 1855 after dreaming of Goddess Kali. The priest Ramakrishna Paramahamsa later spent years here in deep meditation, and it was here that he had visions of the Divine Mother. His disciple Swami Vivekananda spread his teachings across the world. The temple sits on the banks of the Hooghly.",
        lat: 22.6553,
        lng: 88.3576,
    },
    {
        slug: "durgiana-temple",
        name: "Durgiana Temple",
        state: "Punjab",
        city: "Amritsar",
        deity: "Goddess Durga",
        timings: "5:00 AM - 10:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "5:30 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Often called the 'Silver Temple', it looks like the Golden Temple and stands in the same city, surrounded by a sacred pool. It was built in the early 20th century in the style of Sikh architecture, with beautiful silver doors. Devotees believe that praying here brings peace, and Diwali and Navratri are celebrated with great joy.",
        lat: 31.6274,
        lng: 74.8653,
    },
    {
        slug: "mansa-devi-temple",
        name: "Mansa Devi Temple",
        state: "Haryana",
        city: "Panchkula",
        deity: "Goddess Mansa Devi",
        timings: "5:00 AM - 9:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "5:30 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Mansa Devi is believed to fulfil the wishes (mansa) of her devotees. The temple was built in the early 19th century by the Maharaja of Patiala, and thousands climb up to it during Navratri. Many devotees tie a sacred thread at the temple and return to untie it once their wish is granted.",
        lat: 30.7238,
        lng: 76.8535,
    },
    {
        slug: "jwala-ji-temple",
        name: "Jwala Ji Temple",
        state: "Himachal Pradesh",
        city: "Kangra",
        deity: "Goddess Jwala Devi",
        timings: "5:00 AM - 10:00 PM",
        pujas: [
            { name: "Mangla Aarti", time: "5:00 AM" },
            { name: "Bhog Aarti", time: "12:00 PM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
            { name: "Shayan Aarti", time: "9:30 PM" },
        ],
        story:
            "There is no idol here. The goddess is worshipped as natural flames that rise from cracks in the rock and have burned for centuries, without any fuel. Legend says the tongue of Sati fell here. Even the Mughal emperor Akbar is said to have tried to put the flames out, and failed, then offered a golden umbrella in respect.",
        lat: 31.876,
        lng: 76.3247,
    },
    {
        slug: "vaishno-devi-temple",
        name: "Vaishno Devi Temple",
        state: "Jammu & Kashmir",
        city: "Katra",
        deity: "Goddess Vaishno Devi",
        timings: "Open all day (yatra from Katra)",
        pujas: [
            { name: "Morning Aarti", time: "At sunrise" },
            { name: "Evening Aarti", time: "At sunset" },
        ],
        story:
            "Vaishno Devi, a form of Shakti, was a young girl who wished to devote herself to Lord Vishnu. She hid from the demon Bhairavnath in a cave in the Trikuta hills, and defeated him when he followed her. Devotees walk about 12 km up from Katra chanting 'Jai Mata Di', and pray inside the holy cave to three natural rock forms called pindis.",
        note: "Yatra registration is needed. Helicopter and pony services are available.",
        lat: 33.0308,
        lng: 74.949,
    },
    {
        slug: "kamakhya-temple",
        name: "Kamakhya Temple",
        state: "Assam",
        city: "Guwahati",
        deity: "Goddess Kamakhya",
        timings: "5:30 AM - 1:00 PM, 2:30 PM - 5:30 PM",
        pujas: [
            { name: "Morning Snana & Puja", time: "5:30 AM" },
            { name: "Evening Aarti", time: "5:00 PM" },
        ],
        story:
            "One of the most powerful Shakti Peethas. When Sati's body was carried by Shiva, her yoni is said to have fallen on Nilachal Hill. The temple has no idol, only a natural spring-fed stone. Every June the temple celebrates Ambubachi Mela, when the goddess is believed to be in her yearly cycle, and the temple stays closed for three days.",
        lat: 26.1664,
        lng: 91.7059,
    },
    {
        slug: "baidyanath-dham",
        name: "Baidyanath Dham",
        state: "Jharkhand",
        city: "Deoghar",
        deity: "Lord Shiva",
        timings: "4:00 AM - 3:30 PM, 6:00 PM - 9:00 PM",
        pujas: [
            { name: "Sarkar Puja", time: "4:00 AM" },
            { name: "Shringar Puja", time: "6:00 PM" },
        ],
        story:
            "Legend says that the demon king Ravana pleased Shiva by offering his ten heads, and Shiva came as a divine healer, or Vaidya, to restore them. That is why the Jyotirlinga is called Baidyanath, 'Lord of Physicians'. Every year in Shravan month, lakhs of Kanwariyas walk from Sultanganj carrying holy Ganga water to offer here.",
        lat: 24.4925,
        lng: 86.7003,
    },
    {
        slug: "danteshwari-temple",
        name: "Danteshwari Temple",
        state: "Chhattisgarh",
        city: "Dantewada",
        deity: "Goddess Danteshwari",
        timings: "6:00 AM - 8:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "6:30 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Another Shakti Peetha, where Sati's tooth (dant) is believed to have fallen, which gave the town its name. The Kakatiya kings, who moved here from Telangana, worshipped Danteshwari as their family deity. Hundreds of local tribal people gather here during the Bastar Dussehra, one of the longest festivals in India.",
        lat: 18.8996,
        lng: 81.3492,
    },
    {
        slug: "kalkaji-temple",
        name: "Kalkaji Temple",
        state: "Delhi",
        city: "New Delhi",
        deity: "Goddess Kalka",
        timings: "5:00 AM - 11:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "6:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "This is among the oldest temples in Delhi, and is believed to date back to the days of the Pandavas, who are said to have worshipped the goddess here. The present structure is from the 18th century. Every Navratri, devotees queue for hours, and the temple stays open through the night.",
        lat: 28.5494,
        lng: 77.2588,
    },
    {
        slug: "mangueshi-temple",
        name: "Shri Mangueshi Temple",
        state: "Goa",
        city: "Ponda",
        deity: "Lord Shiva (Mangesh)",
        timings: "6:00 AM - 9:30 PM",
        pujas: [
            { name: "Abhishek", time: "Morning" },
            { name: "Maha Aarti", time: "8:00 PM" },
        ],
        story:
            "During the Portuguese rule in the 16th century, devotees carried the Shiva linga from Kushasthali to Priol to keep it safe from destruction. The temple has stood here since, and its seven-storey deepstambha (lamp tower) glows during festivals. Its white-and-blue architecture blends Hindu and Goan styles.",
        lat: 15.4506,
        lng: 73.97,
    },
    {
        slug: "tripura-sundari-temple",
        name: "Tripura Sundari Temple",
        state: "Tripura",
        city: "Udaipur",
        deity: "Goddess Tripura Sundari",
        timings: "6:00 AM - 1:00 PM, 4:00 PM - 9:00 PM",
        pujas: [
            { name: "Morning Puja", time: "6:30 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "This Shakti Peetha, where Sati's right foot is said to have fallen, was built in 1501 by Maharaja Dhanya Manikya. It is shaped like a tortoise, so it is also called Kurma Peeth. Thousands come here during Diwali for the big fair, and the pond behind the temple is home to sacred turtles.",
        lat: 23.5227,
        lng: 91.4854,
    },
    {
        slug: "shri-govindajee-temple",
        name: "Shri Govindajee Temple",
        state: "Manipur",
        city: "Imphal",
        deity: "Lord Krishna",
        timings: "5:00 AM - 8:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "5:00 AM" },
            { name: "Evening Aarti", time: "6:30 PM" },
        ],
        story:
            "Manipur is a land of Vaishnavism and classical Manipuri dance, and this temple next to the royal palace is its spiritual heart. It was built in 1846 by Maharaja Nara Singh. Devotees perform Ras Leela here, telling stories of Radha and Krishna through graceful dance and song.",
        lat: 24.818,
        lng: 93.935,
    },
    // ---- Uttar Pradesh ----
    {
        slug: "banke-bihari-temple",
        name: "Banke Bihari Temple",
        state: "Uttar Pradesh",
        city: "Vrindavan",
        deity: "Lord Krishna",
        timings: "7:45 AM - 12:00 PM, 5:00 PM - 9:30 PM",
        pujas: [
            { name: "Shringar Darshan", time: "9:00 AM" },
            { name: "Rajbhog Darshan", time: "12:00 PM" },
            { name: "Shayan Aarti", time: "9:00 PM" },
        ],
        story:
            "Swami Haridas, a great devotee and musician, is said to have brought this form of Krishna to life through his songs at Nidhivan. Unlike most temples, the curtain here is drawn again and again during darshan, because it is believed the deity's loving gaze is too powerful to hold for long. The temple has no bells or conches, only devotional singing.",
        lat: 27.5811,
        lng: 77.7005,
    },
    {
        slug: "krishna-janmabhoomi-mathura",
        name: "Shri Krishna Janmabhoomi",
        state: "Uttar Pradesh",
        city: "Mathura",
        deity: "Lord Krishna",
        timings: "5:00 AM - 12:00 PM, 4:00 PM - 9:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "5:00 AM" },
            { name: "Shringar Aarti", time: "9:00 AM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "This is believed to be the exact prison cell where Lord Krishna was born to Devaki and Vasudeva, while his uncle Kansa ruled in fear of a prophecy. Vasudeva is said to have carried the infant Krishna across the Yamuna that same night to keep him safe. Today the site includes temples, a research institute, and marks one of Hinduism's most sacred birthplaces.",
        lat: 27.5045,
        lng: 77.6737,
    },
    {
        slug: "sankat-mochan-hanuman-temple",
        name: "Sankat Mochan Hanuman Temple",
        state: "Uttar Pradesh",
        city: "Varanasi",
        deity: "Lord Hanuman",
        timings: "5:00 AM - 10:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "5:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Founded by the poet-saint Tulsidas in the 16th century, who is said to have had a vision of Hanuman at this very spot on the banks of the Assi river. 'Sankat Mochan' means 'remover of troubles', and devotees come here especially on Tuesdays and Saturdays to seek relief from difficulties. The temple is also known for feeding monkeys that live freely on its grounds.",
        lat: 25.2839,
        lng: 82.9959,
    },

    // ---- Rajasthan ----
    {
        slug: "karni-mata-temple",
        name: "Karni Mata Temple",
        state: "Rajasthan",
        city: "Deshnoke",
        deity: "Karni Mata (form of Durga)",
        timings: "4:00 AM - 10:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "5:00 AM" },
            { name: "Sandhya Aarti", time: "7:30 PM" },
        ],
        story:
            "Known across the world as the 'Temple of Rats', it is home to over 20,000 black rats, considered sacred and called kabbas. Legend says Karni Mata, a revered mystic, begged Yama the god of death to restore her stepson's life, and he agreed to reincarnate her family members as rats instead of dying again. Spotting a rare white rat among them is considered especially lucky.",
        lat: 27.7981,
        lng: 73.3392,
    },
    {
        slug: "eklingji-temple",
        name: "Eklingji Temple",
        state: "Rajasthan",
        city: "Udaipur",
        deity: "Lord Shiva (Eklingnath)",
        timings: "4:30 AM - 6:45 PM",
        pujas: [
            { name: "Morning Aarti", time: "5:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Built in the 8th century, this temple has a striking four-faced black marble idol of Shiva. The Maharanas of Mewar, including the legendary Maharana Pratap, considered themselves mere custodians of the kingdom, ruling only as diwans (ministers) on behalf of Eklingji, who they believed was the true king. The temple complex has over 100 shrines.",
        lat: 24.8306,
        lng: 73.6912,
    },
    {
        slug: "govind-dev-ji-temple",
        name: "Govind Dev Ji Temple",
        state: "Rajasthan",
        city: "Jaipur",
        deity: "Lord Krishna",
        timings: "5:00 AM - 12:00 PM, 4:30 PM - 9:30 PM",
        pujas: [
            { name: "Mangala Jhanki", time: "5:00 AM" },
            { name: "Rajbhog", time: "11:00 AM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "The idol here was originally worshipped in Vrindavan and moved to Jaipur to protect it from invasions. Maharaja Sawai Jai Singh II, the founder of Jaipur, planned his entire City Palace so that his own bedroom window faced this temple, allowing him the first glimpse of the deity every morning. It remains one of Rajasthan's most visited Krishna temples.",
        lat: 26.9257,
        lng: 75.8237,
    },
    {
        slug: "khatu-shyam-ji-temple",
        name: "Khatu Shyam Ji Temple",
        state: "Rajasthan",
        city: "Sikar",
        deity: "Khatu Shyam (Barbarik)",
        timings: "5:00 AM - 9:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "5:00 AM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "Khatu Shyam is worshipped as Barbarik, the grandson of Bhima, who possessed three magical arrows powerful enough to end any war in a single shot. When Krishna tested his loyalty during the Mahabharata, Barbarik offered his own head as sacrifice. Pleased, Krishna blessed him that he would be worshipped in the Kali Yuga under the name Shyam. Lakhs gather here every year, especially during the Phalgun fair.",
        lat: 27.6252,
        lng: 75.4901,
    },
    {
        slug: "salasar-balaji-temple",
        name: "Salasar Balaji Temple",
        state: "Rajasthan",
        city: "Churu",
        deity: "Lord Hanuman",
        timings: "4:00 AM - 10:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "4:30 AM" },
            { name: "Sandhya Aarti", time: "7:30 PM" },
        ],
        story:
            "Unusual among Hanuman temples, the idol here has a flowing beard and moustache. Legend says the idol was found in a farmer's field in Gujarat in the 18th century, and following a divine dream, it was carried to Salasar and installed. Devotees walk here in groups on foot from long distances, especially during Chaitra and Ashwin Poornima fairs.",
        lat: 27.6773,
        lng: 74.8973,
    },

    // ---- West Bengal ----
    {
        slug: "kalighat-kali-temple",
        name: "Kalighat Kali Temple",
        state: "West Bengal",
        city: "Kolkata",
        deity: "Goddess Kali",
        timings: "5:00 AM - 2:00 PM, 5:00 PM - 10:30 PM",
        pujas: [
            { name: "Nitya Puja", time: "5:00 AM" },
            { name: "Bhog Aarti", time: "12:00 PM" },
            { name: "Sandhya Aarti", time: "6:30 PM" },
        ],
        story:
            "One of the 51 Shakti Peethas, where the toes of Sati's right foot are said to have fallen. The city of Kolkata is believed to take its name from this temple, 'Kalikshetra' becoming 'Calcutta'. The current structure dates to 1809, and the goddess is worshipped here in her fierce Kali form with a golden tongue and three large eyes.",
        lat: 22.5192,
        lng: 88.3426,
    },
    {
        slug: "belur-math",
        name: "Belur Math",
        state: "West Bengal",
        city: "Howrah",
        deity: "Sri Ramakrishna",
        timings: "6:30 AM - 11:30 AM, 3:30 PM - 6:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "6:30 AM" },
            { name: "Evening Aarti", time: "5:30 PM" },
        ],
        story:
            "Headquarters of the Ramakrishna Mission, founded by Swami Vivekananda in memory of his guru Sri Ramakrishna. The main temple's architecture blends Hindu, Islamic and Christian styles, symbolising the unity of all religions that Ramakrishna taught. It sits peacefully on the bank of the Hooghly river, and is as much a spiritual centre as a place of quiet reflection.",
        lat: 22.6307,
        lng: 88.3565,
    },
    {
        slug: "tarapith-temple",
        name: "Tarapith Temple",
        state: "West Bengal",
        city: "Birbhum",
        deity: "Goddess Tara",
        timings: "5:00 AM - 10:00 PM",
        pujas: [
            { name: "Morning Puja", time: "5:30 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Another Shakti Peetha, associated with the tantric saint Bamakhepa, who is said to have worshipped the goddess in the nearby cremation ground and communed with her directly. Tarapith remains a major centre of Tantric Hindu worship, drawing pilgrims and sadhus who believe the goddess Tara grants protection and fulfils desires here.",
        lat: 24.0125,
        lng: 87.7911,
    },
    {
        slug: "tarakeswar-temple",
        name: "Tarakeswar Temple",
        state: "West Bengal",
        city: "Hooghly",
        deity: "Lord Shiva (Taraknath)",
        timings: "4:00 AM - 9:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "4:30 AM" },
            { name: "Evening Aarti", time: "6:30 PM" },
        ],
        story:
            "Built in 1729, this Shiva linga is said to have been discovered by a devotee named Bharamalla after Shiva appeared to him in a dream. During the month of Shravan, devotees called 'Bolbom' carry holy water on foot for over 30 km from the Ganges to pour over the linga, one of the largest annual pilgrimages in Bengal.",
        lat: 22.8815,
        lng: 87.9989,
    },
    {
        slug: "mayapur-iskcon-temple",
        name: "ISKCON Sri Mayapur Chandrodaya Mandir",
        state: "West Bengal",
        city: "Nadia",
        deity: "Lord Krishna & Chaitanya Mahaprabhu",
        timings: "4:30 AM - 9:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "4:30 AM" },
            { name: "Guru Puja", time: "7:15 AM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "Mayapur is regarded as the birthplace of Sri Chaitanya Mahaprabhu, the 15th-century saint who spread devotion to Krishna through congregational chanting. Today it is the spiritual headquarters of the global ISKCON movement, and hosts one of the largest planned Vedic temples in the world, drawing devotees from across the globe.",
        lat: 23.4257,
        lng: 88.3945,
    },

    // ---- Bihar ----
    {
        slug: "mahabodhi-temple",
        name: "Mahabodhi Temple",
        state: "Bihar",
        city: "Bodh Gaya",
        deity: "Buddha (revered by Hindus & Buddhists)",
        timings: "5:00 AM - 9:00 PM",
        pujas: [
            { name: "Morning Prayers", time: "5:30 AM" },
            { name: "Evening Prayers", time: "6:00 PM" },
        ],
        story:
            "Marks the exact spot where Siddhartha Gautama is believed to have attained enlightenment under the Bodhi Tree over 2,500 years ago. A descendant of that original tree still stands beside the temple today. A UNESCO World Heritage Site, it is one of the four holiest places in Buddhism and is also visited and respected widely by Hindus.",
        lat: 24.6961,
        lng: 84.9914,
    },
    {
        slug: "mahavir-mandir-patna",
        name: "Mahavir Mandir",
        state: "Bihar",
        city: "Patna",
        deity: "Lord Hanuman",
        timings: "5:00 AM - 10:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "5:00 AM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "Located right beside Patna Junction railway station, this is said to be one of the busiest and richest Hanuman temples in India, welcoming lakhs of travellers and devotees daily. It is famous for its laddus, sold in huge quantities, with proceeds funding hospitals and charitable causes run by the temple trust.",
        lat: 25.6093,
        lng: 85.1376,
    },
    {
        slug: "janaki-mandir-sitamarhi",
        name: "Janaki Mandir",
        state: "Bihar",
        city: "Sitamarhi",
        deity: "Goddess Sita",
        timings: "5:00 AM - 8:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "5:30 AM" },
            { name: "Evening Aarti", time: "6:30 PM" },
        ],
        story:
            "Sitamarhi is believed to be the birthplace of Goddess Sita, found by King Janaka while ploughing a sacred field, which is how she came to be called Sita, meaning 'furrow'. The temple, built in the early 20th century, is an important stop for pilgrims tracing the story of the Ramayana, and draws large crowds during Ram Navami and Vivah Panchami, which celebrates Sita and Ram's wedding.",
        lat: 26.5934,
        lng: 85.4899,
    },
    // ---- Uttarakhand ----
    {
        slug: "badrinath-temple",
        name: "Badrinath Temple",
        state: "Uttarakhand",
        city: "Badrinath",
        deity: "Lord Vishnu",
        timings: "4:30 AM - 1:00 PM, 4:00 PM - 9:00 PM",
        pujas: [
            { name: "Mahabhishek", time: "5:00 AM" },
            { name: "Sandhya Aarti", time: "6:30 PM" },
        ],
        story:
            "One of the Char Dham, sitting at 3,133 m in the Himalayas beside the Alaknanda river. Legend says Lord Vishnu meditated here for years, and Goddess Lakshmi covered him in the form of a badri (berry) tree to shield him from the cold, giving the place its name. Adi Shankaracharya is credited with reviving worship here in the 8th century.",
        note: "Open only from around April/May to November. Closed in winter.",
        lat: 30.7433,
        lng: 79.4938,
    },
    {
        slug: "gangotri-temple",
        name: "Gangotri Temple",
        state: "Uttarakhand",
        city: "Gangotri",
        deity: "Goddess Ganga",
        timings: "6:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "6:30 AM" },
            { name: "Evening Ganga Aarti", time: "7:00 PM" },
        ],
        story:
            "Marks the spot where the river Ganga is believed to have first touched Earth, after King Bhagirath's long penance persuaded her to descend from the heavens and Lord Shiva caught her in his hair to soften the fall. The actual glacial source, Gaumukh, lies further up, but this temple by the Bhagirathi river is where pilgrims gather.",
        note: "Open only from around April/May to November.",
        lat: 30.995,
        lng: 78.9398,
    },
    {
        slug: "yamunotri-temple",
        name: "Yamunotri Temple",
        state: "Uttarakhand",
        city: "Yamunotri",
        deity: "Goddess Yamuna",
        timings: "6:00 AM - 1:00 PM, 3:00 PM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Source of the sacred Yamuna river and one of the Char Dham. Pilgrims trek several kilometres on foot or pony to reach the shrine, where hot springs beside the temple are used to cook rice and potatoes as offerings, a tradition unique to this site.",
        note: "Open only from around April/May to November.",
        lat: 31.014,
        lng: 78.4551,
    },
    {
        slug: "tungnath-temple",
        name: "Tungnath Temple",
        state: "Uttarakhand",
        city: "Chopta",
        deity: "Lord Shiva",
        timings: "6:00 AM - 1:00 PM, 3:00 PM - 7:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "The highest Shiva temple in the world at over 3,600 m, and part of the Panch Kedar. Legend says the Pandavas built it while searching for Shiva to atone for their sins after the Kurukshetra war. A short trek from Chopta leads pilgrims through alpine meadows to reach it.",
        note: "Open only from around April/May to November.",
        lat: 30.4869,
        lng: 79.2166,
    },

    // ---- Tamil Nadu ----
    {
        slug: "brihadeeswarar-temple",
        name: "Brihadeeswarar Temple",
        state: "Tamil Nadu",
        city: "Thanjavur",
        deity: "Lord Shiva",
        timings: "6:00 AM - 12:30 PM, 4:00 PM - 8:30 PM",
        pujas: [
            { name: "Morning Puja", time: "6:30 AM" },
            { name: "Evening Puja", time: "6:00 PM" },
        ],
        story:
            "Built by the Chola king Raja Raja I in 1010 CE, this UNESCO World Heritage temple has a 66-metre granite tower, capped by a single 80-tonne stone believed to have been hauled up a 6 km ramp. It remains a masterpiece of Dravidian architecture, with the linga inside standing nearly 4 metres tall.",
        lat: 10.7828,
        lng: 79.1318,
    },
    {
        slug: "ramanathaswamy-temple",
        name: "Ramanathaswamy Temple",
        state: "Tamil Nadu",
        city: "Rameswaram",
        deity: "Lord Shiva",
        timings: "5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
        pujas: [
            { name: "Palliyarai Puja", time: "5:00 AM" },
            { name: "Sayaraksha Puja", time: "8:45 PM" },
        ],
        story:
            "One of the twelve Jyotirlingas, believed to have been established by Lord Ram himself to seek forgiveness for killing Ravana, a Brahmin. The temple is famous for its corridor, the longest in any Hindu temple in the world, lined with over a thousand carved pillars.",
        lat: 9.2882,
        lng: 79.3129,
    },
    {
        slug: "ranganathaswamy-temple",
        name: "Ranganathaswamy Temple",
        state: "Tamil Nadu",
        city: "Srirangam",
        deity: "Lord Vishnu (Ranganatha)",
        timings: "6:00 AM - 1:00 PM, 3:00 PM - 9:00 PM",
        pujas: [
            { name: "Morning Puja", time: "6:30 AM" },
            { name: "Evening Puja", time: "6:30 PM" },
        ],
        story:
            "One of the largest functioning Hindu temple complexes in the world, spread across 156 acres with 21 towering gopurams. Legend says the deity was originally worshipped by Lord Ram's ancestors and later gifted to Vibhishana, who placed it here when it could not be moved further.",
        lat: 10.8624,
        lng: 78.6905,
    },
    {
        slug: "arunachaleswarar-temple",
        name: "Arunachaleswarar Temple",
        state: "Tamil Nadu",
        city: "Thiruvannamalai",
        deity: "Lord Shiva (as fire)",
        timings: "5:30 AM - 12:30 PM, 3:30 PM - 9:00 PM",
        pujas: [
            { name: "Morning Puja", time: "6:00 AM" },
            { name: "Deepa Aarti", time: "6:00 PM" },
        ],
        story:
            "Believed to be the site where Shiva appeared as an infinite column of fire to settle a dispute between Brahma and Vishnu over who was greater. The annual Karthigai Deepam festival lights a giant flame atop the hill, visible for kilometres, drawing over a million devotees.",
        lat: 12.2253,
        lng: 79.0747,
    },

    // ---- Odisha ----
    {
        slug: "konark-sun-temple",
        name: "Konark Sun Temple",
        state: "Odisha",
        city: "Konark",
        deity: "Surya (Sun God)",
        timings: "6:00 AM - 8:00 PM",
        pujas: [{ name: "No regular worship (monument temple)", time: "—" }],
        story:
            "Built in the 13th century as a giant stone chariot for the Sun God, with 24 elaborately carved wheels and seven horses. A UNESCO World Heritage Site, it was designed so that the first rays of the sun would strike the entrance, and its intricate stone carvings are considered among the finest in India.",
        note: "This is a protected monument, not an active worship temple.",
        lat: 19.8876,
        lng: 86.0945,
    },
    {
        slug: "lingaraj-temple",
        name: "Lingaraj Temple",
        state: "Odisha",
        city: "Bhubaneswar",
        deity: "Lord Shiva (Harihara)",
        timings: "6:00 AM - 9:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "6:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "The largest temple in Bhubaneswar, the 'Temple City of India', built over centuries starting in the 11th century by the Somavanshi and Ganga kings. The deity is worshipped as both Shiva and Vishnu combined, and the temple's 55-metre tower dominates the city's skyline.",
        note: "Non-Hindus are generally viewed only from a platform outside.",
        lat: 20.2372,
        lng: 85.8345,
    },
    {
        slug: "tara-tarini-temple",
        name: "Tara Tarini Temple",
        state: "Odisha",
        city: "Ganjam",
        deity: "Goddess Tara Tarini",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "One of the four principal Shakti Peethas of Odisha, perched on Kumari hills overlooking the Rushikulya river. Legend says the breasts of Sati fell here, and the twin goddesses Tara and Tarini are worshipped as sister forms of Shakti, drawing pilgrims especially during Chaitra Parba.",
        lat: 19.227,
        lng: 84.7911,
    },

    // ---- Andhra Pradesh ----
    {
        slug: "srisailam-mallikarjuna-temple",
        name: "Srisailam Mallikarjuna Temple",
        state: "Andhra Pradesh",
        city: "Srisailam",
        deity: "Lord Shiva",
        timings: "4:30 AM - 10:00 PM",
        pujas: [
            { name: "Suprabhata Seva", time: "5:00 AM" },
            { name: "Maha Nirvana Aarti", time: "9:00 PM" },
        ],
        story:
            "One of the twelve Jyotirlingas and also one of the 18 Shakti Peethas, unique for housing both in one place. Perched on the Nallamala hills above the Krishna river, it is believed that worship here removes even the gravest sins, and pilgrims often combine it with a visit to nearby Srisailam Dam.",
        lat: 16.0739,
        lng: 78.8677,
    },
    {
        slug: "simhachalam-temple",
        name: "Simhachalam Temple",
        state: "Andhra Pradesh",
        city: "Visakhapatnam",
        deity: "Lord Narasimha",
        timings: "3:00 AM - 9:00 PM",
        pujas: [
            { name: "Suprabhatam", time: "3:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Dedicated to Varaha Narasimha, a form of Vishnu that is part boar and part lion. The deity is kept covered in sandalwood paste all year, becoming visible in its true form for only 12 hours during the Akshaya Tritiya festival, called Chandanotsavam.",
        lat: 17.7645,
        lng: 83.2384,
    },
    {
        slug: "kanaka-durga-temple",
        name: "Kanaka Durga Temple",
        state: "Andhra Pradesh",
        city: "Vijayawada",
        deity: "Goddess Durga",
        timings: "5:00 AM - 9:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "6:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Perched on Indrakeeladri hill above the Krishna river, the temple is linked to a legend where the goddess Durga killed the demon Mahishasura and chose to reside permanently on this hill at the request of the sage Indrakeela. The annual Dasara festival here draws massive crowds.",
        lat: 16.5131,
        lng: 80.6091,
    },
    {
        slug: "annavaram-temple",
        name: "Annavaram Satyanarayana Temple",
        state: "Andhra Pradesh",
        city: "Annavaram",
        deity: "Lord Satyanarayana Swamy",
        timings: "4:00 AM - 9:00 PM",
        pujas: [
            { name: "Suprabhatam", time: "4:00 AM" },
            { name: "Satyanarayana Vratam", time: "Throughout the day" },
        ],
        story:
            "Set atop Ratnagiri hill overlooking the Pampa river, this temple is famous for the Satyanarayana Vratam puja, performed continuously for devotees from morning to night. Thousands come here to seek blessings for new beginnings, marriages and prosperity.",
        lat: 17.3011,
        lng: 82.2083,
    },

    // ---- Gujarat ----
    {
        slug: "dwarkadhish-temple",
        name: "Dwarkadhish Temple",
        state: "Gujarat",
        city: "Dwarka",
        deity: "Lord Krishna",
        timings: "6:30 AM - 1:00 PM, 5:00 PM - 9:30 PM",
        pujas: [
            { name: "Mangala Aarti", time: "6:30 AM" },
            { name: "Sandhya Aarti", time: "7:00 PM" },
        ],
        story:
            "Believed to stand on the site of Krishna's original palace in the kingdom he built after leaving Mathura. Dwarka is one of the four holiest Char Dham sites, and the five-storey temple, supported by 72 pillars, is over 2,500 years old according to tradition.",
        lat: 22.2442,
        lng: 68.9685,
    },
    {
        slug: "ambaji-temple",
        name: "Ambaji Temple",
        state: "Gujarat",
        city: "Banaskantha",
        deity: "Goddess Amba",
        timings: "5:30 AM - 9:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "7:00 AM" },
            { name: "Evening Aarti", time: "7:30 PM" },
        ],
        story:
            "One of the 51 Shakti Peethas, unique for having no idol at all. Worship is offered to a Sri Yantra, a geometric symbol, kept behind a veil, viewed directly with the naked eye only through a mirror. Devotees walk here on foot from across Gujarat and Rajasthan during Bhadarvi Purnima.",
        lat: 24.3306,
        lng: 72.8508,
    },
    {
        slug: "akshardham-gandhinagar",
        name: "Akshardham Temple",
        state: "Gujarat",
        city: "Gandhinagar",
        deity: "Bhagwan Swaminarayan",
        timings: "9:30 AM - 7:00 PM",
        pujas: [{ name: "Aarti", time: "Multiple times daily" }],
        story:
            "Built in 1992, this was the first of the grand Akshardham temples, carved entirely from pink sandstone in traditional Nagara style with no steel supports. It houses a large golden murti of Bhagwan Swaminarayan and is surrounded by gardens and exhibitions on Indian culture.",
        note: "Closed on Mondays.",
        lat: 23.2274,
        lng: 72.64,
    },
    {
        slug: "pavagadh-kalika-mata-temple",
        name: "Kalika Mata Temple, Pavagadh",
        state: "Gujarat",
        city: "Panchmahal",
        deity: "Goddess Kalika",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Perched atop Pavagadh hill within the Champaner-Pavagadh UNESCO World Heritage site, this is one of the Shakti Peethas, said to mark where Sati's toe fell. A ropeway now carries most pilgrims up the steep hill that devotees once climbed entirely on foot.",
        lat: 22.4837,
        lng: 73.5122,
    },

    // ---- Maharashtra ----
    {
        slug: "shirdi-sai-baba-temple",
        name: "Shirdi Sai Baba Temple",
        state: "Maharashtra",
        city: "Shirdi",
        deity: "Sai Baba",
        timings: "4:00 AM - 11:00 PM",
        pujas: [
            { name: "Kakad Aarti", time: "4:30 AM" },
            { name: "Shej Aarti", time: "10:30 PM" },
        ],
        story:
            "Dedicated to Sai Baba, a saint who lived in Shirdi in the late 19th and early 20th centuries and taught the unity of Hindu and Muslim faiths through the phrase 'Sabka Malik Ek', meaning one God for all. His samadhi here draws millions of devotees of every religion each year.",
        lat: 19.7645,
        lng: 74.4762,
    },
    {
        slug: "trimbakeshwar-temple",
        name: "Trimbakeshwar Temple",
        state: "Maharashtra",
        city: "Nashik",
        deity: "Lord Shiva",
        timings: "5:30 AM - 9:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "6:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "One of the twelve Jyotirlingas, unique for having three small faces representing Brahma, Vishnu and Shiva carved into the linga. It sits at the source of the Godavari river, near Brahmagiri hill, and is one of the sites of the Kumbh Mela.",
        lat: 19.9319,
        lng: 73.5296,
    },
    {
        slug: "vitthal-rukmini-temple",
        name: "Vitthal Rukmini Temple",
        state: "Maharashtra",
        city: "Pandharpur",
        deity: "Lord Vitthal & Rukmini",
        timings: "4:00 AM - 11:00 PM",
        pujas: [
            { name: "Kakad Aarti", time: "4:00 AM" },
            { name: "Shej Aarti", time: "10:30 PM" },
        ],
        story:
            "Centre of the Warkari devotional movement, where Lord Vitthal, a form of Krishna, stands with hands on hips. Every year during Ashadhi Ekadashi, hundreds of thousands of pilgrims walk for days in a procession called the Wari, singing devotional songs on their way to Pandharpur.",
        lat: 17.6799,
        lng: 75.3298,
    },
    {
        slug: "grishneshwar-temple",
        name: "Grishneshwar Temple",
        state: "Maharashtra",
        city: "Aurangabad (Sambhajinagar)",
        deity: "Lord Shiva",
        timings: "5:30 AM - 9:30 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "The last of the twelve Jyotirlingas, located near the Ellora Caves. Legend tells of a devoted wife named Kusuma whose faith brought her son back to life, and Shiva emerged here from a lake at her prayer. The current temple was rebuilt in the 18th century by Ahilyabai Holkar.",
        lat: 20.0233,
        lng: 75.1795,
    },

    // ---- Karnataka ----
    {
        slug: "murudeshwar-temple",
        name: "Murudeshwar Temple",
        state: "Karnataka",
        city: "Bhatkal",
        deity: "Lord Shiva",
        timings: "6:00 AM - 8:30 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Famous for its towering Shiva statue, among the tallest in the world at about 37 metres, standing on a hillock jutting into the Arabian Sea. Legend links it to the Ramayana, where a piece of the Atma Linga fell here as Ravana carried it from Kailash.",
        lat: 14.0942,
        lng: 74.4854,
    },
    {
        slug: "virupaksha-temple",
        name: "Virupaksha Temple",
        state: "Karnataka",
        city: "Hampi",
        deity: "Lord Shiva",
        timings: "6:00 AM - 1:00 PM, 3:30 PM - 8:30 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "One of the oldest continuously functioning temples in India, dating back over a thousand years, at the heart of the UNESCO World Heritage site of Hampi. Its 50-metre gopuram towers over the ruins of the once-mighty Vijayanagara Empire.",
        lat: 15.335,
        lng: 76.46,
    },
    {
        slug: "kukke-subramanya-temple",
        name: "Kukke Subramanya Temple",
        state: "Karnataka",
        city: "Sullia",
        deity: "Lord Subramanya (as serpent)",
        timings: "5:30 AM - 2:00 PM, 3:30 PM - 9:00 PM",
        pujas: [
            { name: "Morning Puja", time: "6:00 AM" },
            { name: "Evening Puja", time: "7:00 PM" },
        ],
        story:
            "Dedicated to Subramanya in his form as Vasuki, the king of serpents, believed to have taken refuge here after the churning of the ocean. It is one of the most important sites in India for Sarpa Samskara, rituals performed to relieve doshas linked to serpents.",
        lat: 12.6167,
        lng: 75.65,
    },
    {
        slug: "dharmasthala-temple",
        name: "Dharmasthala Manjunatha Temple",
        state: "Karnataka",
        city: "Dharmasthala",
        deity: "Lord Shiva (Manjunatha)",
        timings: "6:00 AM - 1:30 PM, 5:00 PM - 8:30 PM",
        pujas: [
            { name: "Morning Puja", time: "6:30 AM" },
            { name: "Evening Puja", time: "7:00 PM" },
        ],
        story:
            "Uniquely managed by a Jain family for centuries while the deity worshipped is Shiva, reflecting the region's blend of faiths. The temple is known for feeding thousands of pilgrims for free every day, regardless of religion or background, in its community dining hall.",
        lat: 12.9564,
        lng: 75.3789,
    },

    // ---- Kerala ----
    {
        slug: "sabarimala-temple",
        name: "Sabarimala Ayyappan Temple",
        state: "Kerala",
        city: "Pathanamthitta",
        deity: "Lord Ayyappa",
        timings: "Open only on specific festival days & Malayalam months",
        pujas: [{ name: "Neyyabhishekam", time: "During open season" }],
        story:
            "Set deep in the forested hills of the Western Ghats, reached by climbing 18 sacred steps. Legend says Ayyappa was born of Shiva and Mohini (Vishnu's female form), and chose to remain celibate, which is why the temple traditionally restricts entry for women of menstruating age.",
        note: "Opens only on specific days; check the official calendar before planning a visit.",
        lat: 9.4325,
        lng: 77.0822,
    },
    {
        slug: "guruvayur-temple",
        name: "Guruvayur Temple",
        state: "Kerala",
        city: "Guruvayur",
        deity: "Lord Krishna (Guruvayurappan)",
        timings: "3:00 AM - 1:00 PM, 4:30 PM - 9:00 PM",
        pujas: [
            { name: "Nirmalya Darshan", time: "3:00 AM" },
            { name: "Athazha Puja", time: "8:30 PM" },
        ],
        story:
            "Often called the 'Dwarka of the South', the temple's deity is believed to have been installed by Guru (Brihaspati) and Vayu (the wind god), which gives the town its name. Its temple elephants and daily rituals draw devotees from across South India.",
        note: "Traditional dress code required; only Hindus are allowed inside.",
        lat: 10.5941,
        lng: 76.0401,
    },
    {
        slug: "attukal-bhagavathy-temple",
        name: "Attukal Bhagavathy Temple",
        state: "Kerala",
        city: "Thiruvananthapuram",
        deity: "Goddess Bhagavathy (Kannaki)",
        timings: "4:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Puja", time: "Daily" }],
        story:
            "Home to the Attukal Pongala festival, recognised by the Guinness World Records as the largest annual gathering of women, when millions of devotees cook a sweet offering called pongala on the temple grounds and surrounding streets.",
        lat: 8.4772,
        lng: 76.955,
    },
    {
        slug: "vadakkunnathan-temple",
        name: "Vadakkunnathan Temple",
        state: "Kerala",
        city: "Thrissur",
        deity: "Lord Shiva",
        timings: "3:00 AM - 10:30 AM, 5:00 PM - 8:30 PM",
        pujas: [{ name: "Morning & Evening Puja", time: "Daily" }],
        story:
            "One of the oldest temples in Kerala, believed to have been founded by Parashurama, and built in classic Kerala architectural style with copper-plated roofs. It sits at the centre of Thrissur, host to the famous Thrissur Pooram festival with decorated elephants and traditional drumming.",
        lat: 10.5199,
        lng: 76.2144,
    },

    // ---- Telangana ----
    {
        slug: "yadagirigutta-temple",
        name: "Yadagirigutta Temple",
        state: "Telangana",
        city: "Yadadri",
        deity: "Lord Narasimha",
        timings: "5:00 AM - 9:00 PM",
        pujas: [
            { name: "Suprabhatam", time: "5:00 AM" },
            { name: "Evening Aarti", time: "7:00 PM" },
        ],
        story:
            "Set on a rocky hill, the temple is named after the sage Yadarishi, who is said to have meditated here to have a vision of Lord Narasimha in five forms within a single cave. Recently rebuilt on a grand scale, it has become one of Telangana's most prominent pilgrimage sites.",
        lat: 17.5833,
        lng: 78.95,
    },
    {
        slug: "vemulawada-temple",
        name: "Sri Raja Rajeswara Temple",
        state: "Telangana",
        city: "Vemulawada",
        deity: "Lord Shiva",
        timings: "5:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "An ancient Shiva temple believed to have been built by the Chalukya dynasty over a thousand years ago. It is unusual for also enshrining Sri Rajarajeshwara alongside a Vishnu form in the same sanctum, reflecting the harmony of Shaivite and Vaishnavite worship in the region.",
        lat: 18.4667,
        lng: 78.8333,
    },
    {
        slug: "chilkur-balaji-temple",
        name: "Chilkur Balaji Temple",
        state: "Telangana",
        city: "Hyderabad",
        deity: "Lord Venkateswara",
        timings: "5:00 AM - 7:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Known as the 'Visa Temple', because devotees, especially those hoping to travel abroad, walk 11 rounds around the sanctum while praying, and return for 108 more rounds once their wish is granted. Unusually, it accepts no cash donations or hundi offerings.",
        lat: 17.3467,
        lng: 78.2833,
    },
    {
        slug: "birla-mandir-hyderabad",
        name: "Birla Mandir",
        state: "Telangana",
        city: "Hyderabad",
        deity: "Lord Venkateswara",
        timings: "7:00 AM - 12:00 PM, 3:00 PM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Built entirely of white marble atop Naubath Pahad hill, overlooking the city and Hussain Sagar lake. Completed in 1976 by the Birla family, it combines Rajasthani, South Indian and Utkal styles of temple architecture, and offers panoramic views of Hyderabad.",
        lat: 17.4062,
        lng: 78.4691,
    },

    // ---- Madhya Pradesh ----
    {
        slug: "omkareshwar-temple",
        name: "Omkareshwar Temple",
        state: "Madhya Pradesh",
        city: "Khandwa",
        deity: "Lord Shiva",
        timings: "5:00 AM - 10:00 PM",
        pujas: [
            { name: "Morning Aarti", time: "5:30 AM" },
            { name: "Shayan Aarti", time: "9:30 PM" },
        ],
        story:
            "One of the twelve Jyotirlingas, located on Mandhata Island in the Narmada river, whose shape is said to resemble the Hindu symbol 'Om'. Adi Shankaracharya is believed to have received spiritual initiation here, at a cave now marked as a memorial.",
        lat: 22.2436,
        lng: 76.1523,
    },
    {
        slug: "kandariya-mahadev-temple",
        name: "Kandariya Mahadev Temple",
        state: "Madhya Pradesh",
        city: "Khajuraho",
        deity: "Lord Shiva",
        timings: "6:00 AM - 6:00 PM",
        pujas: [{ name: "No regular worship (monument temple)", time: "—" }],
        story:
            "The largest and most ornate of the Khajuraho group of temples, built by the Chandela dynasty around 1030 CE. A UNESCO World Heritage Site, its walls are covered in thousands of intricate sculptures depicting gods, dancers and daily life, showcasing the peak of medieval Indian temple art.",
        note: "This is a protected monument with limited active worship.",
        lat: 24.8318,
        lng: 79.9199,
    },
    {
        slug: "maihar-sharda-devi-temple",
        name: "Maihar Sharda Devi Temple",
        state: "Madhya Pradesh",
        city: "Maihar",
        deity: "Goddess Sharda (Saraswati)",
        timings: "5:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Perched atop Trikuta hill, reached by over a thousand steps or a ropeway. Legend connects it to Alha, a legendary warrior who is said to still visit the temple each morning before anyone else arrives. It is one of the 51 Shakti Peethas of Devi worship.",
        lat: 24.2667,
        lng: 80.7667,
    },
    {
        slug: "kal-bhairav-temple-ujjain",
        name: "Kal Bhairav Temple",
        state: "Madhya Pradesh",
        city: "Ujjain",
        deity: "Kal Bhairav (fierce form of Shiva)",
        timings: "6:00 AM - 10:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "One of the eight Bhairav shrines associated with the directions, uniquely known for offering liquor to the deity as prasad, poured directly and believed to be absorbed. The temple is said to date back to the era of King Vikramaditya's Ujjain.",
        lat: 23.1957,
        lng: 75.7885,
    },

    // ---- Punjab ----
    {
        slug: "devi-talab-mandir",
        name: "Devi Talab Mandir",
        state: "Punjab",
        city: "Jalandhar",
        deity: "Goddess Durga",
        timings: "5:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Built around a sacred pond (talab), this Shakti Peetha is believed to mark where part of Sati's body fell. It is one of the most visited temples in Punjab, especially crowded during Navratri, when the surrounding market lights up for days of celebration.",
        lat: 31.326,
        lng: 75.5762,
    },
    {
        slug: "kali-mata-mandir-patiala",
        name: "Kali Mata Mandir",
        state: "Punjab",
        city: "Patiala",
        deity: "Goddess Kali",
        timings: "5:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Built in 1936 by Maharaja Bhupinder Singh of Patiala, who was devoted to Goddess Kali and even brought idols and priests specially from Bengal. Its striking red and gold architecture makes it one of the most recognisable landmarks in the city.",
        lat: 30.3398,
        lng: 76.3869,
    },
    {
        slug: "ram-tirath-temple",
        name: "Ram Tirath Temple",
        state: "Punjab",
        city: "Amritsar",
        deity: "Lord Ram & Sage Valmiki",
        timings: "6:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Believed to be the ashram of sage Valmiki, author of the Ramayana, and the place where Sita is said to have lived after being exiled, and where Luv and Kush, her sons, were born and raised. A large fair is held here every November to mark the occasion.",
        lat: 31.689,
        lng: 74.728,
    },

    // ---- Haryana ----
    {
        slug: "sthaneshwar-mahadev-temple",
        name: "Sthaneshwar Mahadev Temple",
        state: "Haryana",
        city: "Kurukshetra",
        deity: "Lord Shiva",
        timings: "5:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "One of the oldest temples in Kurukshetra, the land where the Bhagavad Gita was spoken during the Mahabharata war. Devotees believe Shiva himself resides here to bless the sacred battlefield, and the temple remains a key stop for pilgrims visiting Kurukshetra's holy sites.",
        lat: 29.9695,
        lng: 76.8783,
    },
    {
        slug: "bhadrakali-temple-kurukshetra",
        name: "Bhadrakali Temple",
        state: "Haryana",
        city: "Kurukshetra",
        deity: "Goddess Bhadrakali",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "One of the 51 Shakti Peethas, believed to mark where an anklet of Sati fell. Ancient texts say the Pandavas prayed here before the Kurukshetra war to seek the goddess's blessings for victory, and the site remains linked closely to the Mahabharata's history.",
        lat: 29.9647,
        lng: 76.8412,
    },
    {
        slug: "sheetla-mata-mandir-gurugram",
        name: "Sheetla Mata Mandir",
        state: "Haryana",
        city: "Gurugram",
        deity: "Goddess Sheetla",
        timings: "5:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "One of the most visited temples in the National Capital Region, dedicated to Sheetla Mata, traditionally worshipped for protection from disease and for blessing families with children. The temple sees massive crowds especially during Navratri and the annual Sheetla Ashtami fair.",
        lat: 28.4211,
        lng: 77.0475,
    },

    // ---- Himachal Pradesh ----
    {
        slug: "naina-devi-temple",
        name: "Naina Devi Temple",
        state: "Himachal Pradesh",
        city: "Bilaspur",
        deity: "Goddess Naina Devi",
        timings: "4:00 AM - 10:00 PM",
        pujas: [
            { name: "Mangala Aarti", time: "5:00 AM" },
            { name: "Sandhya Aarti", time: "7:30 PM" },
        ],
        story:
            "One of the 51 Shakti Peethas, believed to be where the eyes (nain) of Sati fell, giving the goddess her name. Perched on a hilltop above the Gobind Sagar reservoir, it is one of the most visited shrines in Himachal, especially during the twice-yearly Navratri fairs.",
        lat: 31.3399,
        lng: 76.5567,
    },
    {
        slug: "chintpurni-temple",
        name: "Chintpurni Temple",
        state: "Himachal Pradesh",
        city: "Una",
        deity: "Goddess Chhinnamastika",
        timings: "4:00 AM - 10:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Another Shakti Peetha, where the feet of Sati are believed to have fallen. The name 'Chintpurni' means the remover of worries, and devotees travel here, often on foot from long distances, believing the goddess relieves them of their troubles and grants their wishes.",
        lat: 31.8167,
        lng: 76.1167,
    },
    {
        slug: "baijnath-temple",
        name: "Baijnath Temple",
        state: "Himachal Pradesh",
        city: "Kangra",
        deity: "Lord Shiva (Vaidyanath)",
        timings: "6:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "An ancient stone temple dating to 1204 CE, dedicated to Shiva as the divine physician, Vaidyanath. Built in the Nagara style, it is one of the few temples in the Kangra valley to have survived largely intact through earthquakes and invasions over the centuries.",
        lat: 32.05,
        lng: 76.65,
    },
    {
        slug: "hidimba-devi-temple",
        name: "Hidimba Devi Temple",
        state: "Himachal Pradesh",
        city: "Manali",
        deity: "Hidimba Devi",
        timings: "8:00 AM - 6:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Built in 1553 around a cave shrine, dedicated to Hidimba, the wife of Bhima from the Mahabharata. Surrounded by tall cedar trees, its wooden pagoda-style architecture is unlike most Hindu temples, reflecting the local hill culture of the Kullu valley.",
        lat: 32.25,
        lng: 77.1789,
    },

    // ---- Jammu & Kashmir ----
    {
        slug: "amarnath-temple",
        name: "Amarnath Cave Temple",
        state: "Jammu & Kashmir",
        city: "Anantnag",
        deity: "Lord Shiva (ice lingam)",
        timings: "Open only during the Amarnath Yatra (Jun-Aug)",
        pujas: [{ name: "Darshan during Yatra season", time: "Seasonal" }],
        story:
            "A high-altitude cave shrine at 3,888 m where a naturally forming ice lingam is worshipped as Shiva, waxing and waning with the moon. Legend says Shiva narrated the secret of immortality to Parvati here, unaware a pair of pigeons overheard it and are said to still nest nearby.",
        note: "Open only during the annual Amarnath Yatra, usually June to August, with registration required.",
        lat: 34.2163,
        lng: 75.5,
    },
    {
        slug: "raghunath-mandir-jammu",
        name: "Raghunath Mandir",
        state: "Jammu & Kashmir",
        city: "Jammu",
        deity: "Lord Ram",
        timings: "6:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Built in the mid-19th century by Maharaja Gulab Singh and his son, this is one of the largest temple complexes in North India, with seven shrines inside a single compound. Its walls were once lined with gold-plated sheets, giving Jammu the nickname 'City of Temples'.",
        lat: 32.73,
        lng: 74.86,
    },
    {
        slug: "shankaracharya-temple",
        name: "Shankaracharya Temple",
        state: "Jammu & Kashmir",
        city: "Srinagar",
        deity: "Lord Shiva",
        timings: "8:00 AM - 6:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Perched atop a hill overlooking Dal Lake, this ancient temple is believed to have been visited by Adi Shankaracharya during his travels across India in the 8th century, which is how it got its name. It offers one of the finest panoramic views of Srinagar city.",
        lat: 34.0793,
        lng: 74.8154,
    },

    // ---- Assam ----
    {
        slug: "umananda-temple",
        name: "Umananda Temple",
        state: "Assam",
        city: "Guwahati",
        deity: "Lord Shiva",
        timings: "6:00 AM - 6:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Located on Peacock Island in the middle of the Brahmaputra river, said to be the smallest inhabited river island in the world. Legend says Shiva burned Kamadeva, the god of love, to ashes here for disturbing his meditation, giving the site its old name, Bhasmachala.",
        lat: 26.1975,
        lng: 91.7433,
    },
    {
        slug: "hayagriva-madhava-temple",
        name: "Hayagriva Madhava Temple",
        state: "Assam",
        city: "Hajo",
        deity: "Lord Vishnu (as Hayagriva)",
        timings: "6:00 AM - 7:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Some Buddhist traditions believe this hilltop temple marks the place where Buddha attained nirvana, while Hindus worship it as a seat of Vishnu in his horse-headed form. This shared reverence makes Hajo a rare meeting point of Hindu and Buddhist pilgrimage.",
        lat: 26.2167,
        lng: 91.5333,
    },
    {
        slug: "navagraha-temple-guwahati",
        name: "Navagraha Temple",
        state: "Assam",
        city: "Guwahati",
        deity: "The Nine Planetary Deities",
        timings: "6:00 AM - 6:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Set on Chitrachal hill, this temple is dedicated to the nine celestial bodies of Hindu astrology, each represented by its own small shrine inside a domed red sanctum. It was once considered a major centre for the study of astronomy and astrology in ancient Assam.",
        lat: 26.1697,
        lng: 91.7642,
    },

    // ---- Jharkhand ----
    {
        slug: "rajrappa-temple",
        name: "Rajrappa Temple (Chhinnamasta)",
        state: "Jharkhand",
        city: "Ramgarh",
        deity: "Goddess Chhinnamasta",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Set at the confluence of the Damodar and Bhairavi rivers, this is one of the few temples in India dedicated to Chhinnamasta, a fierce Tantric goddess depicted holding her own severed head. It is an important centre for Tantric worship in eastern India.",
        lat: 23.628,
        lng: 85.639,
    },
    {
        slug: "pahari-mandir-ranchi",
        name: "Pahari Mandir",
        state: "Jharkhand",
        city: "Ranchi",
        deity: "Lord Shiva",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Sitting atop a hill in the heart of Ranchi at about 2,140 feet, reached by climbing over 450 steps. It offers sweeping views of the city and is especially popular during Shravan, when devotees climb the steps chanting prayers to Shiva.",
        lat: 23.3629,
        lng: 85.3346,
    },
    {
        slug: "deori-mandir",
        name: "Deori Mandir",
        state: "Jharkhand",
        city: "Ranchi",
        deity: "Goddess Durga",
        timings: "6:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "An ancient temple believed to have been built by local tribal rulers centuries ago, blending indigenous and Hindu traditions of worship. It remains an important religious site for both tribal and Hindu communities in the region, especially during Durga Puja.",
        lat: 23.42,
        lng: 85.54,
    },

    // ---- Chhattisgarh ----
    {
        slug: "bamleshwari-temple",
        name: "Bamleshwari Devi Temple",
        state: "Chhattisgarh",
        city: "Dongargarh",
        deity: "Goddess Bamleshwari",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Perched on a 1,600-foot hill, reached by over a thousand steps or a ropeway. Legend connects the temple to the ancient Kamalpur kingdom, whose queen is believed to have taken the form of the goddess to protect her people, giving rise to centuries of devoted worship.",
        lat: 21.19,
        lng: 80.77,
    },
    {
        slug: "mahamaya-temple-ratanpur",
        name: "Mahamaya Devi Temple",
        state: "Chhattisgarh",
        city: "Ratanpur",
        deity: "Goddess Mahamaya",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "One of the oldest and most revered Shakti temples in Chhattisgarh, built by the Kalachuri dynasty over a thousand years ago in the former capital city of Ratanpur. It remains a major pilgrimage site during both spring and autumn Navratri festivals.",
        lat: 22.2977,
        lng: 82.1651,
    },
    {
        slug: "champaran-bhagwan-mahadev-temple",
        name: "Bhagwan Mahadev Temple, Champaran",
        state: "Chhattisgarh",
        city: "Champaran",
        deity: "Lord Shiva",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Champaran is also revered as the birthplace of Saint Vallabhacharya, a major figure in Vaishnavism, and this Shiva temple stands as one of the spiritual anchors of the town, drawing devotees from across the region during Shivratri.",
        lat: 21.65,
        lng: 81.8,
    },

    // ---- Delhi ----
    {
        slug: "akshardham-delhi",
        name: "Akshardham Temple",
        state: "Delhi",
        city: "New Delhi",
        deity: "Bhagwan Swaminarayan",
        timings: "9:30 AM - 6:30 PM",
        pujas: [{ name: "Aarti", time: "Multiple times daily" }],
        story:
            "One of the largest Hindu temple complexes in the world, completed in 2005 using traditional stone-carving techniques without any steel. It holds a Guinness World Record for the largest comprehensive Hindu temple, and features a musical fountain and exhibitions on Indian spirituality.",
        note: "Closed on Mondays. Bags and electronics are not allowed inside.",
        lat: 28.6127,
        lng: 77.2773,
    },
    {
        slug: "laxminarayan-birla-mandir",
        name: "Laxminarayan (Birla) Mandir",
        state: "Delhi",
        city: "New Delhi",
        deity: "Lord Vishnu & Goddess Lakshmi",
        timings: "6:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Built by industrialist B. R. Birla in 1939 and inaugurated by Mahatma Gandhi, on the condition that people of all castes be allowed to enter, unusual for its time. Its towers, gardens and fountains make it one of Delhi's most striking temple landmarks.",
        lat: 28.6367,
        lng: 77.2,
    },
    {
        slug: "hanuman-mandir-connaught-place",
        name: "Hanuman Mandir, Connaught Place",
        state: "Delhi",
        city: "New Delhi",
        deity: "Lord Hanuman",
        timings: "4:00 AM - 11:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Believed to be one of the five Hanuman temples in Delhi built during the Mahabharata era by the Pandavas. Located right in the busy heart of Connaught Place, it stays open almost around the clock and draws especially large crowds every Tuesday and Saturday.",
        lat: 28.632,
        lng: 77.2197,
    },
    {
        slug: "chhatarpur-mandir",
        name: "Chhatarpur Mandir",
        state: "Delhi",
        city: "New Delhi",
        deity: "Goddess Katyayani",
        timings: "5:00 AM - 9:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "The second largest temple complex in India, built over decades starting in 1974, spread across 60 acres with marble carvings in South Indian style. It draws enormous crowds during Navratri, when the entire complex is elaborately decorated.",
        lat: 28.5058,
        lng: 77.1828,
    },

    // ---- Goa ----
    {
        slug: "shantadurga-temple",
        name: "Shantadurga Temple",
        state: "Goa",
        city: "Ponda",
        deity: "Goddess Shantadurga",
        timings: "6:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Dedicated to the goddess as a peacemaker between Shiva and Vishnu, who is said to have intervened during a cosmic battle between the two. The temple's distinctive dome, blending Goan and Portuguese-era architectural styles, makes it one of the most photographed temples in Goa.",
        lat: 15.4064,
        lng: 74.0322,
    },
    {
        slug: "mahalasa-narayani-temple",
        name: "Mahalasa Narayani Temple",
        state: "Goa",
        city: "Ponda",
        deity: "Goddess Mahalasa (Vishnu's Mohini form)",
        timings: "6:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Moved from Verna to Mardol during the Portuguese Inquisition to protect it from destruction, like many Goan temples of that era. The deity is worshipped as a form of Mohini, the enchantress avatar of Vishnu, and the temple's tall brass lamp tower is a striking landmark.",
        lat: 15.42,
        lng: 74.05,
    },
    {
        slug: "saptakoteshwar-temple",
        name: "Shri Saptakoteshwar Temple",
        state: "Goa",
        city: "Narve",
        deity: "Lord Shiva",
        timings: "6:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Once the royal deity of the Kadamba dynasty that ruled Goa, this temple's linga was hidden underwater to save it from repeated invasions before being reinstalled at its present site. It remains an important Shiva shrine on the banks of the Mandovi river.",
        lat: 15.5167,
        lng: 73.9333,
    },

    // ---- Tripura ----
    {
        slug: "unakoti-temple",
        name: "Unakoti",
        state: "Tripura",
        city: "Kailashahar",
        deity: "Lord Shiva & rock-cut deities",
        timings: "8:00 AM - 5:00 PM",
        pujas: [{ name: "No regular daily worship (heritage site)", time: "—" }],
        story:
            "A striking site of giant rock-cut carvings in a forest clearing, its name meaning 'one less than a crore', referring to a legend of Shiva travelling with a crore other gods who all turned to stone here except him. It is one of the largest open-air rock relief galleries in India.",
        note: "This is primarily a heritage and pilgrimage site rather than a daily-worship temple.",
        lat: 24.2333,
        lng: 92.0333,
    },
    {
        slug: "bhuvaneswari-temple-agartala",
        name: "Bhuvaneswari Temple",
        state: "Tripura",
        city: "Agartala",
        deity: "Goddess Bhuvaneswari",
        timings: "6:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Located within the grounds of the historic Ujjayanta Palace, this temple was built by the royal Manikya dynasty of Tripura. The poet Rabindranath Tagore is said to have been inspired by his visits to Agartala's palace and temple grounds during his travels.",
        lat: 23.8315,
        lng: 91.2868,
    },

    // ---- Manipur ----
    {
        slug: "bishnupur-govindajee-temple",
        name: "Vishnu Temple, Bishnupur",
        state: "Manipur",
        city: "Bishnupur",
        deity: "Lord Vishnu",
        timings: "5:00 AM - 8:00 PM",
        pujas: [{ name: "Morning & Evening Aarti", time: "Daily" }],
        story:
            "Located near the famous Loktak Lake, this temple reflects Manipur's deep Vaishnavite tradition that grew alongside its classical Manipuri dance and Ras Leela performances. Bishnupur town itself takes its name from Lord Vishnu, underlining the region's long devotion to him.",
        lat: 24.6167,
        lng: 93.7667,
    },

];

// States apne aap temples se ban jayenge, count bhi real hoga
export const states = Array.from(new Set(temples.map((t) => t.state))).map(
    (name) => ({
        name,
        slug: slugify(name),
        count: temples.filter((t) => t.state === name).length,
    })
);