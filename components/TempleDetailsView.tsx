"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import { MapPin, Clock, Flame, Navigation, ScrollText, ZoomIn, Music } from "lucide-react";
import {
    MapPin,
    Clock,
    Flame,
    Navigation,
    ScrollText,
    ZoomIn,
    Music,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Heart,
} from "lucide-react";
import type { Temple } from "@/data/temples";
import TempleStory from "@/components/TempleStory";
import TempleIcon from "@/components/TempleIcon";
import PujaList from "@/components/PujaList";
import VisitInfo from "@/components/VisitInfo";
import ImageLightbox from "@/components/ImageLightbox";
import { useLanguage } from "@/i18n/LanguageContext";
import { locName, locCity, locState, locDeity, locTimings } from "@/i18n/localize";

// ---- Bhajan & Aarti (deity ke hisaab se list) ----
type Bhajan = { title: string; kind: string };

function getBhajans(deity: string): Bhajan[] {
    const d = deity.toLowerCase();
    if (/hanuman/.test(d))
        return [
            { title: "Hanuman Chalisa", kind: "Chalisa" },
            { title: "Aarti Kije Hanuman Lala Ki", kind: "Aarti" },
            { title: "Sankat Mochan Ashtak", kind: "Stotram" },
        ];
    if (/\bram\b|sita/.test(d))
        return [
            { title: "Shri Ramchandra Kripalu Bhajman", kind: "Bhajan" },
            { title: "Aarti Shri Ramchandra Ji Ki", kind: "Aarti" },
            { title: "Ram Raksha Stotram", kind: "Stotram" },
        ];
    if (/krishna|jagannath|vitthal|guruvayur|shyam/.test(d))
        return [
            { title: "Om Jai Jagdish Hare", kind: "Aarti" },
            { title: "Aarti Kunj Bihari Ki", kind: "Aarti" },
            { title: "Achyutam Keshavam", kind: "Bhajan" },
        ];
    if (/vishnu|venkateswara|narasimha|satyanarayana|ranganatha|hayagriva/.test(d))
        return [
            { title: "Om Jai Jagdish Hare", kind: "Aarti" },
            { title: "Vishnu Sahasranama", kind: "Stotram" },
            { title: "Govinda Namavali", kind: "Bhajan" },
        ];
    if (/ganesh/.test(d))
        return [
            { title: "Jai Ganesh Deva", kind: "Aarti" },
            { title: "Sukhkarta Dukhharta", kind: "Aarti" },
            { title: "Vakratunda Mahakaya", kind: "Stotram" },
        ];
    if (/shiva|shankar|bhairav|nath|mahadev|mangesh|manjunatha|harihara/.test(d))
        return [
            { title: "Om Jai Shiv Omkara", kind: "Aarti" },
            { title: "Shiv Chalisa", kind: "Chalisa" },
            { title: "Maha Mrityunjaya Mantra", kind: "Stotram" },
        ];
    if (/durga|kali|devi|goddess|mata|amba|bhagavathy|tara|kamakhya|kalka|jwala|mansa|meenakshi|sharda/.test(d))
        return [
            { title: "Jai Ambe Gauri", kind: "Aarti" },
            { title: "Durga Chalisa", kind: "Chalisa" },
            { title: "Durga Saptashati Path", kind: "Stotram" },
        ];
    return [
        { title: "Om Jai Jagdish Hare", kind: "Aarti" },
        { title: "Shri Ganesh Vandana", kind: "Bhajan" },
    ];
}

// Har bhajan ka chhota parichay (apne shabdon me)
const ABOUT: Record<string, string> = {
    "Hanuman Chalisa": "A 40-verse devotional hymn in praise of Lord Hanuman, composed by the poet-saint Tulsidas. Devotees recite it on Tuesdays and Saturdays for courage and protection.",
    "Aarti Kije Hanuman Lala Ki": "The traditional aarti sung to Lord Hanuman at the end of puja, while the lamp is waved before the deity.",
    "Sankat Mochan Ashtak": "An eight-verse prayer asking Lord Hanuman to remove troubles and hardships, popularly attributed to Tulsidas.",
    "Shri Ramchandra Kripalu Bhajman": "A well-known devotional hymn in praise of Lord Ram, attributed to Tulsidas.",
    "Aarti Shri Ramchandra Ji Ki": "The traditional aarti sung to Lord Ram at the end of worship.",
    "Ram Raksha Stotram": "A Sanskrit prayer seeking the protection of Lord Ram, traditionally attributed to the sage Budha Kaushika.",
    "Om Jai Jagdish Hare": "One of the most popular aartis in India, sung to Lord Vishnu (Jagdish) at the end of puja in homes and temples.",
    "Aarti Kunj Bihari Ki": "A traditional aarti dedicated to Lord Krishna as Kunj Bihari, sung in Krishna temples, especially around Mathura and Vrindavan.",
    "Achyutam Keshavam": "A Sanskrit bhajan that sings the names of Krishna and Ram, commonly heard in kirtans.",
    "Vishnu Sahasranama": "A hymn of the 1,000 names of Lord Vishnu, found in the Mahabharata and recited by devotees across India.",
    "Govinda Namavali": "A chant of the names of Govinda (Vishnu), widely sung in Venkateswara and Vaishnava worship.",
    "Jai Ganesh Deva": "The traditional aarti of Lord Ganesha, sung at the start of puja and during Ganesh Chaturthi.",
    "Sukhkarta Dukhharta": "A Marathi aarti to Lord Ganesha, attributed to Samarth Ramdas and hugely popular in Maharashtra.",
    "Vakratunda Mahakaya": "A short Sanskrit shloka invoking Lord Ganesha to remove obstacles from any new undertaking.",
    "Shri Ganesh Vandana": "A prayer to Lord Ganesha, offered at the beginning of any worship or new task.",
    "Om Jai Shiv Omkara": "The best-known aarti of Lord Shiva, sung at the end of Shiva puja.",
    "Shiv Chalisa": "A devotional hymn in praise of Lord Shiva, commonly recited on Mondays and during Mahashivratri.",
    "Maha Mrityunjaya Mantra": "An ancient Vedic mantra from the Rigveda dedicated to Shiva, chanted for health, protection and long life.",
    "Jai Ambe Gauri": "The traditional aarti of Goddess Durga (Ambe), sung during Navratri and at the end of Devi puja.",
    "Durga Chalisa": "A devotional chalisa in praise of Goddess Durga, recited especially during Navratri.",
    "Durga Saptashati Path": "A text of about 700 verses from the Markandeya Purana praising the Goddess, recited during Navratri.",
};

// Lyrics yahan paste karo (backtick ke andar). Naam bilkul upar wale jaisa hona chahiye.
// Khaali chhodoge to sirf parichay dikhega.
const LYRICS: Record<string, string> = {
    "Hanuman Chalisa": `
   || Doha ||

Shri Guru Charan Saroj Raj, Nij Man Mukur Sudhari.
Barnau Raghubar Bimal Jasu, Jo Dayaku Phal Chari.

Buddhiheen Tanu Jaanike, Sumirau Pavan-Kumar.
Bal Buddhi Vidya Dehu Mohin, Harahu Kalesh Vikar.

||Chaupai||
1. Jai Hanuman Gyan Gun Sagar.
   Jai Kapis Tihun Lok Ujagar.

2. Ram Doot Atulit Bal Dhama.
   Anjani-Putra Pavansut Nama.

3. Mahabir Bikram Bajrangi.
   Kumati Nivar Sumati Ke Sangi.

4. Kanchan Baran Biraj Subesa.
   Kanan Kundal Kunchit Kesa.

5. Hath Bajra Au Dhwaja Birajai.
   Kandhe Moonj Janeu Sajai.

6. Shankar Suvan Kesari Nandan.
   Tej Pratap Maha Jag Vandan.

7. Vidyavan Guni Ati Chatur.
   Ram Kaj Karibe Ko Aatur.

8. Prabhu Charitra Sunibe Ko Rasiya.
   Ram Lakhan Sita Man Basiya.

9. Sukshma Roop Dhari Siyahin Dikhawa.
   Bikat Roop Dhari Lanka Jarawa.

10. Bhim Roop Dhari Asur Sanhare.
    Ramchandra Ke Kaj Sanware.

11. Lay Sajivan Lakhan Jiyaye.
    Shri Raghubir Harashi Ur Laye.

12. Raghupati Kinhin Bahut Badai.
    Tum Mam Priya Bharatahi Sam Bhai.

13. Sahas Badan Tumharo Jas Gaven.
    Asa Kahi Shripati Kanth Lagaven.

14. Sanakadik Brahmadi Munisa.
    Narad Sarad Sahit Ahisa.

15. Jam Kuber Digpal Jahan Te.
    Kavi Kovid Kahi Sake Kahan Te.

16. Tum Upkar Sugrivahin Kinha.
    Ram Milay Raj Pad Dinha.

17. Tumharo Mantra Vibhishan Mana.
    Lankeshwar Bhaye Sab Jag Jana.

18. Jug Sahastra Jojan Par Bhanu.
    Lilyo Tahi Madhur Phal Janu.

19. Prabhu Mudrika Meli Mukh Mahin.
    Jaladhi Langhi Gaye Acharaj Nahin.

20. Durgam Kaj Jagat Ke Jete.
    Sugam Anugrah Tumhare Tete.

21. Ram Duware Tum Rakhvare.
    Hot Na Aagya Binu Paisare.

22. Sab Sukh Lahai Tumhari Sarna.
    Tum Rakshak Kahu Ko Darna.

23. Aapan Tej Samharo Aapai.
    Teenon Lok Hank Te Kanpai.

24. Bhoot Pishach Nikat Nahin Aavai.
    Mahavir Jab Naam Sunavai.

25. Nasai Rog Harai Sab Peera.
    Japat Nirantar Hanumat Beera.

26. Sankat Te Hanuman Chhudavai.
    Man Kram Vachan Dhyan Jo Lavai.

27. Sab Par Ram Tapasvi Raja.
    Tin Ke Kaj Sakal Tum Saja.

28. Aur Manorath Jo Koi Lavai.
    Soi Amit Jeevan Phal Pavai.

29. Charon Jug Partap Tumhara.
    Hai Parsiddh Jagat Ujiyara.

30. Sadhu Sant Ke Tum Rakhvare.
    Asur Nikandan Ram Dulare.

31. Ashta Siddhi Nau Nidhi Ke Data.
    Asa Bar Din Janki Mata.

32. Ram Rasayan Tumhare Pasa.
    Sada Raho Raghupati Ke Dasa.

33. Tumhare Bhajan Ram Ko Pavai.
    Janam Janam Ke Dukh Bisravai.

34. Ant Kaal Raghubar Pur Jai.
    Jahan Janma Hari-Bhakt Kahai.

35. Aur Devta Chitt Na Dharai.
    Hanumat Sei Sarv Sukh Karai.

36. Sankat Katai Mitai Sab Peera.
    Jo Sumirai Hanumat Balbeera.

37. Jai Jai Jai Hanuman Gosain.
    Kripa Karahu Gurudev Ki Nain.

38. Jo Sat Bar Path Kar Koi.
    Chhutahi Bandi Maha Sukh Hoi.

39. Jo Yah Padhe Hanuman Chalisa.
    Hoye Siddhi Sakhi Gaurisa.

40. Tulsidas Sada Hari Chera.
    Keejai Nath Hriday Mah Dera.
    || Doha ||
    Pavantanaya Sankat Haran, Mangal Murati Roop.
Ram Lakhan Sita Sahit, Hriday Basahu Sur Bhoop.

`,
    "Aarti Kije Hanuman Lala Ki": `
    Aarti Kije Hanuman Lala Ki.
Dusht Dalan Raghunath Kala Ki.

Jaake Bal Se Girivar Kaampe.
Rog Dosh Jaake Nikat Na Jhaanke.

Anjani Putra Maha Baldayi.
Santan Ke Prabhu Sada Sahai.

De Beera Raghunath Pathaye.
Lanka Jari Siya Sudhi Laye.

Lanka So Kot Samudra Si Khai.
Jaat Pavansut Baar Na Lai.

Lanka Jari Asur Sanhare.
Siyaram Ji Ke Kaaj Sanware.

Lakshman Murchhit Pade Sakaare.
Aani Sanjeevan Pran Ubare.

Paithi Patal Tori Jamkaare.
Ahiravan Ki Bhuja Ukhaade.

Baayi Bhuja Asur Dal Maare.
Daahine Bhuja Santjan Taare.

Sur Nar Muni Aarti Utaare.
Jai Jai Jai Hanuman Uchaare.

Kanchan Thaal Kapoor Lau Chhai.
Aarti Karat Anjana Mai.

Lanka Vidhwans Keen Raghurai.
Tulsidas Prabhu Kirti Gai.
`,
    "Sankat Mochan Ashtak": `

Baal Samay Ravi Bhakshi Liyo Tab,
Teenhun Lok Bhayo Andhiyaro.
Tahi Son Traas Bhayo Jag Ko,
Yah Sankat Kahu Son Jaat Na Taaro.
Devan Aani Kari Binti Tab,
Chhaadi Diyo Ravi Kasht Nivaaro.
Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.

Baali Ki Traas Kapees Basain Giri,
Jaat Mahaprabhu Panth Nihaaro.
Chaunki Mahamuni Shaap Diyo Tab,
Chahiye Kaun Bichaar Bichaaro.
Kai Dwij Roop Livay Mahaprabhu,
So Tum Daas Ke Shok Nivaaro.
Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.

Angad Ke Sang Len Gaye Siya,
Khoj Kapees Yah Bain Uchaaaro.
Jeevat Na Bachihau Hum So Ju,
Bina Sudhi Laaye Ihaan Pagu Dhaaro.
Heri Thake Tat Sindhu Sabai Tab,
Laay Siya-Sudhi Praan Ubaaro.
Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.

Ravan Traas Dai Siya Ko Sab,
Rakshasi Son Kahi Shok Nivaaro.
Tahi Samay Hanuman Mahaprabhu,
Jaay Maha Rajnicher Maaro.
Chahat Siya Ashok Son Aagi Su,
Dai Prabhu Mudrika Shok Nivaaro.
Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.

Baan Lagyo Ur Lachhman Ke Tab,
Praan Taje Sut Ravan Maaro.
Lai Grih Baidya Sushen Samet,
Tabai Giri Dron Su Beer Uparo.
Aani Sajeevan Haath Dai Tab,
Lachhman Ke Tum Praan Ubaaro.
Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.

Ravan Judh Ajaan Kiyo Tab,
Naag Ki Faans Sabai Sir Daaro.
Shri Raghunath Samet Sabai Dal,
Moh Bhayo Yah Sankat Bhaaro.
Aani Khages Tabai Hanuman Ju,
Bandhan Kaati Sutraas Nivaaro.
Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.

Bandhu Samet Jabai Ahiravan,
Lai Raghunath Pataal Sidhaaro.
Debihin Pooji Bhali Vidhi Son Bali,
Deu Sabai Mili Mantra Vichaaro.
Jaay Sahaay Bhayo Tab Hi,
Ahiravan Sainya Samet Sanhaaro.
Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.

Kaaj Kiye Bad Devan Ke Tum,
Veer Mahaprabhu Dekhi Bichaaro.
Kaun So Sankat Mor Gareeb Ko,
Jo Tumse Nahin Jaat Hai Taaro.
Begi Haro Hanuman Mahaprabhu,
Jo Kachhu Sankat Hoy Hamaro.
Ko Nahin Jaanat Hai Jag Mein Kapi,
Sankat Mochan Naam Tiharo.

॥ Doha ॥

Laal Deh Laali Lase,
Aru Dhari Laal Langoor.
Vajra Deh Danav Dalan,
Jai Jai Jai Kapi Soor.
`,
    "Shri Ramchandra Kripalu Bhajman": `
  
Haran Bhav Bhay Darunam.
Nav Kanj Lochan, Kanj Mukh,
Kar Kanj Pad Kanjarunam.

Kandarp Aganit Amit Chhavi,
Navneel Neerad Sundaram.
Pat Peet Manahu Tadit Ruchi,
Shuchi Naumi Janak Sutavaram.

Bhaju Deenbandhu Dinesh Danav,
Daitya Vansh Nikandanam.
Raghunand Anand Kand,
Kaushalchand Dashrath Nandanam.

Sir Mukut Kundal Tilak,
Charu Udaar Ang Vibhushanam.
Aajaanu Bhuj Shar Chaap Dhar,
Sangramjit Khar Dushanam.

Iti Vadati Tulsidas,
Shankar Shesh Muni Man Ranjanam.
Mam Hriday Kanj Nivas Kuru,
Kamaadi Khaldal Ganjanam.
`,
    "Aarti Shri Ramchandra Ji Ki":
        `Aarti Shri Ramchandra Ji Ki,
Keerati Kalit Lalit Siya Pi Ki.

Gaavat Brahmadik Muni Narad,
Balmiki Vigyan Visharad.
Shuk Sanakadik Shesh Aru Sharad,
Barani Pawansut Keerati Neeki.

Aarti Shri Ramchandra Ji Ki.

Rahat So Awadh Mein Ruchir Bhavan Mein,
Aasan Par Hari Chapal Charan Mein.
Karat Kripa Bahu Roop Dharan Mein,
Sur Nar Muni Sab Hot Sukhi Ki.

Aarti Shri Ramchandra Ji Ki.

Rajat Janakpur Dham Mein,
Awadhpuri Mein Siya Ram Ji.
Bhaktan Ke Man Mandir Mein,
Basat Sada Sukh Dham Ji.

Aarti Shri Ramchandra Ji Ki.`,
    "Ram Raksha Stotram": `SHRI RAM RAKSHA STOTRAM

Asya Shri Ram Raksha Stotra Mantrasya,
Budha Kaushika Rishih,
Shri Sita Ramachandro Devata,
Anushtup Chhandah,
Sita Shaktih,
Shrimad Hanuman Keelakam,
Shri Ramachandra Preetyarthe
Ram Raksha Stotra Jape Viniyogah.

DHYANAM

Dhyayed Ajanubahum Dhrita Sharadhanusham Baddha Padmasanastham,
Peetam Vaso Vasanam Navakamaladala Spardhi Netram Prasannam.
Vamankaarudha Sita Mukha Kamala Milal Lochanam Neeradaabham,
Nana Alankara Deeptam Dadhatam Uru Jata Mandanam Ramachandram.

Charitam Raghunathasya Shatakoti Pravistaram,
Ekaikam Aksharam Pumsam Mahapataka Nashanam.

Dhyatva Neelotpal Shyamam Ramam Rajeeva Lochanam,
Janaki Lakshmanopetam Jata Mukuta Manditam.

Sasi Toona Dhanur Bana Paanim Naktanchara Antakam,
Swa Leelaya Jagat Tratam Aavirbhootam Ajam Vibhum.

Ram Raksham Pathet Prajnah Paapaghnim Sarva Kamadam,
Shiro Me Raghavah Patu Bhalam Dasharathatmajah.

Kausalyeyo Drishau Patu Vishwamitra Priyah Shruti,
Ghraaṇam Patu Makhatrata Mukham Saumitrivatsalah.

Jihvam Vidyanidhih Patu Kantham Bharatavanditah,
Skandhau Divyayudhah Patu Bhujau Bhagnesha Karmukah.

Karau Sitapatih Patu Hridayam Jamadagnya Jit,
Madhyam Patu Kharadhwamsi Nabhim Jambavadashrayah.

Sugreeveshah Kati Patu Sakthini Hanumat Prabhuh,
Ooru Raghuttamah Patu Rakshah Kula Vinashakrit.

Januni Setukrit Patu Janghe Dashamukhantakah,
Paadau Bibheeshana Shreedah Patu Ramo Akhilam Vapuh.

Etam Ramabalopetam Raksham Yah Sukriti Pathet,
Sa Chirayuh Sukhi Putri Vijayi Vinayi Bhavet.

Patalabhutala Vyoma Charinash Chhadma Charinah,
Na Drashtumapi Shaktaste Rakshitam Rama Namabhih.

Rameti Ramabhadreti Ramachandreti Va Smaran,
Naro Na Lipyate Papair Bhuktim Muktim Cha Vindati.

Jagajjaitraika Mantreṇa Rama Namnabhirakshitam,
Yah Kanthe Dharayet Tasya Karasthah Sarva Siddhayah.

Vajrapanjara Namedam Yo Ramakavacham Smaret,
Avyahatagnyah Sarvatra Labhate Jaya Mangalam.

Adishtavan Yatha Swapne Rama Raksham Imam Harah,
Tatha Likhitavan Pratah Prabuddho Budha Kaushikah.

Aramah Kalpavrikshanam Viramah Sakalapadam,
Abhiramas Trilokanam Ramah Shrimaan Sa Nah Prabhuh.

Tarunau Roopa Sampannau Sukumarau Mahabalau,
Pundareeka Vishalakshau Cheerakrishnajina Ambarau.

Phalamoolashinau Dantau Tapasau Brahmacharinau,
Putrau Dasharathasyaitau Bhratarau Rama Lakshmanau.

Sharanyau Sarva Sattvanam Shreshthau Sarva Dhanushmatam,
Rakshah Kula Nihantaarau Trayetam No Raghuttamau.

Aatta Sajj Dhanushavishu Sprisha Vakshaya Shuga Nishanginau,
Rakshanaya Mama Ramalakshmanav Agratah Pathi Sadaiva Gachchhatam.

Sannaddhah Kavachi Khadgi Chaapabaanadharo Yuva,
Gachchhan Manoratho Asmakam Ramah Patu Sa Lakshmanah.

Ramo Dasharathih Shuro Lakshman Anucharo Bali,
Kakutsthah Purushah Purnah Kausalyeyo Raghuttamah.

Vedanta Vedyo Yagneshah Puranapurushottamah,
Janaki Vallabhah Shrimaan Aprameya Parakramah.

Ityetani Japennityam Madbhaktah Shraddhayanvitah,
Ashwamedhadhikam Punyam Samprapnoti Na Sanshayah.

Ramam Doorvadal Shyamam Padmaksham Peetavasasam,
Stuvanti Namabhir Divyair Na Te Sansarino Narah.

Ramam Lakshmana Poorvajam Raghuvaram Sitapatim Sundaram,
Kakutstham Karunarnavam Gunanidhim Viprapriyam Dharmikam.

Rajendram Satyasandham Dasharathatanayam Shyamalam Shantamurtim,
Vande Lokabhiramam Raghukulatilakam Raghavam Ravanarim.

Ramaya Ramabhadraya Ramachandraya Vedhase,
Raghunathaya Nathaya Sitayah Pataye Namah.

Shri Rama Rama Raghunandana Rama Rama,
Shri Rama Rama Bharataagraja Rama Rama,
Shri Rama Rama Ranakarkasha Rama Rama,
Shri Rama Rama Sharanam Bhava Rama Rama.

Shri Ramachandra Charanau Manasa Smarami,
Shri Ramachandra Charanau Vachasa Grinami,
Shri Ramachandra Charanau Shirasa Namami,
Shri Ramachandra Charanau Sharanam Prapadye.

Mata Ramo Matpita Ramachandrah,
Swami Ramo Matsakha Ramachandrah,
Sarvasvam Me Ramachandro Dayaluh,
Nanyam Jane Naiva Jane Na Jane.

Dakshine Lakshmano Yasya Vame Cha Janakatmaja,
Purato Marutir Yasya Tam Vande Raghunandanam.

Lokabhiramam Ranaranagadhiram,
Rajeevanetram Raghuvamshanatham,
Karunyarupam Karunakar am Tam,
Shri Ramachandram Sharanam Prapadye.

Manojavam Marutatulyavegam,
Jitendriyam Buddhimatam Varishtham,
Vatatmajam Vanarayuthamukhyam,
Shri Ramadootam Sharanam Prapadye.

Koojan tam Rama Rameti Madhuram Madhuraksharam,
Aaruhya Kavitashakham Vande Valmiki Kokilam.

Aapadam Apahartaram Dataram Sarvasampadam,
Lokabhiramam Shri Ramam Bhuyo Bhuyo Namamyaham.

Bharjanam Bhava Beejanam Arjanam Sukha Sampadam,
Tarjanam Yamadootanam Rama Rameti Garjanam.

Ramo Rajamanih Sada Vijayate Ramam Ramesham Bhaje,
Ramenabhihata Nishachara Chamu Ramaya Tasmai Namah.
Ramannasti Parayanam Parataram Ramasya Daso Asmyaham,
Rame Chittalayah Sada Bhavatu Me Bho Rama Mamuddhara.

Rama Rameti Rameti Rame Rame Manorame,
Sahasranama Tattulyam Ramanama Varanane.

Iti Shri Budha Kaushika Virachitam
Shri Ram Raksha Stotram Sampoornam.`,

    "Om Jai Jagdish Hare": `
Om jai jagdish hare
Swami jai jagdish hare

Bhakt jano ke sankat
Daas jano ke sankat

Kshan mein door kare
Om jai jagdish hare

Jo dhyaave phal paave
Dukh bin se mann ka

Swami dukh bin se mann ka
Sukh sampati ghar aave

Sukh sampati ghar aave
Kasht mite tan ka

Om jai jagdish hare
Maat pitaah tum mere

Sharan kohon kiski
Swami Sharan kohon kiski

Tum bin aur na duja
Prabhu bin aur na duja

Aas karoon main kiski
Om jai jagdish hare

Tum puran parmatma
Tum antariyaami

Swami tum antariyaami
Par brahm parmeshvar

Par brahm parmeshvar
Tum sabke swami

Om jai jagdish hare
Tum karuna ke saagar

Tum paalan karta
Swami tum paalan karta

Main moorakh khalkaami
Kaise vak tum swami

Kripa karo bharta
Om jai jagdish hare

Tum ho ek agochar
sab ke praan pathi

Swami sab ke praan pathi
Kis vidu miloon daya maya

Kis vidhi miloon Dayamay
Tum ko main kumati

Om jai Jagdish hare
Deen bandhu dukh harta

Thakur tum mere
Swami thakur tum mere

Apne haath uthao
Dwaar paethaa tere

Om jai Jagdish hare
Vishay vikaar mitaavo

Paap haro Devaa
Swaami paap haro Deva

Shradhaa bhakti badaavo
Shradhaa bhakti badaavo

Santan ki sevaa
Om jai Jagdish hare

Tan man dhan
Sab kuch hai tera

sab kuch hai tera
Swami sab kuch hai tera

Tera tujh ko arpan
Tera tujh ko arpan

Kya laage mera
Om Jai Jagdish Hare `,

    "Aarti Kunj Bihari Ki": `Aarti Kunj Bihari Ki,
Shri Girdhar Krishna Murari Ki ॥
Aarti Kunj Bihari Ki,
Shri Girdhar Krishna Murari Ki ॥

Gale Mein Baijanti Mala, Bajave Murali Madhur Bala । Shravan Mein Kundal Jhalakala,
Nand Ke Anand Nandlala । Gagan Sam Ang Kanti Kali, Radhika Chamak Rahi Aali ।
Latan Mein Thadhe Banamali Bhramar Si Alak, Kasturi Tilak, Chandra Si Jhalak,
Lalit Chavi Shyama Pyari Ki, Shri Girdhar Krishna Murari Ki ॥
॥ Aarti Kunj Bihari Ki...॥

Kanakmay Mor Mukut Bilse, Devata Darsan Ko Tarse । Gagan So Suman Raasi Barse
Baje Murchang, Madhur Mridang, Gwaalin Sang Atual Rati Gop Kumari Ki,
Shri Girdhar Krishna Murari Ki ॥
॥ Aarti Kunj Bihari Ki...॥

Jahaan Te Pragat Bhayi Ganga, Sakal Man Haarini Shri Ganga । Smaran Te Hot Moh Bhanga
Basi Shiv Shish, Jataa Ke Beech, Harei Agh Keech, Charan Chhavi Shri Banvaari Ki,
Shri Girdhar Krishna Murari Ki ॥
॥ Aarti Kunj Bihari Ki...॥

Chamakati Ujjawal Tat Renu, Baj Rahi Vrindavan Benu। Chahu Disi Gopi Gwaal Dhenu
Hansat Mridu Mand, Chandani Chandra, Katat Bhav Phand, Ter Sun Deen Dukhari Ki,
Shri Girdhar Krishna Murari Ki ॥
॥ Aarti Kunj Bihari Ki...॥

Aarti Kunj Bihari Ki,
Shri Girdhar Krishna Murari Ki ॥
Aarti Kunj Bihari Ki,
Shri Girdhar Krishna Murari Ki ॥`,

    "Achyutam Keshavam": `॥ Shri Achyutashtakam ॥

Achyutam Keshavam Rama Narayanam
Krishna Damodaram Vasudevam Harim
Shridharam Madhavam Gopika Vallabham
Janaki Nayakam Ramachandram Bhaje ॥1॥

Achyutam Keshavam Satyabhamadhavam
Madhavam Shridharam Radhikaradhitam
Indira Mandiram Chetasa Sundaram
Devaki Nandanam Nandajam Sandadhe ॥2॥

Vishnave Jishnave Shankhine Chakrine
Rukmini Ragine Janaki Janaye
Vallavi Vallabhayarchitayatmane
Kamsa Vidhwamsine Vamshine Te Namah ॥3॥

Krishna Govinda He Rama Narayana
Shripate Vasudevajita Shrinidhe
Achyutananta He Madhavadhokshaja
Dwarakanayaka Draupadi Rakshaka ॥4॥

Rakshasa Kshobhitah Sitaya Shobhito
Dandakaranya Bhupunyata Karanah
Lakshmanenanvito Vanaraih Sevitah
Agastya Sampujito Raghavah Patu Mam ॥5॥

Dhenukaristakanishtakrid Dveshiha
Keshiha Kamsahrid Vamshikavadakah
Putana Kopakah Suraja Khelano
Balagopalakah Patu Mam Sarvada ॥6॥

Vidyududyotavat Prasphurad Vasasam
Pravridambhodavat Prollasat Vigraham
Vanyaya Malaya Shobhitorahsthalam
Lohitanghri Dvayam Varijaksham Bhaje ॥7॥

Kunchitaih Kuntalair Bhrajamananam
Ratna Maulim Lasat Kundalam Gandayoh
Hara Keyurakam Kankanaprojjvalam
Kinkini Manjulam Shyamalam Tam Bhaje ॥8॥

Achyutasya Ashtakam Yah Pathed Ishtadam
Prematah Pratyaham Purushah Saspraham
Vrittatah Sundaram Kartur Vishwambharah
Tasya Vashyo Harir Jayate Satvaram ॥9॥`,
    "Vishnu Sahasranama": `॥ Om Shri Paramatmane Namah ॥

Narayanam Namaskritya Naram Chaiva Narottamam।
Devim Saraswatim Vyasam Tato Jayam Udirayet॥

॥ Atha Shri Vishnu Sahasranama Stotram ॥

Shuklambaradharam Vishnum Shashivarnam Chaturbhujam।
Prasannavadanam Dhyayet Sarvavighnopashantaye॥1॥

Yasya Dviradavaktradyah Parishadyah Parah Shatam।
Vighnam Nighnanti Satatam Vishvaksenam Tamashraye॥2॥

Vyasam Vasishtanaptaram Shakteh Pautram Akalmasham।
Parasharatmajam Vande Shukatatam Taponidhim॥3॥

Vyasaya Vishnuroopaya Vyasa Roopaya Vishnave।
Namo Vai Brahmanidhaye Vasishthaya Namo Namah॥4॥

Avikaraya Shuddhaya Nityaya Paramatmane।
Sadaika Rooparoopaya Vishnave Sarvajishnave॥5॥

Yasya Smaranamatrena Janmasamsarabandhanat।
Vimuchyate Namastasmai Vishnave Prabhavishnave॥6॥

Om Namo Vishnave Prabhavishnave॥

॥ Dhyanam ॥

Kshirodanvatpradeshe Shuchimanivilasatsaikate Mauktikanam
Malakluptasanasthah Sphatikamaninibhairmauktikairmanditangah।
Shubhrairabhrairadabhrairuparivirachitairmuktapiyooshavarshaih
Anandi Nah Puniyadarinanalinagadashankhapanirmukundah॥

Bhooh Padau Yasya Nabhirviyadasuranilashchandrasuryau Cha Netre
Karnavashah Shiro Dyaurmukhamapi Dahanah Yasya Vasteyamabdhih।
Antahstham Yasya Vishvam Suranarakhagagobhogigandharvadaityaih
Chitram Ramyate Tam Tribhuvanavapum Vishnum Isham Namami॥

Om Namo Bhagavate Vasudevaya॥

Shantakaram Bhujagashayanam Padmanabham Suresham
Vishvadharam Gaganasadrisham Meghavarnam Shubhangam।
Lakshmikantam Kamalanayanam Yogibhirdhyanagamyam
Vande Vishnum Bhavabhayaharam Sarvalokaikanatham॥

Meghashyamam Pitakausheyavasam
Shrivatsankam Kaustubhodbhasitangam।
Punyopetam Pundarikayataksham
Vishnum Vande Sarvalokaikanatham॥

Namah Samastabhutanam Adibhutaya BhooBhrte।
Aneka Rooparoopaya Vishnave Prabhavishnave॥ 

Harihi Om॥

Om Vishvam Vishnurvashatkaro Bhootabhavyabhavatprabhuh।
Bhootakrid Bhootabhrit Bhavo Bhootatma Bhootabhavanah॥1॥

Pootatma Paramatma Cha Muktanam Parama Gatih।
Avyayah Purushah Sakshi Kshetragnyokshara Eva Cha॥2॥

Yogo Yogavidam Neta Pradhanapurusheshvarah।
Narasimhavapuh Shriman Keshavah Purushottamah॥3॥

Sarvah Sharvah Shivah Sthanurbhootadirnidhiravyayah।
Sambhavo Bhavano Bharta Prabhavah Prabhureeshvarah॥4॥

Svayambhooh Shambhuradityah Pushkaraksho Mahasvanah।
Anadinidhano Dhata Vidhata Dhaturuttamah॥5॥

Aprameyo Hrishikesho Padmanabho'maraprabhu।
Vishvakarma Manustvashta Sthavishthah Sthaviro Dhruvah॥6॥

Agrahyah Shashvatah Krishno Lohitakshah Pratardanah।
Prabhootastrikakubdhama Pavitram Mangalam Param॥7॥

Ishanah Pranadah Prano Jyeshthah Shreshthah Prajapatih।
Hiranyagarbho Bhoogarbho Madhavo Madhusoodanah॥8॥

Ishvaro Vikrami Dhanvi Medhavi Vikramah Kramah।
Anuttamo Duradharshah Kritagnyah Kritiratmavan॥9॥

Sureshah Sharanam Sharma Vishvaretah Prajabhavah।
Ahah Samvatsaro Vyalah Pratyayah Sarvadarshanah॥10॥

Ajah Sarveshvarah Siddhah Siddhih Sarvadirachyutah।
Vrishakapirameyatma Sarvayogavinihsritah॥11॥

Vasurvasumana Satyah Samatma Sammitah Samah।
Amoghah Pundarikaksho Vrishakarma Vrishakritih॥12॥

Rudro Bahushira Babhruh Vishvayonih Shuchishravah।
Amritah Shashvatasthanurvararoho Mahatapah॥13॥

Sarvagah Sarvavidbhanurvishvakseno Janardanah।
Vedo Vedavidavyango Vedango Vedavit Kavih॥14॥

Lokadhyakshah Suradhyaksho Dharmadhyakshah Kritakritah।
Chaturatma Chaturvyuhashchaturdamshtrashchaturbhujah॥15॥

Bhrajishnur Bhojanam Bhokta Sahishnur Jagadadijah।
Anagho Vijayo Jeta Vishvayonih Punarvasuh॥16॥

Upendro Vamanah Pramshuramoghah Shuchiroorjitah।
Atindrah Sangrahah Sargo Dhritatma Niyamo Yamah॥17॥

Vedyo Vaidyah Sadayogi Veeraha Madhavo Madhuh।
Atindriyo Mahamayo Mahotsaho Mahabalah॥18॥

Mahabuddhirmahaveeryo Mahashaktirmahadyutih।
Anirdeshyavapuh Shriman Ameyatma Mahadridhrik॥19॥

Maheshvaso Maheebharta Shrinivasah Satam Gatih।
Aniruddhah Suranando Govindo Govidam Patih॥20॥

Marichir Damano Hamsah Suparno Bhujagottamah।
Hiranyanabhah Sutapah Padmanabhah Prajapatih॥21॥

Amrityuh Sarvadrik Simhah Sandhata Sandhiman Sthirah।
Ajo Durmarshanah Shasta Vishrutatma Surariha॥22॥

Gururgurutamo Dhamah Satyah Satyaparakramah।
Nimishonimishah Sragvi Vachaspatiudaradhih॥23॥

Agraneergramanih Shriman Nyayo Neta Sameeranah।
Sahasramurdha Vishvatma Sahasrakshah Sahasrapat॥24॥

Avartano Nivrittatma Samvritah Sampramardanah।
Ahah Samvartako Vahnir Anilo Dharanidharah॥25॥

Suprasadah Prasannatma Vishvadhrig Vishvabhug Vibhuh।
Satkarta Satkritah Sadhur Jahnur Narayano Narah॥26॥

Asankhyeyo'prameyatma Vishishtah Shishtakrich Chuchih।
Siddharthah Siddhasankalpah Siddhidah Siddhisadhanah॥27॥

Vrishahi Vrishabho Vishnur Vrishaparva Vrishodarah।
Vardhano Vardhamanashcha Viviktah Shrutisagarah॥28॥

Subhujo Durdharo Vagmi Mahendro Vasudo Vasuh।
Naikarupo Brihadroopah Shipivishtah Prakashanah॥29॥

Ojas Tejo Dyutidharah Prakashatma Pratapanah।
Riddhah Spashtaksharo Mantrash Chandramshur Bhaskaradyutih॥30॥

Amritamshoodbhavo Bhanuh Shashabinduh Sureshvarah।
Aushadham Jagatah Setuh Satyadharmaparakramah॥31॥

Bhootabhavyabhavannathah Pavanah Pavano'nalah।
Kamaha Kamakrit Kantah Kamah Kamapradah Prabhuh॥32॥

Yugadikrid Yugavarto Naikamayo Mahashanah।
Adrisyo Vyakta Roopashcha Sahasrajid Anantajit॥33॥

Ishto'vishishtah Shishteshtah Shikhandi Nahusho Vrishah।
Krodhaha Krodhakrit Karta Vishvabahur Mahidharah॥34॥

Achyutah Prathitah Pranah Pranado Vasavanujah।
Apam Nidhir Adhishthanam Apramattah Pratishthitah॥35॥

Skandah Skandadharo Dhuryo Varado Vayuvahanah।
Vasudevo Brihadbhanur Adidevah Purandarah॥36॥

Ashokas Taranas Tarah Shoorah Shaurir Janeshvarah।
Anukoolah Shatavartah Padmi Padmanibhekshanah॥37॥

Padmanabho'ravindakshah Padmagarbhah Sharirabhrit।
Maharddhir Riddho Vriddhatma Mahaksho Garudadhvajah॥38॥

Atulah Sharabho Bhimah Samayagnyo Havirharih।
Sarvalakshanalakshanyo Lakshmivan Samitinjayah॥39॥

Viksharo Rohito Margo Hetur Damodarah Sahah।
Mahidharo Mahabhago Vegavan Amitashanah॥40॥

Udbhavah Kshobhano Devah Shrigarbhah Parameshvarah।
Karanam Karanam Karta Vikarta Gahano Guhah॥41॥

Vyavasayo Vyavasthanah Samsthanah Sthanado Dhruvah।
Pararddhih Paramaspashtas Tushtah Pushtah Shubhekshanah॥42॥

Ramo Viramo Virajo Margo Neyo Nayo'nayah।
Veerah Shaktimatam Shreshtho Dharmo Dharmaviduttamah॥43॥

Vaikunthah Purushah Pranah Pranadah Pranavah Prithuh।
Hiranyagarbhah Shatrughno Vyapto Vayur Adhokshajah॥44॥

Rituh Sudarshanah Kalah Parameshthi Parigrahah।
Ugrah Samvatsaro Daksho Vishramo Vishvadakshinah॥45॥

Vistarah Sthavarasthanuh Pramanam Beejamavyayam।
Artho'nartho Mahakosho Mahabhogo Mahadhanah॥46॥

Anirvinnah Sthavistho'bhoor Dharma Yupo Mahamakhah।
Nakshatranemir Nakshatri Kshamah Kshamah Sameehanah॥47॥

Yajna Ijyo Mahejyashcha Kratuh Satram Satam Gatih।
Sarvadarshi Vimuktatma Sarvagyo Gyanamuttamam॥48॥

Suvratah Sumukhah Sukshmah Sughoshah Sukhadah Suhrit।
Manoharo Jitakrodho Veerabahur Vidaranah॥49॥

Svapanah Svavasho Vyapi Naikatma Naikakarmakrit।
Vatsaro Vatsalo Vatsi Ratnagarbho Dhaneshvarah॥50॥

Dharmagub Dharmakrid Dharmi Sadasat Ksharamaksharam।
Avigyata Sahasramshur Vidhata Kritalakshanah॥51॥

Gabhastinemih Sattvasthah Simho Bhoota Maheshvarah।
Adidevo Mahadevo Devesho Devabhrit Guruh॥52॥

Uttaro Gopatir Gopta Gyanagamyah Puratanah।
Sharirabhootabhrit Bhokta Kapeendro Bhooridakshinah॥53॥

Somapo'mritapah Somah Purujit Purusattamah।
Vinayo Jayah Satyasandho Dasharhah Satvatam Patih॥54॥

Jeevo Vinayita Sakshi Mukundo'mitavikramah।
Ambhonidhir Anantatma Mahodadhishayo'ntakah॥55॥

Ajo Maharhah Svabhavyo Jitamitrah Pramodanah।
Anando Nandano Nandah Satyadharma Trivikramah॥56॥

Maharshih Kapilacharyah Kritagyo Medinipatih।
Tripadas Tridashadhyaksho Mahashringah Kritantakrit॥57॥

Mahavaraho Govindah Sushenah Kanakangadi।
Guhyo Gabhiro Gahano Guptash Chakragadadharah॥58॥

Vedhah Svango'jitah Krishno Dridhah Sankarshano'chyutah।
Varuno Vaaruno Vrikshah Pushkaraksho Mahamanah॥59॥

Bhagavan Bhagaha'nandi Vanamali Halayudhah।
Adityo Jyotiradityah Sahishnur Gatisattamah॥60॥`,

    "Govinda Namavali": `॥ Shri Govinda Namavali ॥

Govinda Govinda Govinda।
Govinda Govinda Govinda॥

Shri Govinda, Hari Govinda।
Gopal Govinda, Govinda॥

Venkata Ramana Govinda।
Venkateshwara Govinda॥

Shripati Govinda।
Lakshmipati Govinda॥

Vasudeva Govinda।
Devaki Nandana Govinda॥

Nanda Nandana Govinda।
Navaneeta Chora Govinda॥

Govardhana Dhari Govinda।
Gokula Nandana Govinda॥

Murali Manohara Govinda।
Madhusudana Govinda॥

Madhava Govinda।
Keshava Govinda॥

Damodara Govinda।
Padmanabha Govinda॥

Pundarikaksha Govinda।
Paramadayala Govinda॥

Bhaktavatsala Govinda।
Deenadayala Govinda॥

Radharamana Govinda।
Rukmini Ramana Govinda॥

Sitarama Govinda।
Shri Krishna Govinda॥

Anantashayana Govinda।
Anandamurti Govinda॥

Sharanagata Vatsala Govinda।
Sarvalokanatha Govinda॥

Govinda Govinda Govinda।
Shri Venkatesha Govinda॥ `,

    "Jai Ganesh Deva": `॥ Jai Ganesh Deva ॥

Jai Ganesh, Jai Ganesh, Jai Ganesh Deva।
Mata Jaki Parvati, Pita Mahadeva॥

Ek Dant Dayavant, Char Bhuja Dhari।
Mathe Par Tilak Sohe, Muse Ki Savari॥

Jai Ganesh, Jai Ganesh, Jai Ganesh Deva।
Mata Jaki Parvati, Pita Mahadeva॥

Paan Chadhe, Phool Chadhe, Aur Chadhe Meva।
Ladduan Ka Bhog Lage, Sant Karen Seva॥

Jai Ganesh, Jai Ganesh, Jai Ganesh Deva।
Mata Jaki Parvati, Pita Mahadeva॥

Andhan Ko Aankh Det, Kodhin Ko Kaya।
Banjhan Ko Putra Det, Nirdhan Ko Maya॥

Jai Ganesh, Jai Ganesh, Jai Ganesh Deva।
Mata Jaki Parvati, Pita Mahadeva॥

Surya Shyam Sharan Aaye, Safal Kije Seva।
Mata Jaki Parvati, Pita Mahadeva॥

Jai Ganesh, Jai Ganesh, Jai Ganesh Deva।
Mata Jaki Parvati, Pita Mahadeva॥`,

    "Sukhkarta Dukhharta": `॥ Sukhkarta Dukhharta ॥

Sukhkarta Dukhharta, Varta Vighnachi।
Nurvi Purvi Prem Krupa Jayachi॥

Sarvangi Sundar, Uti Shendurachi।
Kanthi Jhalke Maal, Muktaphalanchi॥

Jai Dev Jai Dev, Jai Mangal Murti।
Darshan Maatre Manakamana Purti॥

Ratnakhachit Phara, Tuj Gaurikumara।
Chandanachi Uti, Kumkum Keshara॥

Hire Jadit Mukut, Shobhato Bara।
Runjhunati Nupure, Charani Ghagariya॥

Jai Dev Jai Dev, Jai Mangal Murti।
Darshan Maatre Manakamana Purti॥

Lambodar Pitambar, Phanivar Bandhana।
Saral Sond Vakratunda, Trinayana॥

Das Ramacha Vat Pahe Sadana।
Sankati Pavave, Nirvani Rakshave, Survar Vandana॥

Jai Dev Jai Dev, Jai Mangal Murti।
Darshan Maatre Manakamana Purti॥`,

    "Vakratunda Mahakaya": `Vakratunda Mahakaya Suryakoti Samaprabha
Nirvighnam Kuru Me Deva Sarvakaryeshu Sarvada`,
    "Shri Ganesh Vandana": `Jai Ganesh Jai Ganesh Jai Ganesh Deva
Mata Jaki Parvati, Pita Mahadeva॥

Ek Dant Dayavant, Chaar Bhuja Dhaari
Maathe Sindoor Chadhe, Aur Mushak Ki Sawaari॥

Haar Chadhe, Phool Chadhe, Aur Chadhe Meva
Laddooan Ka Bhog Lage, Sant Karein Seva॥

Jai Ganesh Jai Ganesh Jai Ganesh Deva
Mata Jaki Parvati, Pita Mahadeva॥

Andhan Ko Aankh Det, Kodhin Ko Kaaya
Baanjhan Ko Putra Det, Nirdhan Ko Maaya॥

'Soor' Shyaam Sharan Aaye, Mohe Paavan Keeje
Inki Jaisi Bhaavna, Taisi Phal Deeje॥

Jai Ganesh Jai Ganesh Jai Ganesh Deva
Mata Jaki Parvati, Pita Mahadeva॥ `,

    "Om Jai Shiv Omkara": `Om Jai Shiv Omkara,
Har Jai Shiv Omkara।
Brahma, Vishnu, Sadashiva,
Ardhangini Dhara॥

Om Jai Shiv Omkara॥

Ekanan Chaturanan Panchanan Raje।
Hansasan Garudasan Vrishvahan Saje॥

Om Jai Shiv Omkara॥

Do Bhuj Char Chaturbhuj Dashbhuj Te Sohe।
Teeno Roop Nirakhata Tribhuvan Jan Mohe॥

Om Jai Shiv Omkara॥

Akshamala Vanmala Mundmala Dhari।
Chandan Mrigmad Chanda Bhole Shubhkaari॥

Om Jai Shiv Omkara॥

Shwetambar Pitambar Baghambar Ange।
Sanakadik Garudadik Bhootadik Sange॥

Om Jai Shiv Omkara॥

Karamadhye Kamandalu Chakra Trishul Dharta।
Jagkarta Jagbharta Jag Sanharkarta॥

Om Jai Shiv Omkara॥

Brahma Vishnu Sadashiva Janat Aviveka।
Pranavakshar Ke Madhye Ye Teeno Eka॥

Om Jai Shiv Omkara॥

Trigun Swami Ki Aarti Jo Koi Nar Gave।
Bhakt Kahat Shivanand Swami Manvanchhit Phal Pave॥

Om Jai Shiv Omkara॥`,
    "Shiv Chalisa": `॥ Doha ॥
    Jai Ganesh Girija Suvan, Mangal Mool Sujaan।
Kahat Ayodhyadas Tum, Dehu Abhay Vardaan॥


Jai Girija Pati Deen Dayala।
Sada Karat Santan Pratipala॥

Bhaal Chandrama Sohat Neeke।
Kaanan Kundal Naagphani Ke॥

Ang Gaur Shir Gang Bahaye।
Mundmaal Tan Chhaar Lagaye॥

Vastra Khaal Baghambar Sohe।
Chhavi Ko Dekhi Naag Muni Mohe॥

Maina Maatu Ki Hvai Dulaari।
Baam Ang Sohat Chhavi Nyaari॥

Kar Trishul Sohat Chhavi Bhaari।
Karat Sada Shatrun Kshaykaari॥

Nandi Ganesh Sohai Tahaan Kaise।
Saagar Madhya Kamal Hain Jaise॥

Kartik Shyaam Aur Ganraau।
Ya Chhavi Ko Kahi Jaat Na Kaau॥

Devan Jabahin Jaay Pukaara।
Tab Hi Dukh Prabhu Aap Nivaara॥

Kiya Upadrav Taarak Bhaari।
Devan Sab Mili Tumhin Juhaari॥

Turat Shadaanana Aap Pathaayu।
Lavnimesh Mahaan Maari Giraayu॥

Aap Jalandhar Asur Sanhaara।
Suyash Tumhaar Vidit Sansara॥

Tripuraasur San Yuddh Machhaai।
Sabahi Kripa Kar Leen Bachaai॥

Kiya Tapahin Bhaagirath Bhaari।
Purab Pratigya Tasu Puraari॥

Daanin Mahaan Tum Sam Kou Naahin।
Sevak Stuti Karat Sadaaheen॥

Ved Naam Mahima Tav Gaai।
Akath Anaadi Bhed Nahin Paai॥

Prakati Udadhi Manthan Mein Jwaala।
Jare Suraasur Bhaye Vihaala॥

Keenh Daya Tahan Kari Sahaai।
Neelkanth Tab Naam Kahaai॥

Poojan Ramchandra Jab Keenha।
Jeet Ke Lank Vibheeshan Deenha॥

Sahas Kamal Mein Ho Rahe Dhaari।
Keenh Pareeksha Tabahin Puraari॥

Ek Kamal Prabhu Raakheu Joi।
Kamal Nayan Poojan Chahen Soi॥

Kathin Bhakti Dekhi Prabhu Shankar।
Bhaye Prasann Diye Ichchhit Var॥

Jai Jai Jai Anant Avinaashi।
Karat Kripa Sab Ke Ghatvaasi॥

Dusht Sakal Nit Mohi Sataavai।
Bhramat Rahe Mohi Chain Na Aavai॥

Traahi Traahi Main Naath Pukaaro।
Yehi Avasar Mohi Aan Ubaaro॥

Lai Trishul Shatrun Ko Maaro।
Sankat Se Mohi Aan Ubaaro॥

Maat-Pita Bhraata Sab Koi।
Sankat Mein Poochhat Nahin Koi॥

Swaami Ek Hai Aas Tumhaari।
Aay Harahu Ab Sankat Bhaari॥

Dhan Nirdhan Ko Det Sadaa Hi।
Jo Koi Jaanchai So Phal Paahi॥

Astuti Kehi Vidhi Karaun Tumhaari।
Kshamahu Naath Ab Chook Hamaari॥

Shankar Ho Sankat Ke Naashan।
Mangal Kaaran Vighn Vinaashan॥

Yogi Yati Muni Dhyaan Lagaavein।
Naarad Shaarad Sheesh Navaavein॥

Namo Namo Jai Namah Shivaay।
Sur Brahmaadik Paar Na Paay॥

Jo Yah Paath Kare Man Laai।
Ta Par Hot Hai Shambhu Sahaai॥

Riniyaan Jo Koi Ho Adhikaari।
Paath Kare So Paavan Haari॥

Putra Hon Ki Ichchha Joi।
Nishchay Shiv Prasaad Tehi Hoi॥

Pandit Trayodashi Ko Laave।
Dhyaan Poorvak Hom Karaave॥

Trayodashi Vrat Kare Hamesha।
Taake Tan Nahin Rahe Kalesha॥

Dhoop Deep Naivedya Chadhaave।
Shankar Sammukh Paath Sunaave॥

Janm Janm Ke Paap Nasaave।
Antavaas Shivpur Mein Paave॥

Kahain Ayodhyadas Aas Tumhaari।
Jaani Sakal Dukh Harahu Hamaari॥

॥ Doha ॥
Nitt Nem Uthi Praatah Hi, Paath Karo Chaalees।
Tum Meri Manokaamna, Poorn Karo Jagdeesh॥

Magsar Chhathi Hemant Ritu, Samvat Chausath Jaan।
Astuti Chaaleesa Shivahi, Poorn Keen Kalyaan॥
`,
    "Maha Mrityunjaya Mantra": `
    Om Tryambakam Yajamahe
Sugandhim Pushtivardhanam

Urvarukamiva Bandhanan
Mrityor Mukshiya Maamritat`,
    "Jai Ambe Gauri": `Jai Ambe Gauri, Maiya Jai Shyama Gauri
Tumko Nishdin Dhyavat, Hari Brahma Shivri

Maang Sindoor Virajat, Tiko Mrigmad Ko
Ujjwal Se Do Naina, Chandravadan Neeko

Jai Ambe Gauri...

Kanak Samaan Kalevar, Raktambar Raaje
Rakt Pushp Gal Maala, Kanthan Par Saaje

Jai Ambe Gauri...

Kehari Vahan Raajat, Khadga Khappar Dhaari
Sur-Nar-Munijan Sevat, Tinke Dukhhaari

Jai Ambe Gauri...

Kaanan Kundal Shobhit, Naasagre Moti
Kotik Chandra Divakar, Raajat Sam Jyoti

Jai Ambe Gauri...

Shumbh-Nishumbh Vidaare, Mahishasur Ghaati
Dhoomra Vilochan Naina, Nishdin Madmaati

Jai Ambe Gauri...

Chand-Mund Sanhaare, Shonit Beej Hare
Madhu-Kaitabh Dou Maare, Sur Bhayheen Kare

Jai Ambe Gauri...

Brahmani Rudrani, Tum Kamala Rani
Aagam Nigam Bakhani, Tum Shiv Patraani

Jai Ambe Gauri...

Chaunsath Yogini Mangal Gaavat, Nritya Karat Bhairon
Baajat Taal Mridanga, Aru Baajat Damru

Jai Ambe Gauri...

Tum Hi Jag Ki Mata, Tum Hi Ho Bharta
Bhaktan Ki Dukh Harta, Sukh Sampatti Karta

Jai Ambe Gauri...

Bhuja Chaar Ati Shobhit, Khadga Khappar Dhaari
Manvanchhit Phal Paavat, Sevat Nar Naari

Jai Ambe Gauri...

Kanchan Thaal Virajat, Agar Kapoor Baati
Shrimaalaketu Mein Raajat, Koti Ratan Jyoti

Jai Ambe Gauri...

Ambe Ji Ki Aarti, Jo Koi Nar Gaave
Kahat Shivanand Swami, Sukh-Sampatti Paave

Jai Ambe Gauri, Maiya Jai Shyama Gauri
Tumko Nishdin Dhyavat, Hari Brahma Shivri`,
    "Durga Chalisa": `॥ Doha ॥

Namo Namo Durge Sukh Karni,
Namo Namo Ambe Dukh Harni.

Nirankar Hai Jyoti Tumhari,
Tihun Lok Phaili Ujiyari.

॥ Chaupai ॥

Shashi Lalaat Mukh Mahavishala,
Netra Laal Bhrikuti Vikarala.

Roop Maatu Ko Adhik Suhaave,
Darash Karat Jan Ati Sukh Paave.

Tum Sansaar Shakti Lay Keena,
Paalan Hetu Ann Dhan Deena.

Annapurna Hui Jag Paala,
Tum Hi Aadi Sundari Baala.

Pralaykaal Sab Naashan Haari,
Tum Gauri Shankar Ki Pyaari.

Shiv Yogi Tumhare Gun Gaavein,
Brahma Vishnu Tumhein Nit Dhyaavein.

Roop Saraswati Ko Tum Dhaara,
De Subuddhi Rishi Munin Ubaara.

Dhara Roop Narasinh Ko Amba,
Pragat Bhayi Phaadkar Khamba.

Raksha Kari Prahlad Bachaayo,
Hiranyaksh Ko Swarg Pathaayo.

Lakshmi Roop Dharo Jag Maahin,
Shri Narayan Ang Samaahin.

Ksheersindhu Mein Karat Vilaasa,
Dayasindhu Deejai Man Aasa.

Hinglaj Mein Tumhin Bhavaani,
Mahima Amit Na Jaat Bakhaani.

Maatangi Aru Dhoomaavati Maata,
Bhuvaneshwari Bagla Sukhdaata.

Shri Bhairav Taara Jag Taarini,
Chhinn Bhaal Bhav Dukh Nivaarini.

Kehari Vaahan Sohat Bhavaani,
Langur Veer Chalat Agavaani.

Kar Mein Khappar Khadg Viraajai,
Jaako Dekh Kaal Dar Bhaajai.

Sohai Astra Aur Trishoola,
Jaate Uthat Shatru Hiya Shoola.

Nagarkot Mein Tumhin Viraajat,
Tihun Lok Mein Danka Baajat.

Shumbh Nishumbh Daanav Tum Maare,
Raktabeej Shankhan Sanhaare.

Mahishasur Nrip Ati Abhimaani,
Jehi Agh Bhaar Mahi Akulaani.

Roop Karaal Kaalika Dhaara,
Sen Sahit Tum Tihi Sanhaara.

Pari Gaadh Santan Par Jab Jab,
Bhayi Sahaay Maatu Tum Tab Tab.

Amarpuri Aru Baasav Loka,
Tav Mahima Sab Rahein Ashoka.

Jwaala Mein Hai Jyoti Tumhaari,
Tumhein Sada Poojein Nar Naari.

Prem Bhakti Se Jo Yash Gaavein,
Dukh Daaridra Nikat Nahin Aavein.

Dhyaave Tumhein Jo Nar Man Laayi,
Janm-Maran Taako Chhuti Jaayi.

Jogi Sur Muni Kahat Pukaari,
Yog Na Ho Bin Shakti Tumhaari.

Shankar Aachaarya Tap Keeno,
Kaam Aru Krodh Jeeti Sab Leeno.

Nishidin Dhyaan Dharo Shankar Ko,
Kaahu Kaal Nahin Sumiro Tumko.

Shakti Roop Ka Maram Na Paayo,
Shakti Gayi Tab Man Pachhitaayo.

Sharanaagat Hui Kirti Bakhaani,
Jai Jai Jai Jagdamb Bhavaani.

Bhayi Prasann Aadi Jagdamba,
Dayi Shakti Nahin Keen Vilamba.

Moko Maatu Kasht Ati Ghero,
Tum Bin Kaun Harai Dukh Mero.

Aasha Trishna Nipat Sataavein,
Moh Madaadik Sab Vinshaavein.

Shatru Naash Keejai Mahaaraani,
Sumiraun Ikchit Tumhein Bhavaani.

Karo Kripa He Maatu Dayaala,
Riddhi Siddhi De Karahu Nihaala.

Jab Lag Jiyun Daya Phal Paaun,
Tumharo Yash Main Sada Sunaun.

Durga Chalisa Jo Koi Gaave,
Sab Sukh Bhog Param Pad Paave.

Devidas Sharan Nij Jaani,
Karahu Kripa Jagdamb Bhavaani.

॥ Doha ॥

Sharanaagat Raksha Kare, Bhakt Rahe Nishchint,
Durga Chalisa Padhat, Mite Sakal Bhay Dwand.`,
    "Durga Saptashati Path": `
    Mangalacharan
    ॥ Shri Ganeshaya Namah ॥

॥ Shri Gurubhyo Namah ॥

॥ Shri Durgayai Namah ॥

Om Namashchandikayai.

Shri Durga Dhyanam
Om Vidyuddamasamaprabham Mrigapatiskandhasthitam Bhishanam,
Kanyabhih Karavala Khetavilasaddhastabhirasevitam.

Hastaischakragadhasikhetavishikhamshchapam Gunam Tarjan im,
Bibhranamanalatmikam Shashidharam Durgam Trinetram Bhaje.
Markandeya Uvacha:
Om Yadguhyam Paramam Loke Sarvarakshakaram Nrinam,
Yanna Kasyachidakhyatam Tanme Bruhi Pitamaha.

Brahmovacha:
Asti Guhyatamam Vipra Sarvabhutopakaarakam,
Devyastu Kavacham Punyam Tacchhrunushva Mahamune.

Prathamam Shailaputri Cha Dwitiya Brahmacharini,
Tritiyam Chandraghanteti Kushmandeti Chaturthakam.

Panchamam Skandamateti Shashtham Katyayaniti Cha,
Saptamam Kalaratrishcha Mahagauriti Chashtamam.

Navamam Siddhidatri Cha Navadurgah Prakirtitah,
Uktanyetani Namani Brahmanaiva Mahatmana.

Agnina Dahyamanastu Shatrumadhye Gata Rane,
Vishame Durgame Chaiva Bhayartah Sharanam Gatah.

Na Tesham Jayate Kinchid Ashubham Ranasankate,
Napadam Tasya Pashyami Shokaduhkhabhayam Na Hi.

Yaistu Bhaktya Smrita Nityam Tesham Vriddhih Prajayate,
Ye Tvaam Smaranti Deveshi Rakshase Tan Na Sanshayah.`,
};
// Hindi lyrics (Devanagari). Naam bilkul English wale jaisa rakhna.
const LYRICS_HI: Record<string, string> = {


};

// Bengali lyrics
const LYRICS_BN: Record<string, string> = {
    //     "Hanuman Chalisa": `প্রারম্ভিক দোহা

};

// Urdu lyrics
const LYRICS_UR: Record<string, string> = {

};

const LYRICS_BY_LANG: Record<string, Record<string, string>> = {
    hi: LYRICS_HI,
    bn: LYRICS_BN,
    ur: LYRICS_UR,
};

// Diya (lamp) illustration - inline SVG, koi image file nahi chahiye


function BhajanItem({ b }: { b: Bhajan }) {
    const about = ABOUT[b.title];
    const lyrics = LYRICS[b.title]?.trim() ?? "";

    return (
        <li>
            <details className="py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 hover:text-saffron">
                    <span className="text-foreground">
                        {b.title}{" "}
                        <span className="text-xs text-brown">▾</span>
                    </span>

                    <span className="rounded-full bg-saffron-light px-2.5 py-0.5 text-xs text-saffron-dark">
                        {b.kind}
                    </span>
                </summary>

                {about && (
                    <p className="mt-3 text-sm leading-relaxed text-brown">
                        {about}
                    </p>
                )}

                {lyrics && (
                    <p className="mt-3 whitespace-pre-line rounded-lg bg-saffron-light/40 p-3 text-sm leading-relaxed text-foreground">
                        {lyrics}
                    </p>
                )}
            </details>
        </li>
    );
}


function DiyaArt() {
    return (
        <svg viewBox="0 0 120 120" className="h-20 w-20 shrink-0" aria-hidden="true">
            <defs>
                <radialGradient id="diya-glow" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#ffe9a8" />
                    <stop offset="100%" stopColor="#f6e4cc" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="60" cy="52" r="46" fill="url(#diya-glow)" />
            <path d="M60 18 C70 34 74 42 60 56 C46 42 50 34 60 18Z" fill="#d9822b" />
            <path d="M60 30 C65 40 66 45 60 53 C54 45 55 40 60 30Z" fill="#ffd36e" />
            <path d="M22 66 Q60 62 98 66 Q92 96 60 98 Q28 96 22 66Z" fill="#b8681a" />
            <ellipse cx="60" cy="66" rx="38" ry="6" fill="#d9822b" />
            <rect x="44" y="98" width="32" height="6" rx="3" fill="#5a3e2b" />
        </svg>
    );
}


function BhajanPlayer() {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="mt-5 rounded-2xl border border-[#ead5b5] bg-gradient-to-br from-[#fffaf0] via-[#fff5e5] to-[#f8e5c9] p-5 shadow-md">

            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#e6a13b] to-[#a95716] shadow-md">
                    <Flame className="h-9 w-9 text-white" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#a66a27]">
                        Featured Bhajan
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-bold text-[#603b20]">
                        Om Jai Jagdish Hare
                    </h3>
                    <p className="text-sm text-[#98734e]">
                        Aarti • Devotional Music
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsFavorite(!isFavorite)}
                    aria-label="Toggle favourite"
                    className="rounded-full p-2 hover:bg-white/70"
                >
                    <Heart
                        className={`h-6 w-6 ${isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-[#a66a27]"
                            }`}
                    />
                </button>
            </div>

            <div className="mt-6">
                <div className="h-1.5 overflow-hidden rounded-full bg-[#e8d4b8]">
                    <div className="h-full w-0 rounded-full bg-[#c47a24]" />
                </div>

                <div className="mt-2 flex justify-between text-xs text-[#98734e]">
                    <span>00:00</span>
                    <span>--:--</span>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-8">
                <button
                    type="button"
                    disabled
                    className="text-[#a66a27] opacity-40"
                    aria-label="Previous song"
                >
                    <SkipBack size={25} />
                </button>

                <button
                    type="button"
                    disabled
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#e6a13b] to-[#b96819] text-white shadow-lg opacity-60"
                    aria-label="Audio not available yet"
                >
                    <Play size={27} fill="currentColor" />
                </button>

                <button
                    type="button"
                    disabled
                    className="text-[#a66a27] opacity-40"
                    aria-label="Next song"
                >
                    <SkipForward size={25} />
                </button>
            </div>

            <p className="mt-4 text-center text-xs text-[#98734e]">
                🙏 Audio will be available soon
            </p>
        </div>
    );
}



export default function TempleDetailsView({
    temple,
    image,
    mapSrc,
    directions,
}: {
    temple: Temple;
    image?: string;
    mapSrc: string;
    directions: string;
}) {
    const { t, lang } = useLanguage();
    const name = locName(temple.slug, temple.name, lang);
    const bhajans = getBhajans(temple.deity);

    return (
        <main>
            <section className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-navy to-saffron-dark">
                {image ? (
                    // Poori banner photo pe click = photo bada khulegi
                    <ImageLightbox src={image} alt={name} className="absolute inset-0 block h-full w-full">
                        <Image src={image} alt={name} fill className="object-cover" priority />
                    </ImageLightbox>
                ) : (
                    <TempleIcon className="absolute right-10 top-10 h-40 w-40 text-white/10" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-black/50" />

                {image && (
                    <span className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                        <ZoomIn className="h-4 w-4" /> {t("view_photo")}
                    </span>
                )}

                <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-8 text-white">
                    <p className="text-sm text-white/80">
                        <Link href="/" className="pointer-events-auto hover:underline">{t("nav_home")}</Link> ›{" "}
                        <Link href="/temples" className="pointer-events-auto hover:underline">{t("nav_temples")}</Link> ›{" "}
                        {name}
                    </p>
                    <h1 className="mt-2 font-heading text-4xl font-semibold md:text-5xl">{name}</h1>
                    <p className="mt-1 flex items-center gap-2 text-white/90">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {locCity(temple.city, lang)}, {locState(temple.state, lang)} • {locDeity(temple.deity, lang)}
                    </p>
                </div>
            </section>

            <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h2 className="mb-3 flex items-center gap-2 font-heading text-2xl font-semibold">
                        <ScrollText className="h-6 w-6 text-saffron" /> {t("history_story")}
                    </h2>

                    <TempleStory slug={temple.slug} story={temple.story} note={temple.note} />

                    <h2 className="mb-3 mt-10 flex items-center gap-2 font-heading text-2xl font-semibold">
                        <Music className="h-6 w-6 text-saffron" /> Bhajan & Aarti
                    </h2>
                    <BhajanPlayer />
                    <div className="flex items-center gap-4 rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
                        <DiyaArt />
                        <ul className="flex-1 divide-y divide-saffron-light text-sm">
                            {bhajans.map((b, i) => (
                                <BhajanItem key={i} b={b} />
                            ))}

                        </ul>
                    </div>

                    <h2 className="mb-3 mt-10 flex items-center gap-2 font-heading text-2xl font-semibold">
                        <MapPin className="h-6 w-6 text-saffron" /> {t("real_location")}
                    </h2>
                    <div className="overflow-hidden rounded-xl border border-saffron-light">
                        <iframe
                            title={`Map of ${temple.name}`}
                            src={mapSrc}
                            className="h-80 w-full"
                            loading="lazy"
                        />
                    </div>
                    <a
                        href={directions}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-2 rounded-md bg-saffron px-5 py-2.5 text-sm font-medium text-white hover:bg-saffron-dark"
                    >
                        <Navigation className="h-4 w-4" /> {t("get_directions")}
                    </a>
                </div>

                <aside className="space-y-6">
                    <div className="rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold">
                            <Clock className="h-5 w-5 text-saffron" /> {t("opening_closing")}
                        </h3>
                        <p className="text-sm text-brown">{locTimings(temple.timings, lang)}</p>
                    </div>

                    <div className="rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold">
                            <Flame className="h-5 w-5 text-saffron" /> {t("puja_timings")}
                        </h3>
                        <PujaList slug={temple.slug} pujas={temple.pujas} />
                        <p className="mt-3 text-xs text-brown/70">{t("timings_note")}</p>
                    </div>
                    <VisitInfo temple={temple} />
                    {/* <VisitInfo slug={temple.slug} /> */}
                </aside>
            </div>
        </main>
    );
}