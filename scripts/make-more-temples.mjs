import fs from "node:fs";
const TM = {
  std: "6:00 AM - 12:00 PM, 4:00 PM - 8:00 PM (approx., confirm locally)",
  early: "5:00 AM - 12:30 PM, 4:00 PM - 9:00 PM (approx., confirm locally)",
  long: "6:00 AM - 9:00 PM (approx., confirm locally)",
  day: "9:00 AM - 5:00 PM (approx., confirm locally)",
};
// [slug, name, state, city, deity, timing, story, lat, lng]
const T = [
// ---- Andhra Pradesh
["draksharamam-bhimeswara-temple","Draksharamam Bhimeswara Temple","Andhra Pradesh","Draksharamam, East Godavari","Lord Shiva (Bhimeswara)","early","One of the Pancharama Kshetras of Andhra Pradesh. The temple has a tall Shiva lingam and fine Chalukya-Chola style carvings.",16.7889,82.0603],
["ahobilam-narasimha-temple","Ahobilam Narasimha Swamy Temple","Andhra Pradesh","Ahobilam, Nandyal","Lord Narasimha","early","A group of nine Narasimha shrines in the Nallamala hills. Tradition links the place to the story of Prahlada and Narasimha.",15.1272,78.7219],
["srikurmam-temple","Srikurmam Temple","Andhra Pradesh","Srikurmam, Srikakulam","Lord Vishnu (Kurma avatar)","early","One of the few temples in India where Vishnu is worshipped as the tortoise avatar. Old inscriptions are found on its walls.",18.2689,84.0985],
["lepakshi-veerabhadra-temple","Lepakshi Veerabhadra Temple","Andhra Pradesh","Lepakshi, Anantapur","Lord Veerabhadra","day","A 16th century Vijayanagara temple known for its hanging pillar, large Nandi and ceiling paintings.",13.8044,77.6104],
["mahanandi-temple","Mahanandi Temple","Andhra Pradesh","Mahanandi, Nandyal","Lord Shiva (Mahanandeeswara)","early","A Shiva temple near Nandyal known for its clear natural water ponds that flow throughout the year.",15.4790,78.6370],
// ---- Assam
["basistha-temple-guwahati","Basistha Temple","Assam","Guwahati","Lord Shiva","std","A Shiva temple near the Basistha Ashram, linked to sage Vasistha. Three streams flow near the temple.",26.1068,91.7976],
["ugratara-temple-guwahati","Ugratara Temple","Assam","Guwahati","Goddess Ugratara","std","A Shakti shrine in Guwahati near a pond and the old Jorpukhuri area, visited especially during Durga Puja.",26.1750,91.7400],
["sukreswar-temple-guwahati","Sukreswar Temple","Assam","Guwahati","Lord Shiva","std","A Shiva temple on the Sukreswar Ghat of the Brahmaputra, on Sukreswar hill in Guwahati.",26.1870,91.7340],
// ---- Bihar
["ajgaibinath-temple-sultanganj","Ajgaibinath Temple","Bihar","Sultanganj, Bhagalpur","Lord Shiva","early","A Shiva temple built on a rock in the Ganga at Sultanganj. Kanwariyas collect Ganga water here during Shravan.",25.2400,86.7400],
["chandika-sthan-munger","Chandika Sthan","Bihar","Munger","Goddess Chandika","early","A Shakti Peetha near Munger, where the left eye of Sati is believed to have fallen.",25.3730,86.4730],
["harihar-nath-temple-sonepur","Harihar Nath Temple","Bihar","Sonepur, Saran","Lord Harihar (Vishnu and Shiva)","early","An old temple dedicated to Harihar, near the confluence of the Ganga and Gandak. Sonepur is known for its large annual fair.",25.6890,85.1760],
["mangla-gauri-temple-gaya","Mangla Gauri Temple","Bihar","Gaya","Goddess Mangla Gauri","std","A Shakti Peetha on a hill in Gaya, believed to be where Sati's breast fell.",24.7860,85.0000],
["punaura-dham-sitamarhi","Punaura Dham","Bihar","Sitamarhi","Goddess Sita","early","Believed to be the birthplace of Goddess Sita. A temple of Janaki stands here with a sacred pond.",26.5970,85.4840],
// ---- Chhattisgarh
["rajiv-lochan-temple-rajim","Rajiv Lochan Temple","Chhattisgarh","Rajim, Gariaband","Lord Vishnu","std","An old Vishnu temple at the meeting of the Mahanadi, Pairi and Sondur rivers, known as Rajim's Prayag.",20.9660,81.8800],
["laxman-temple-sirpur","Laxman Temple, Sirpur","Chhattisgarh","Sirpur, Mahasamund","Lord Vishnu","day","A 7th century brick temple, one of the best preserved early brick temples of India.",21.3390,82.1830],
["kuleshwar-mahadev-temple-rajim","Kuleshwar Mahadev Temple","Chhattisgarh","Rajim, Gariaband","Lord Shiva","std","A Shiva temple built on an island in the river at Rajim. Local belief says Sita worshipped the lingam here.",20.9680,81.8780],
["dudhadhari-math-raipur","Dudhadhari Math","Chhattisgarh","Raipur","Lord Rama","std","An old Vaishnava math in Raipur with a Ram temple and a peaceful ghat on the Mahadev Ghat side.",21.2440,81.6280],
// ---- Delhi
["jhandewalan-hanuman-mandir","Jhandewalan Hanuman Mandir","Delhi","Jhandewalan, New Delhi","Lord Hanuman","long","A well-known Hanuman temple near Karol Bagh with a tall statue of Hanuman visible from the road.",28.6450,77.2000],
["bhairon-mandir-purana-qila","Bhairon Mandir, Purana Qila","Delhi","Purana Qila, New Delhi","Lord Bhairav","std","An old Bhairav temple near Purana Qila where devotees come, especially on Sundays.",28.6100,77.2450],
["kali-bari-mandir-delhi","Kali Bari Mandir","Delhi","Mandir Marg, New Delhi","Goddess Kali","std","A Bengali Kali temple near Connaught Place. Durga Puja and Kali Puja are celebrated here.",28.6350,77.2000],
// ---- Goa
["tambdi-surla-mahadev-temple","Tambdi Surla Mahadev Temple","Goa","Tambdi Surla, Sanguem","Lord Shiva","day","A 12th century Kadamba-era stone temple in the forests of the Western Ghats, one of the oldest temples in Goa.",15.3170,74.2840],
["mahalaxmi-temple-panaji","Mahalaxmi Temple, Panaji","Goa","Panaji","Goddess Mahalaxmi","std","A well-known Mahalaxmi temple of Panaji, visited by many locals especially during Navratri.",15.4970,73.8220],
["damodar-temple-zambaulim","Shri Damodar Temple","Goa","Zambaulim, Sanguem","Lord Damodar","std","A temple on the bank of the Kushavati river, known for its annual Damodar festival.",15.1500,74.0350],
// ---- Gujarat
["shamlaji-temple","Shamlaji Temple","Gujarat","Shamlaji, Aravalli","Lord Vishnu (Shamlaji)","early","A Vishnu temple on the Meshwo river, visited by many tribal and Vaishnava devotees, especially during Kartik Purnima.",23.7070,73.3300],
["bahucharaji-temple","Bahucharaji Temple","Gujarat","Becharaji, Mehsana","Goddess Bahuchara Mata","early","A well-known Shakti temple of Gujarat, which also draws large crowds on full moon days.",23.5650,72.0960],
["swaminarayan-mandir-kalupur","Swaminarayan Mandir, Kalupur","Gujarat","Ahmedabad","Lord Swaminarayan","long","The first Swaminarayan temple, built in 1822 in Ahmedabad, with fine Burma-teak wood carving.",23.0330,72.5965],
["bet-dwarka-temple","Bet Dwarka Temple","Gujarat","Bet Dwarka, Devbhumi Dwarka","Lord Krishna","early","A temple on an island near Dwarka, reached by boat. It is believed to be where Krishna lived with his family.",22.4740,69.1060],
["bhadrakali-temple-ahmedabad","Bhadrakali Temple (Bhadra Fort)","Gujarat","Ahmedabad","Goddess Bhadrakali","std","An old Devi temple in the Bhadra area of Ahmedabad's old city, believed to be the city's presiding deity.",23.0220,72.5800],
// ---- Haryana
["brahma-sarovar-kurukshetra","Brahma Sarovar","Haryana","Kurukshetra","Lord Brahma","long","One of the largest sacred tanks in India, where pilgrims bathe, especially during the Solar Eclipse fair.",29.9660,76.8390],
["bhimeshwari-devi-temple-beri","Bhimeshwari Devi Temple","Haryana","Beri, Jhajjar","Goddess Bhimeshwari","early","A Devi temple in Beri, known for its Navratri fairs and huge crowds on Tuesdays.",28.6930,76.5740],
["kapal-mochan-tirtha","Kapal Mochan Tirtha","Haryana","Bilaspur, Yamunanagar","Lord Shiva","early","A sacred tirtha with ponds near the Shivalik foothills. A large fair is held here at Kartik Purnima.",30.0800,77.2500],
// ---- Himachal Pradesh
["bhimakali-temple-sarahan","Bhimakali Temple","Himachal Pradesh","Sarahan, Shimla","Goddess Bhimakali","early","A Shakti temple in traditional Himachali wood and stone style, in the Sarahan valley with views of the Shrikhand Mahadev peak.",31.5160,77.7940],
["tara-devi-temple-shimla","Tara Devi Temple","Himachal Pradesh","Shimla","Goddess Tara Devi","early","A hilltop Devi temple near Shimla, surrounded by forests of deodar and pine.",31.0640,77.1360],
["bijli-mahadev-temple","Bijli Mahadev Temple","Himachal Pradesh","Kullu","Lord Shiva","early","A Shiva temple on a high ridge above Kullu. Local belief says lightning strikes its lingam, which is then repaired with butter.",31.8360,77.1940],
["manikaran-shiva-temple","Manikaran Shiva Temple","Himachal Pradesh","Manikaran, Kullu","Lord Shiva","early","A sacred town in the Parvati valley with hot springs and a Shiva temple.",32.0275,77.3490],
// ---- Jammu & Kashmir
["shiv-khori-cave-temple","Shiv Khori Cave Temple","Jammu & Kashmir","Ransoo, Reasi","Lord Shiva","early","A natural cave shrine in Reasi with a Shiva lingam. The cave opens to a large number of devotees at Mahashivratri.",33.1650,74.6930],
["ranbireshwar-temple-jammu","Ranbireshwar Temple","Jammu & Kashmir","Jammu","Lord Shiva","std","A 19th century Shiva temple in Jammu city with a collection of Shiva lingams and a large hall.",32.7290,74.8590],
["peer-kho-cave-temple-jammu","Peer Kho Cave Temple","Jammu & Kashmir","Jammu","Lord Shiva","std","A Shiva cave temple on the bank of the Tawi river, one of the oldest temples of Jammu.",32.7280,74.8680],
["bahu-fort-kali-temple-jammu","Bave Wali Mata Temple (Bahu Fort)","Jammu & Kashmir","Jammu","Goddess Kali","std","A Kali temple inside Bahu Fort, which is crowded on Tuesdays and Sundays.",32.7190,74.8500],
// ---- Jharkhand
["basukinath-dham","Basukinath Dham","Jharkhand","Basukinath, Dumka","Lord Shiva","early","A Shiva temple in Dumka, visited by Kanwariyas who complete the Deoghar pilgrimage here during Shravan.",24.4790,87.2400],
["surya-mandir-bundu","Surya Mandir, Bundu","Jharkhand","Bundu, Ranchi","Surya Dev","std","A modern temple in the form of a chariot with seven horses, near Ranchi, dedicated to Surya Dev.",23.1600,85.5800],
["naulakha-mandir-deoghar","Naulakha Mandir","Jharkhand","Deoghar","Radha Krishna","std","A Radha Krishna temple near Baidyanath Dham, in traditional Bengali architecture with a tall dome.",24.4900,86.7000],
["bhadrakali-temple-itkhori","Bhadrakali Temple, Itkhori","Jharkhand","Itkhori, Chatra","Goddess Bhadrakali","std","An old temple where Hindus, Buddhists and Jains all worship, known for its ancient sculptures.",24.4300,85.1700],
// ---- Karnataka
["hoysaleswara-temple-halebidu","Hoysaleswara Temple","Karnataka","Halebidu, Hassan","Lord Shiva","day","A 12th century Hoysala temple known for its dense carvings of gods, dancers and epic scenes.",13.2120,75.9930],
["banashankari-temple-bengaluru","Banashankari Temple","Karnataka","Bengaluru","Goddess Banashankari","early","One of the most popular Devi temples in Bengaluru, with special pujas on Tuesdays and Fridays.",12.9150,77.5730],
["nanjundeshwara-temple-nanjangud","Nanjundeshwara Temple","Karnataka","Nanjangud, Mysuru","Lord Shiva (Nanjundeshwara)","early","A large Dravidian temple on the Kapila river, one of the main Shiva temples of southern Karnataka.",12.1176,76.6812],
["ranganathaswamy-temple-srirangapatna","Ranganathaswamy Temple, Srirangapatna","Karnataka","Srirangapatna, Mandya","Lord Ranganatha (Vishnu)","early","An old Vishnu temple on an island in the Kaveri river, one of the Pancharanga Kshetras of Karnataka.",12.4180,76.6930],
// ---- Kerala
["ambalappuzha-sree-krishna-temple","Ambalappuzha Sri Krishna Temple","Kerala","Ambalappuzha, Alappuzha","Lord Krishna (Parthasarathy)","early","A Krishna temple known for its sweet milk payasam offering.",9.3830,76.3690],
["vaikom-mahadeva-temple","Vaikom Mahadeva Temple","Kerala","Vaikom, Kottayam","Lord Shiva","early","One of the oldest Shiva temples of Kerala, known for its Ashtami festival and also for the Vaikom Satyagraha.",9.7480,76.3960],
["mannarasala-nagaraja-temple","Mannarasala Sree Nagaraja Temple","Kerala","Haripad, Alappuzha","Nagaraja","early","A famous snake temple in the forest, where a woman priest, the Valiyamma, performs the main rituals.",9.2630,76.4310],
["thirunelli-temple-wayanad","Thirunelli Temple","Kerala","Thirunelli, Wayanad","Lord Vishnu","early","A Vishnu temple in the Brahmagiri hills, known as the Kashi of the South for ancestral rites.",11.9140,76.0120],
["sree-vallabha-temple-thiruvalla","Sree Vallabha Temple","Kerala","Thiruvalla, Pathanamthitta","Lord Vishnu (Vallabha)","early","An old Vishnu temple known for its Kerala-style architecture and the Ekadashi festival.",9.3800,76.5720],
// ---- Madhya Pradesh
["chintaman-ganesh-temple-ujjain","Chintaman Ganesh Temple","Madhya Pradesh","Ujjain","Lord Ganesha","early","An old Ganesh temple on the bank of the Kshipra river, visited by many devotees before Mahakal darshan.",23.1710,75.7840],
["pitambara-peeth-datia","Pitambara Peeth","Madhya Pradesh","Datia","Goddess Baglamukhi","early","A Shakti temple dedicated to Maa Baglamukhi, known for its Tantric tradition.",25.6730,78.4600],
["bhojeshwar-temple-bhojpur","Bhojeshwar Temple","Madhya Pradesh","Bhojpur, Raisen","Lord Shiva","day","An unfinished 11th century Shiva temple with one of the largest Shiva lingams in India.",23.0990,77.5850],
["pashupatinath-temple-mandsaur","Pashupatinath Temple, Mandsaur","Madhya Pradesh","Mandsaur","Lord Pashupatinath","early","A Shiva temple on the Shivna river with an eight-faced Shiva statue.",24.0590,75.0590],
["lakshmana-temple-khajuraho","Lakshmana Temple, Khajuraho","Madhya Pradesh","Khajuraho","Lord Vishnu","day","A 10th century Chandela temple dedicated to Vishnu, famous for its carved panels.",24.8530,79.9270],
// ---- Maharashtra
["aundha-nagnath-temple","Aundha Nagnath Temple","Maharashtra","Aundha, Hingoli","Lord Shiva (Nagnath)","early","One of the twelve Jyotirlingas according to some traditions, an old stone temple in Hemadpanthi style.",19.5330,77.0430],
["parli-vaijnath-temple","Parli Vaijnath Temple","Maharashtra","Parli, Beed","Lord Shiva (Vaidyanath)","early","One of the Jyotirlinga temples in Maharashtra, on a hill in Parli.",18.8530,76.5380],
["mahalaxmi-temple-mumbai","Mahalaxmi Temple, Mumbai","Maharashtra","Mumbai","Goddess Mahalaxmi","long","A well-known Devi temple of Mumbai near the seaside at Breach Candy, crowded during Navratri.",18.9780,72.8090],
["saptashrungi-devi-temple","Saptashrungi Devi Temple","Maharashtra","Vani, Nashik","Goddess Saptashrungi","early","A Shakti Peetha on a hill with seven peaks, one of the three and a half Shakti Peethas of Maharashtra.",20.3750,73.9150],
["jejuri-khandoba-temple","Jejuri Khandoba Temple","Maharashtra","Jejuri, Pune","Lord Khandoba","early","A hilltop temple covered in turmeric, known as the Sonyachi Jejuri, with a very large fair at Somvati Amavasya.",18.2790,74.1590],
["gajanan-maharaj-temple-shegaon","Gajanan Maharaj Temple, Shegaon","Maharashtra","Shegaon, Buldhana","Gajanan Maharaj","long","The samadhi temple of saint Gajanan Maharaj, one of the best-managed pilgrimage sites in Maharashtra.",20.7920,76.6940],
["mumbadevi-temple-mumbai","Mumbadevi Temple","Maharashtra","Mumbai","Goddess Mumba Devi","std","The temple of the goddess from whom Mumbai takes its name, in the Bhuleshwar area.",18.9460,72.8300],
// ---- Manipur
["sanamahi-temple-imphal","Sanamahi Temple","Manipur","Imphal","Sanamahi","std","A temple of the traditional Meitei faith in Imphal, dedicated to Lainingthou Sanamahi.",24.8110,93.9380],
["pakhangba-temple-kangla","Pakhangba Temple, Kangla","Manipur","Kangla, Imphal","Pakhangba","day","A temple inside Kangla Fort, dedicated to Pakhangba, the ancestral deity of the Meitei kings.",24.8100,93.9470],
["thangjing-temple-moirang","Thangjing Temple, Moirang","Manipur","Moirang, Bishnupur","Lord Thangjing","std","A temple dedicated to the Meitei deity Thangjing, with a large festival called Lai Haraoba.",24.5000,93.7700],
// ---- Telangana
["jogulamba-temple-alampur","Jogulamba Temple, Alampur","Telangana","Alampur, Jogulamba Gadwal","Goddess Jogulamba","early","One of the eighteen Maha Shakti Peethas, on the bank of the Tungabhadra, with old Chalukya temples nearby.",15.8800,78.1330],
["keesaragutta-temple","Keesaragutta Temple","Telangana","Keesara, Medchal","Lord Shiva (Ramalingeswara)","early","A Shiva temple on a hill near Hyderabad, believed to have been established by Lord Rama.",17.5200,78.6400],
["ujjaini-mahankali-temple-secunderabad","Ujjaini Mahankali Temple","Telangana","Secunderabad","Goddess Mahankali","long","One of the best-known temples of Telangana, famous for its Bonalu festival.",17.4370,78.4980],
["wargal-saraswati-temple","Wargal Saraswati Temple","Telangana","Wargal, Siddipet","Goddess Saraswati","early","A hill temple dedicated to Saraswati, popular for Akshara Abhyasam, the first letter writing ceremony for children.",17.9060,78.7110],
["karmanghat-hanuman-temple","Karmanghat Hanuman Temple","Telangana","Karmanghat, Hyderabad","Lord Hanuman","early","An old Hanuman temple in Hyderabad, believed to be over 1000 years old, crowded on Tuesdays and Saturdays.",17.3330,78.5300],
// ---- Tripura
["kamalasagar-kali-temple","Kamalasagar Kali Temple","Tripura","Kamalasagar, Sepahijala","Goddess Kali","std","A Kali temple on the bank of the Kamalasagar lake, near the border with Bangladesh.",23.7200,91.3000],
["lakshmi-narayan-bari-agartala","Lakshmi Narayan Bari","Tripura","Agartala","Lakshmi Narayan","std","A Vishnu temple in Agartala, known for its quiet setting.",23.8350,91.2780],
// ---- West Bengal
["jagannath-temple-digha","Jagannath Temple, Digha","West Bengal","Digha, Purba Medinipur","Lord Jagannath","long","A modern temple modelled on the Puri Jagannath temple, near the Digha beach.",21.6270,87.5200],
["bakreshwar-temple","Bakreshwar Temple","West Bengal","Bakreshwar, Birbhum","Lord Shiva","early","A Shaktipeeth and Shiva temple known for its hot springs, where Sati's eyebrows are said to have fallen.",23.8800,87.3750],
["thanthania-kalibari-kolkata","Thanthania Kalibari","West Bengal","Kolkata","Goddess Kali","std","An old Kali temple in north Kolkata. Local belief says the idol here is over 300 years old.",22.5840,88.3680],
["hangseshwari-temple-bansberia","Hangseshwari Temple","West Bengal","Bansberia, Hooghly","Goddess Hangseshwari","std","A unique Kali temple in Bansberia, with 13 towers shaped like lotus buds.",22.9650,88.4110],
["bargabhima-temple-tamluk","Bargabhima Temple","West Bengal","Tamluk, Purba Medinipur","Goddess Bargabhima","std","A Shakti Peetha in Tamluk, believed to be where Sati's left ankle fell.",22.2990,87.9200],
];
const esc=(s)=>s.replace(/\\/g,"\\\\").replace(/"/g,'\\"');
const line=(t)=>{const [slug,name,state,city,deity,tm,story,lat,lng]=t; return `    { slug: "${slug}", name: "${esc(name)}", state: "${state}", city: "${esc(city)}", deity: "${esc(deity)}", timings: "${TM[tm]}", pujas: [], story: "${esc(story)}", note: "Details such as timings and aarti schedule should be confirmed locally.", lat: ${lat.toFixed(4)}, lng: ${lng.toFixed(4)} },`;};
const head = `import type { Temple } from "./temples";\n\n// Naye famous mandir. Lat/lng approximate hain, map sahi dikhaye isliye Google Maps se verify karna.\n// Timings approximate hain, official source se confirm karke badal dena.\n\nexport const moreTemples2: Temple[] = [\n`;
fs.mkdirSync("data", { recursive: true });
fs.writeFileSync("data/moreTemples2.ts", head + T.map(line).join("\n") + "\n];\n");
console.log("data/moreTemples2.ts ban gayi:", T.length, "mandir");
