"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Flame, Navigation, ScrollText, ZoomIn, Music } from "lucide-react";
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
    "Hanuman Chalisa": `
    ॥ प्रारंभिक दोहा ॥

श्री गुरु चरन सरोज रज, निज मन मुकुरु सुधारि।
बरनऊँ रघुबर बिमल जसु, जो दायकु फल चारि॥

बुद्धिहीन तनु जानिके, सुमिरौं पवन-कुमार।
बल बुद्धि विद्या देहु मोहिं, हरहु कलेस बिकार॥

1. जय हनुमान ज्ञान गुन सागर।
   जय कपीस तिहुँ लोक उजागर॥

2. राम दूत अतुलित बल धामा।
   अंजनि-पुत्र पवनसुत नामा॥

3. महाबीर बिक्रम बजरंगी।
   कुमति निवार सुमति के संगी॥

4. कंचन बरन बिराज सुबेसा।
   कानन कुंडल कुंचित केसा॥

5. हाथ बज्र औ ध्वजा बिराजै।
   काँधे मूँज जनेऊ साजै॥

6. शंकर सुवन केसरी नंदन।
   तेज प्रताप महा जग वंदन॥

7. विद्यावान गुनी अति चातुर।
   राम काज करिबे को आतुर॥

8. प्रभु चरित्र सुनिबे को रसिया।
   राम लखन सीता मन बसिया॥

9. सूक्ष्म रूप धरि सियहिं दिखावा।
   बिकट रूप धरि लंक जरावा॥

10. भीम रूप धरि असुर सँहारे।
    रामचंद्र के काज सँवारे॥

11. लाय सजीवन लखन जियाये।
    श्री रघुबीर हरषि उर लाये॥

12. रघुपति कीन्ही बहुत बड़ाई।
    तुम मम प्रिय भरतहि सम भाई॥

13. सहस बदन तुम्हरो जस गावैं।
    अस कहि श्रीपति कंठ लगावैं॥

14. सनकादिक ब्रह्मादि मुनीसा।
    नारद सारद सहित अहीसा॥

15. जम कुबेर दिगपाल जहाँ ते।
    कवि कोविद कहि सके कहाँ ते॥

16. तुम उपकार सुग्रीवहिं कीन्हा।
    राम मिलाय राज पद दीन्हा॥

17. तुम्हरो मंत्र विभीषण माना।
    लंकेश्वर भए सब जग जाना॥

18. जुग सहस्र जोजन पर भानू।
    लील्यो ताहि मधुर फल जानू॥

19. प्रभु मुद्रिका मेलि मुख माहीं।
    जलधि लाँघि गये अचरज नाहीं॥

20. दुर्गम काज जगत के जेते।
    सुगम अनुग्रह तुम्हरे तेते॥

21. राम दुआरे तुम रखवारे।
    होत न आज्ञा बिनु पैसारे॥

22. सब सुख लहै तुम्हारी सरना।
    तुम रक्षक काहू को डरना॥

23. आपन तेज सम्हारो आपै।
    तीनों लोक हाँक तें काँपै॥

24. भूत पिशाच निकट नहिं आवै।
    महावीर जब नाम सुनावै॥

25. नासै रोग हरै सब पीरा।
    जपत निरंतर हनुमत बीरा॥

26. संकट तें हनुमान छुड़ावै।
    मन क्रम वचन ध्यान जो लावै॥

27. सब पर राम तपस्वी राजा।
    तिनके काज सकल तुम साजा॥

28. और मनोरथ जो कोई लावै।
    सोइ अमित जीवन फल पावै॥

29. चारों जुग परताप तुम्हारा।
    है परसिद्ध जगत उजियारा॥

30. साधु संत के तुम रखवारे।
    असुर निकंदन राम दुलारे॥

31. अष्ट सिद्धि नौ निधि के दाता।
    अस बर दीन जानकी माता॥

32. राम रसायन तुम्हरे पासा।
    सदा रहो रघुपति के दासा॥

33. तुम्हरे भजन राम को पावै।
    जनम जनम के दुख बिसरावै॥

34. अंत काल रघुबर पुर जाई।
    जहाँ जन्म हरि-भक्त कहाई॥

35. और देवता चित्त न धरई।
    हनुमत सेइ सर्व सुख करई॥

36. संकट कटै मिटै सब पीरा।
    जो सुमिरै हनुमत बलबीरा॥

37. जै जै जै हनुमान गोसाईं।
    कृपा करहु गुरुदेव की नाईं॥

38. जो सत बार पाठ कर कोई।
    छूटहि बंदि महा सुख होई॥

39. जो यह पढ़ै हनुमान चालीसा।
    होय सिद्धि साखी गौरीसा॥

40. तुलसीदास सदा हरि चेरा।
    कीजै नाथ हृदय महँ डेरा॥

    ॥ अंतिम दोहा ॥

पवनतनय संकट हरन, मंगल मूरति रूप।
राम लखन सीता सहित, हृदय बसहु सुर भूप॥
`,
    "Aarti Kije Hanuman Lala Ki": `श्री रामचन्द्र कृपालु भजमन,
हरण भवभय दारुणम्।
नवकंज लोचन, कंज मुख,
कर कंज पद कंजारुणम्॥

कन्दर्प अगणित अमित छवि,
नवनील नीरद सुन्दरम्।
पटपीत मानहुँ तड़ित रुचि,
शुचि नौमि जनक सुतावरम्॥

भजु दीनबन्धु दिनेश दानव,
दैत्यवंश निकन्दनम्।
रघुनन्द आनन्दकन्द,
कौशलचन्द दशरथ नन्दनम्॥

सिर मुकुट कुण्डल तिलक,
चारु उदारु अङ्ग विभूषणम्।
आजानुभुज शर चाप धर,
संग्रामजित खरदूषणम्॥

इति वदति तुलसीदास,
शंकर शेष मुनि मन रंजनम्।
मम हृदय कंज निवास कुरु,
कामादि खलदल गंजनम्॥
`,
    "Sankat Mochan Ashtak": `बाल समय रवि भक्षि लियो तब,
तीनहुँ लोक भयो अँधियारो।
ताहि सों त्रास भयो जग को,
यह संकट काहु सों जात न टारो॥

देवन आनि करी बिनती तब,
छाड़ि दियो रवि कष्ट निवारो।
को नहीं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥१॥

बालि की त्रास कपीस बसैं गिरि,
जात महाप्रभु पंथ निहारो।
चौंकि महामुनि शाप दियो तब,
चाहिए कौन बिचार बिचारो॥

कै द्विज रूप लिवाय महाप्रभु,
सो तुम दास के शोक निवारो।
को नहीं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥२॥

अंगद के संग लेन गए सिय,
खोज कपीस यह बैन उचारो।
जीवत ना बचिहौ हम सो जु,
बिना सुधि लाए इहाँ पगु धारो॥

हेरि थके तट सिंधु सबै तब,
लाय सिया-सुधि प्राण उबारो।
को नहीं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥३॥

रावन त्रास दई सिय को सब,
राक्षसि सों कहि शोक निवारो।
ताहि समय हनुमान महाप्रभु,
जाय महा रजनीचर मारो॥

चाहत सीय अशोक सों आगि सु,
दै प्रभु मुद्रिका शोक निवारो।
को नहीं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥४॥

बान लग्यो उर लछिमन के तब,
प्राण तजे सुत रावन मारो।
लै गृह बैद्य सुषेन समेत,
तबै गिरि द्रोण सु बीर उपारो॥

आनि सजीवन हाथ दई तब,
लछिमन के तुम प्राण उबारो।
को नहीं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥५॥

रावन जुद्ध अजान कियो तब,
नाग की फाँस सबै सिर डारो।
श्रीरघुनाथ समेत सबै दल,
मोह भयो यह संकट भारो॥

आनि खगेस तबै हनुमान जु,
बंधन काटि सुत्रास निवारो।
को नहीं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥६॥

बंधु समेत जबै अहिरावन,
लै रघुनाथ पताल सिधारो।
देविहिं पूजि भलि विधि सों बलि,
देउ सबै मिलि मंत्र विचारो॥

जाय सहाय भयो तब ही,
अहिरावन सैन्य समेत संहारो।
को नहीं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥७॥

काज किए बड़ देवन के तुम,
वीर महाप्रभु देखि बिचारो।
कौन सो संकट मोर गरीब को,
जो तुमसों नहिं जात है टारो॥

बेगि हरो हनुमान महाप्रभु,
जो कछु संकट होय हमारो।
को नहीं जानत है जग में कपि,
संकटमोचन नाम तिहारो॥८॥

दोहा

लाल देह लाली लसे,
अरु धरि लाल लंगूर।
वज्र देह दानव दलन,
जय जय जय कपि सूर॥`,
    "Shri Ramchandra Kripalu Bhajman":
        `श्री रामचन्द्र कृपालु भजमन,
हरण भवभय दारुणम्।
नवकंज लोचन, कंज मुख,
कर कंज पद कंजारुणम्॥

कन्दर्प अगणित अमित छवि,
नवनील नीरद सुन्दरम्।
पटपीत मानहुँ तड़ित रुचि,
शुचि नौमि जनक सुतावरम्॥

भजु दीनबन्धु दिनेश दानव,
दैत्यवंश निकन्दनम्।
रघुनन्द आनन्दकन्द,
कौशलचन्द दशरथ नन्दनम्॥

सिर मुकुट कुण्डल तिलक,
चारु उदारु अङ्ग विभूषणम्।
आजानुभुज शर चाप धर,
संग्रामजित खरदूषणम्॥

इति वदति तुलसीदास,
शंकर शेष मुनि मन रंजनम्।
मम हृदय कंज निवास कुरु,
कामादि खलदल गंजनम्॥`,
    "Aarti Shri Ramchandra Ji Ki":
        `आरती श्री रामचंद्र जी की,
    कीरति कलित ललित सिय पी की॥

    गावत ब्रह्मादिक मुनि नारद,
    बाल्मीकि विज्ञान विशारद।
    शुक सनकादिक शेष अरु शारद,
    बरनि पवनसुत कीरति नीकी॥

    आरती श्री रामचंद्र जी की॥

    रहत सो अवध में रुचिर भवन में,
    आसन पर हरि चपल चरन में।
    करत कृपा बहु रूप धरन में,
    सुर नर मुनि सब होत सुखी की॥

    आरती श्री रामचंद्र जी की॥

    राजत जनकपुर धाम में,
    अवधपुरी में सिय राम जी।
    भक्तन के मन मंदिर में,
    बसत सदा सुखधाम जी॥

    आरती श्री रामचंद्र जी की॥.`,

    "Ram Raksha Stotram": `॥ श्री राम रक्षा स्तोत्रम् ॥

अस्य श्रीरामरक्षास्तोत्रमन्त्रस्य ।
बुधकौशिक ऋषिः ।
श्रीसीतारामचन्द्रो देवता ।
अनुष्टुप् छन्दः ।
सीता शक्तिः ।
श्रीमद् हनुमान् कीलकम् ।
श्रीरामचन्द्रप्रीत्यर्थे रामरक्षास्तोत्रजपे विनियोगः ॥

॥ ध्यानम् ॥

ध्यायेदाजानुबाहुं धृतशरधनुषं बद्धपद्मासनस्थं
पीतं वासो वसानं नवकमलदलस्पर्धिनेत्रं प्रसन्नम् ।
वामाङ्कारूढसीतामुखकमलमिलल्लोचनं नीरदाभं
नानालङ्कारदीप्तं दधतमुरुजटामण्डनं रामचन्द्रम् ॥

चरितं रघुनाथस्य शतकोटिप्रविस्तरम् ।
एकैकमक्षरं पुंसां महापातकनाशनम् ॥

ध्यात्वा नीलोत्पलश्यामं रामं राजीवलोचनम् ।
जानकीलक्ष्मणोपेतं जटामुकुटमण्डितम् ॥

सासितूणधनुर्बाणपाणिं नक्तञ्चरान्तकम् ।
स्वलीलया जगत्त्रातुमाविर्भूतमजं विभुम् ॥

रामरक्षां पठेत्प्राज्ञः पापघ्नीं सर्वकामदाम् ।
शिरो मे राघवः पातु भालं दशरथात्मजः ॥

कौसल्येयो दृशौ पातु विश्वामित्रप्रियः श्रुती ।
घ्राणं पातु मखत्राता मुखं सौमित्रिवत्सलः ॥

जिह्वां विद्यानिधिः पातु कण्ठं भरतवन्दितः ।
स्कन्धौ दिव्यायुधः पातु भुजौ भग्नेशकार्मुकः ॥

करौ सीतापतिः पातु हृदयं जामदग्न्यजित् ।
मध्यं पातु खरध्वंसी नाभिं जाम्बवदाश्रयः ॥

सुग्रीवेशः कटी पातु सक्थिनी हनुमत्प्रभुः ।
ऊरू रघूत्तमः पातु रक्षःकुलविनाशकृत् ॥

जानुनी सेतुकृत्पातु जङ्घे दशमुखान्तकः ।
पादौ बिभीषणश्रीदः पातु रामोऽखिलं वपुः ॥

एतां रामबलोपेतां रक्षां यः सुकृती पठेत् ।
स चिरायुः सुखी पुत्री विजयी विनयी भवेत् ॥

पातालभूतलव्योमचारिणश्छद्मचारिणः ।
न द्रष्टुमपि शक्तास्ते रक्षितं रामनामभिः ॥

रामेति रामभद्रेति रामचन्द्रेति वा स्मरन् ।
नरो न लिप्यते पापैर्भुक्तिं मुक्तिं च विन्दति ॥

जगज्जैत्रैकमन्त्रेण रामनाम्नाभिरक्षितम् ।
यः कण्ठे धारयेत्तस्य करस्थाः सर्वसिद्धयः ॥

वज्रपञ्जरनामेदं यो रामकवचं स्मरेत् ।
अव्याहताज्ञः सर्वत्र लभते जयमङ्गलम् ॥

आदिष्टवान् यथा स्वप्ने रामरक्षामिमां हरः ।
तथा लिखितवान् प्रातः प्रबुद्धो बुधकौशिकः ॥

आरामः कल्पवृक्षाणां विरामः सकलापदाम् ।
अभिरामस्त्रिलोकानां रामः श्रीमान् स नः प्रभुः ॥

तरुणौ रूपसम्पन्नौ सुकुमारौ महाबलौ ।
पुण्डरीकविशालाक्षौ चीरकृष्णाजिनाम्बरौ ॥

फलमूलाशिनौ दान्तौ तापसौ ब्रह्मचारिणौ ।
पुत्रौ दशरथस्यैतौ भ्रातरौ रामलक्ष्मणौ ॥

शरण्यौ सर्वसत्त्वानां श्रेष्ठौ सर्वधनुष्मताम् ।
रक्षःकुलनिहन्तारौ त्रायेतां नो रघूत्तमौ ॥

आत्तसज्जधनुषाविषुस्पृशा वक्षया शुगनिषङ्गसङ्गिनौ ।
रक्षणाय मम रामलक्ष्मणावग्रतः पथि सदैव गच्छताम् ॥

सन्नद्धः कवची खड्गी चापबाणधरो युवा ।
गच्छन्मनोरथोऽस्माकं रामः पातु सलक्ष्मणः ॥

रामो दाशरथिः शूरो लक्ष्मणानुचरो बली ।
काकुत्स्थः पुरुषः पूर्णः कौसल्येयो रघूत्तमः ॥

वेदान्तवेद्यो यज्ञेशः पुराणपुरुषोत्तमः ।
जानकीवल्लभः श्रीमानप्रमेयपराक्रमः ॥

इत्येतानि जपेन्नित्यं मद्भक्तः श्रद्धयान्वितः ।
अश्वमेधाधिकं पुण्यं सम्प्राप्नोति न संशयः ॥

रामं दूर्वादलश्यामं पद्माक्षं पीतवाससम् ।
स्तुवन्ति नामभिर्दिव्यैर्न ते संसारिणो नराः ॥

रामं लक्ष्मणपूर्वजं रघुवरं सीतापतिं सुन्दरम् ।
काकुत्स्थं करुणार्णवं गुणनिधिं विप्रप्रियं धार्मिकम् ॥

राजेन्द्रं सत्यसन्धं दशरथतनयं श्यामलं शान्तमूर्तिम् ।
वन्दे लोकाभिरामं रघुकुलतिलकं राघवं रावणारिम् ॥

रामाय रामभद्राय रामचन्द्राय वेधसे ।
रघुनाथाय नाथाय सीतायाः पतये नमः ॥

श्रीराम राम रघुनन्दन राम राम ।
श्रीराम राम भरताग्रज राम राम ।
श्रीराम राम रणकर्कश राम राम ।
श्रीराम राम शरणं भव राम राम ॥

श्रीरामचन्द्रचरणौ मनसा स्मरामि ।
श्रीरामचन्द्रचरणौ वचसा गृणामि ।
श्रीरामचन्द्रचरणौ शिरसा नमामि ।
श्रीरामचन्द्रचरणौ शरणं प्रपद्ये ॥

माता रामो मत्पिता रामचन्द्रः ।
स्वामी रामो मत्सखा रामचन्द्रः ।
सर्वस्वं मे रामचन्द्रो दयालुः ।
नान्यं जाने नैव जाने न जाने ॥

दक्षिणे लक्ष्मणो यस्य वामे च जनकात्मजा ।
पुरतो मारुतिर्यस्य तं वन्दे रघुनन्दनम् ॥

लोकाभिरामं रणरङ्गधीरं
राजीवनेत्रं रघुवंशनाथम् ।
कारुण्यरूपं करुणाकरं तं
श्रीरामचन्द्रं शरणं प्रपद्ये ॥

मनोजवं मारुततुल्यवेगं
जितेन्द्रियं बुद्धिमतां वरिष्ठम् ।
वातात्मजं वानरयूथमुख्यं
श्रीरामदूतं शरणं प्रपद्ये ॥

कूजन्तं रामरामेति मधुरं मधुराक्षरम् ।
आरुह्य कविताशाखां वन्दे वाल्मीकिकोकिलम् ॥

आपदामपहर्तारं दातारं सर्वसम्पदाम् ।
लोकाभिरामं श्रीरामं भूयो भूयो नमाम्यहम् ॥

भर्जनं भवबीजानामर्जनं सुखसम्पदाम् ।
तर्जनं यमदूतानां रामरामेति गर्जनम् ॥

रामो राजमणिः सदा विजयते रामं रमेशं भजे ।
रामेणाभिहता निशाचरचमू रामाय तस्मै नमः ।
रामान्नास्ति परायणं परतरं रामस्य दासोऽस्म्यहम् ।
रामे चित्तलयः सदा भवतु मे भो राम मामुद्धर ॥

राम रामेति रामेति रमे रामे मनोरमे ।
सहस्रनाम तत्तुल्यं रामनाम वरानने ॥

॥ इति श्रीबुधकौशिकविरचितं श्रीरामरक्षास्तोत्रं सम्पूर्णम् ॥`,
    "Om Jai Jagdish Hare": `॥ ॐ जय जगदीश हरे ॥

ॐ जय जगदीश हरे,
स्वामी जय जगदीश हरे।
भक्त जनों के संकट,
दास जनों के संकट,
क्षण में दूर करे॥
ॐ जय जगदीश हरे॥

जो ध्यावे फल पावे,
दुःख बिनसे मन का।
स्वामी दुःख बिनसे मन का।
सुख सम्पत्ति घर आवे,
कष्ट मिटे तन का॥
ॐ जय जगदीश हरे॥

मात-पिता तुम मेरे,
शरण गहूँ मैं किसकी।
स्वामी शरण गहूँ मैं किसकी।
तुम बिन और न दूजा,
आस करूँ मैं जिसकी॥
ॐ जय जगदीश हरे॥

तुम पूरण परमात्मा,
तुम अन्तर्यामी।
स्वामी तुम अन्तर्यामी।
पारब्रह्म परमेश्वर,
तुम सबके स्वामी॥
ॐ जय जगदीश हरे॥

तुम करुणा के सागर,
तुम पालनकर्ता।
स्वामी तुम पालनकर्ता।
मैं मूरख खल कामी,
कृपा करो भर्ता॥
ॐ जय जगदीश हरे॥

तुम हो एक अगोचर,
सबके प्राणपति।
स्वामी सबके प्राणपति।
किस विधि मिलूँ दयामय,
तुमको मैं कुमति॥
ॐ जय जगदीश हरे॥

दीनबन्धु दुःखहर्ता,
तुम रक्षक मेरे।
स्वामी तुम रक्षक मेरे।
अपने हाथ उठाओ,
द्वार पड़ा तेरे॥
ॐ जय जगदीश हरे॥

विषय-विकार मिटाओ,
पाप हरो देवा।
स्वामी पाप हरो देवा।
श्रद्धा-भक्ति बढ़ाओ,
सन्तन की सेवा॥
ॐ जय जगदीश हरे॥

तन-मन-धन सब है तेरा,
स्वामी सब कुछ है तेरा।
तेरा तुझको अर्पण,
क्या लागे मेरा॥
ॐ जय जगदीश हरे॥

ॐ जय जगदीश हरे,
स्वामी जय जगदीश हरे।
भक्त जनों के संकट,
दास जनों के संकट,
क्षण में दूर करे॥
ॐ जय जगदीश हरे॥`,
    "Aarti Kunj Bihari Ki": `आरती कुंजबिहारी की,
श्री गिरिधर कृष्ण मुरारी की ॥
आरती कुंजबिहारी की,
श्री गिरिधर कृष्ण मुरारी की ॥

गले में बैजंती माला, बजावै मुरली मधुर बाला । श्रवण में कुण्डल झलकाला, नंद के आनंद नंदलाला ।
गगन सम अंग कांति काली, राधिका चमक रही आली । लतन में ठाढ़े बनमाली भ्रमर सी अलक,
कस्तूरी तिलक, चंद्र सी झलक, ललित छवि श्यामा प्यारी की, श्री गिरिधर कृष्ण मुरारी की ॥
॥ आरती कुंजबिहारी की...॥

कनकमय मोर मुकुट बिलसै, देवता दरसन को तरसैं । गगन सों सुमन रासि बरसै । बजे मुरचंग,
मधुर मिरदंग, ग्वालिन संग, अतुल रति गोप कुमारी की, श्री गिरिधर कृष्णमुरारी की ॥
॥ आरती कुंजबिहारी की...॥

जहां ते प्रकट भई गंगा, सकल मन हारिणि श्री गंगा । स्मरन ते होत मोह भंगा बसी शिव सीस,
जटा के बीच, हरै अघ कीच, चरन छवि श्रीबनवारी की, श्री गिरिधर कृष्णमुरारी की ॥
॥ आरती कुंजबिहारी की...॥

चमकती उज्ज्वल तट रेनू, बज रही वृंदावन बेनू । चहुं दिसि गोपि ग्वाल धेनू हंसत मृदु मंद,
चांदनी चंद, कटत भव फंद, टेर सुन दीन दुखारी की, श्री गिरिधर कृष्णमुरारी की ॥
॥ आरती कुंजबिहारी की...॥

आरती कुंजबिहारी की,
श्री गिरिधर कृष्ण मुरारी की ॥
आरती कुंजबिहारी की,
श्री गिरिधर कृष्ण मुरारी की ॥

`,
    "Achyutam Keshavam": `॥ श्री अच्युताष्टकम् ॥

अच्युतं केशवं रामनारायणं
कृष्णदामोदरं वासुदेवं हरिम्।
श्रीधरं माधवं गोपिकावल्लभं
जानकीनायकं रामचन्द्रं भजे॥१॥

अच्युतं केशवं सत्यभामाधवं
माधवं श्रीधरं राधिकाराधितम्।
इन्दिरामन्दिरं चेतसा सुन्दरं
देवकीनन्दनं नन्दजं सन्दधे॥२॥

विष्णवे जिष्णवे शङ्खिने चक्रिणे
रुक्मिणीरागिणे जानकीजानये।
वल्लवीवल्लभायार्चितायात्मने
कंसविध्वंसिने वंशिने ते नमः॥३॥

कृष्ण गोविन्द हे राम नारायण
श्रीपते वासुदेवाजित श्रीनिधे।
अच्युतानन्त हे माधवाधोक्षज
द्वारकानायक द्रौपदीरक्षक॥४॥

राक्षसक्षोभितः सीतया शोभितो
दण्डकारण्यभूपुण्यताकारणः।
लक्ष्मणेनान्वितो वानरैः सेवितो
अगस्त्यसम्पूजितो राघवः पातु माम्॥५॥

धेनुकारिष्टकानिष्टकृद्द्वेषिहा
केशिहा कंसहृद्वंशिकावादकः।
पूतनाकोपकः सूरजाखेलनो
बालगोपालकः पातु मां सर्वदा॥६॥

विद्युदुद्योतवत्प्रस्फुरद्वाससं
प्रावृडम्भोदवत्प्रोल्लसद्विग्रहम्।
वन्यया मालया शोभितोरःस्थलं
लोहिताङ्घ्रिद्वयं वारिजाक्षं भजे॥७॥

कुञ्चितैः कुन्तलैर्भ्राजमानाननं
रत्नमौलिं लसत्कुण्डलं गण्डयोः।
हारकेयूरकं कङ्कणप्रोज्ज्वलं
किङ्किणीमञ्जुलं श्यामलं तं भजे॥८॥

अच्युतस्याष्टकं यः पठेदिष्टदं
प्रेमतः प्रत्यहं पुरुषः सस्पृहम्।
वृत्ततः सुन्दरं कर्तृविश्वम्भरः
तस्य वश्यो हरिर्जायते सत्वरम्॥९॥`,
    "Vishnu Sahasranama": `
    ॥ ॐ श्री परमात्मने नमः ॥

नारायणं नमस्कृत्य नरं चैव नरोत्तमम्।
देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत्॥

॥ अथ श्री विष्णु सहस्रनाम स्तोत्रम् ॥

शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।
प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥१॥

यस्य द्विरदवक्त्राद्याः पारिषद्याः परः शतम्।
विघ्नं निघ्नन्ति सततं विष्वक्सेनं तमाश्रये॥२॥

व्यासं वसिष्ठनप्तारं शक्तेः पौत्रमकल्मषम्।
पराशरात्मजं वन्दे शुकतातं तपोनिधिम्॥३॥

व्यासाय विष्णुरूपाय व्यासरूपाय विष्णवे।
नमो वै ब्रह्मनिधये वासिष्ठाय नमो नमः॥४॥

अविकाराय शुद्धाय नित्याय परमात्मने।
सदैकरूपरूपाय विष्णवे सर्वजिष्णवे॥५॥

यस्य स्मरणमात्रेण जन्मसंसारबन्धनात्।
विमुच्यते नमस्तस्मै विष्णवे प्रभविष्णवे॥६॥

ॐ नमो विष्णवे प्रभविष्णवे॥

॥ ध्यानम् ॥

क्षीरोदन्वत्प्रदेशे शुचिमणिविलसत्सैकते मौक्तिकानां
मालाक्लृप्तासनस्थः स्फटिकमणिनिभैर्मौक्तिकैर्मण्डिताङ्गः।
शुभ्रैरभ्रैरदभ्रैरुपरिविरचितैर्मुक्तपीयूषवर्षैः
आनन्दी नः पुनीयादरिनलिनगदाशङ्खपाणिर्मुकुन्दः॥

भूः पादौ यस्य नाभिर्वियदसुरनिलश्चन्द्रसूर्यौ च नेत्रे
कर्णावाशाः शिरो द्यौर्मुखमपि दहनो यस्य वास्तेयमब्धिः।
अन्तःस्थं यस्य विश्वं सुरनरखगगोभोगिगन्धर्वदैत्यैः
चित्रं रंरम्यते तं त्रिभुवनवपुं विष्णुमीशं नमामि॥

ॐ नमो भगवते वासुदेवाय॥

शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं
विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्।
लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यम्
वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥

मेघश्यामं पीतकौशेयवासं
श्रीवत्साङ्कं कौस्तुभोद्भासिताङ्गम्।
पुण्योपेतं पुण्डरीकायताक्षं
विष्णुं वन्दे सर्वलोकैकनाथम्॥

नमः समस्तभूतानामादिभूताय भूभृते।
अनेक रूपरूपाय विष्णवे प्रभविष्णवे॥

हरिः ॐ॥

ॐ विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः।
भूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः॥१॥

पूतात्मा परमात्मा च मुक्तानां परमा गतिः।
अव्ययः पुरुषः साक्षी क्षेत्रज्ञोऽक्षर एव च॥२॥

योगो योगविदां नेता प्रधानपुरुषेश्वरः।
नारसिंहवपुः श्रीमान् केशवः पुरुषोत्तमः॥३॥

सर्वः शर्वः शिवः स्थाणुर्भूतादिर्निधिरव्ययः।
सम्भवो भावनो भर्ता प्रभवः प्रभुरीश्वरः॥४॥

स्वयम्भूः शम्भुरादित्यः पुष्कराक्षो महास्वनः।
अनादिनिधनो धाता विधाता धातुरुत्तमः॥५॥

अप्रमेयो हृषीकेशः पद्मनाभोऽमरप्रभुः।
विश्वकर्मा मनुस्त्वष्टा स्थविष्ठः स्थविरो ध्रुवः॥६॥

अग्राह्यः शाश्वतः कृष्णो लोहिताक्षः प्रतर्दनः।
प्रभूतस्त्रिककुब्धाम पवित्रं मङ्गलं परम्॥७॥

ईशानः प्राणदः प्राणो ज्येष्ठः श्रेष्ठः प्रजापतिः।
हिरण्यगर्भो भूगर्भो माधवो मधुसूदनः॥८॥

ईश्वरो विक्रमी धन्वी मेधावी विक्रमः क्रमः।
अनुत्तमो दुराधर्षः कृतज्ञः कृतिरात्मवान्॥९॥

सुरेशः शरणं शर्म विश्वरेताः प्रजाभवः।
अहः संवत्सरो व्यालः प्रत्ययः सर्वदर्शनः॥१०॥

अजः सर्वेश्वरः सिद्धः सिद्धिः सर्वादिरच्युतः।
वृषाकपिरमेयात्मा सर्वयोगविनिःसृतः॥११॥

वसुर्वसुमना सत्यः समात्मा सम्मितः समः।
अमोघः पुण्डरीकाक्षो वृषकर्मा वृषाकृतिः॥१२॥

रुद्रो बहुशीर्षा बभ्रुर्विश्वयोनिः शुचिश्रवाः।
अमृतः शाश्वतस्थाणुर्वरारोहो महातपाः॥१३॥

सर्वगः सर्वविद्भानुर्विष्वक्सेनो जनार्दनः।
वेदो वेदविदव्यङ्गो वेदाङ्गो वेदवित् कविः॥१४॥

लोकाध्यक्षः सुराध्यक्षो धर्माध्यक्षः कृताकृतः।
चतुरात्मा चतुर्व्यूहश्चतुर्दंष्ट्रश्चतुर्भुजः॥१५॥

भ्राजिष्णुर्भोजनं भोक्ता सहिष्णुर्जगदादिजः।
अनघो विजयो जेता विश्वयोनिः पुनर्वसुः॥१६॥

उपेन्द्रो वामनः प्रांशुरमोघः शुचिरूर्जितः।
अतीन्द्रः संग्रहः सर्गो धृतात्मा नियमो यमः॥१७॥

वेद्यो वैद्यः सदायोगी वीरहा माधवो मधुः।
अतीन्द्रियो महामायो महोत्साहो महाबलः॥१८॥

महाबुद्धिर्महावीर्यो महाशक्तिर्महाद्युतिः।
अनिर्देश्यवपुः श्रीमानमेयात्मा महाद्रिधृक्॥१९॥

महेष्वासो महीभर्ता श्रीनिवासः सतां गतिः।
अनिरुद्धः सुरानन्दो गोविन्दो गोविदां पतिः॥२०॥

मरीचिर्दमनो हंसः सुपर्णो भुजगोत्तमः।
हिरण्यनाभः सुतपाः पद्मनाभः प्रजापतिः॥२१॥

अमृत्युः सर्वदृक् सिंहः सन्धाता सन्धिमान् स्थिरः।
अजो दुर्मर्षणः शास्ता विश्रुतात्मा सुरारिहा॥२२॥

गुरुर्गुरुतमो धाम सत्यः सत्यपराक्रमः।
निमिषोऽनिमिषः स्रग्वी वाचस्पतिरुदारधीः॥२३॥

अग्रणीर्ग्रामणीः श्रीमान् न्यायो नेता समीरणः।
सहस्रमूर्धा विश्वात्मा सहस्राक्षः सहस्रपात्॥२४॥

आवर्तनो निवृत्तात्मा संवृतः सम्प्रमर्दनः।
अहः संवर्तको वह्निरनिलो धरणीधरः॥२५॥

सुप्रसादः प्रसन्नात्मा विश्वधृग्विश्वभुग्विभुः।
सत्कर्ता सत्कृतः साधुर्जह्नुनारायणो नरः॥२६॥

असंख्येयोऽप्रमेयात्मा विशिष्टः शिष्टकृच्छुचिः।
सिद्धार्थः सिद्धसङ्कल्पः सिद्धिदः सिद्धिसाधनः॥२७॥

वृषाही वृषभो विष्णुर्वृषपर्वा वृषोदरः।
वर्धनो वर्धमानश्च विविक्तः श्रुतिसागरः॥२८॥

सुभुजो दुर्धरो वाग्मी महेन्द्रो वसुदो वसुः।
नैकरूपो बृहद्रूपः शिपिविष्टः प्रकाशनः॥२९॥

ओजस्तेजोद्युतिधरः प्रकाशात्मा प्रतापनः।
ऋद्धः स्पष्टाक्षरो मन्त्रश्चन्द्रांशुर्भास्करद्युतिः॥३०॥

अमृतांशूद्भवो भानुः शशबिन्दुः सुरेश्वरः।
औषधं जगतः सेतुः सत्यधर्मपराक्रमः॥३१॥

भूतभव्यभवन्नाथः पवनः पावनोऽनलः।
कामहा कामकृत्कान्तः कामः कामप्रदः प्रभुः॥३२॥

युगादिकृद्युगावर्तो नैकमायो महाशनः।
अदृश्यो व्यक्तरूपश्च सहस्रजिदनन्तजित्॥३३॥

इष्टोऽविशिष्टः शिष्टेष्टः शिखण्डी नहुषो वृषः।
क्रोधहा क्रोधकृत्कर्ता विश्वबाहुर्महीधरः॥३४॥

अच्युतः प्रथितः प्राणः प्राणदो वासवानुजः।
अपांनिधिरधिष्ठानमप्रमत्तः प्रतिष्ठितः॥३५॥

स्कन्दः स्कन्दधरो धुर्यो वरदो वायुवाहनः।
वासुदेवो बृहद्भानुरादिदेवः पुरन्दरः॥३६॥

अशोकस्तारणस्तारः शूरः शौरिर्जनेश्वरः।
अनुकूलः शतावर्तः पद्मी पद्मनिभेक्षणः॥३७॥

पद्मनाभोऽरविन्दाक्षः पद्मगर्भः शरीरभृत्।
महर्द्धिरृद्धो वृद्धात्मा महाक्षो गरुडध्वजः॥३८॥

अतुलः शरभो भीमः समयज्ञो हविर्हरिः।
सर्वलक्षणलक्षण्यो लक्ष्मीवान् समितिञ्जयः॥३९॥

विक्षरो रोहितो मार्गो हेतुर्दामोदरः सहः।
महीधरो महाभागो वेगवानमिताशनः॥४०॥


`,
    "Govinda Namavali": `॥ श्री गोविन्द नामावली ॥

गोविन्दा गोविन्दा गोविन्दा।
गोविन्दा गोविन्दा गोविन्दा॥

श्री गोविन्दा, हरि गोविन्दा।
गोपाल गोविन्दा, गोविन्दा॥

वेंकट रमणा गोविन्दा।
वेंकटेश्वर गोविन्दा॥

श्रीपति गोविन्दा।
लक्ष्मीपति गोविन्दा॥

वासुदेव गोविन्दा।
देवकीनन्दन गोविन्दा॥

नन्दनन्दन गोविन्दा।
नवनीतचोर गोविन्दा॥

गोवर्धनधारी गोविन्दा।
गोकुलनन्दन गोविन्दा॥

मुरलीमनोहर गोविन्दा।
मधुसूदन गोविन्दा॥

माधव गोविन्दा।
केशव गोविन्दा॥

दामोदर गोविन्दा।
पद्मनाभ गोविन्दा॥

पुण्डरीकाक्ष गोविन्दा।
परमदयाल गोविन्दा॥

भक्तवत्सल गोविन्दा।
दीनदयाल गोविन्दा॥

राधारमण गोविन्दा।
रुक्मिणीरमण गोविन्दा॥

सीताराम गोविन्दा।
श्रीकृष्ण गोविन्दा॥

अनन्तशयन गोविन्दा।
आनन्दमूर्ति गोविन्दा॥

शरणागतवत्सल गोविन्दा।
सर्वलोकनाथ गोविन्दा॥

गोविन्दा गोविन्दा गोविन्दा।
श्री वेंकटेश गोविन्दा॥`,
    "Jai Ganesh Deva": `जय गणेश, जय गणेश, जय गणेश देवा।
माता जाकी पार्वती, पिता महादेवा॥

एकदंत दयावंत, चार भुजाधारी।
माथे पर तिलक सोहे, मूसे की सवारी॥

जय गणेश, जय गणेश, जय गणेश देवा।
माता जाकी पार्वती, पिता महादेवा॥

पान चढ़े, फूल चढ़े और चढ़े मेवा।
लड्डुअन का भोग लगे, संत करें सेवा॥

जय गणेश, जय गणेश, जय गणेश देवा।
माता जाकी पार्वती, पिता महादेवा॥

अंधन को आँख देत, कोढ़िन को काया।
बाँझन को पुत्र देत, निर्धन को माया॥

जय गणेश, जय गणेश, जय गणेश देवा।
माता जाकी पार्वती, पिता महादेवा॥

सूर श्याम शरण आए, सफल कीजे सेवा।
माता जाकी पार्वती, पिता महादेवा॥

जय गणेश, जय गणेश, जय गणेश देवा।
माता जाकी पार्वती, पिता महादेवा॥`,
    "Sukhkarta Dukhharta": `सुखकर्ता दुखहर्ता वार्ता विघ्नाची।
नुरवी पुरवी प्रेम कृपा जयाची॥

सर्वांगी सुंदर उटी शेंदुराची।
कंठी झलके माल मुक्ताफलांची॥

जय देव जय देव, जय मंगलमूर्ति।
दर्शनमात्रे मनकामना पूर्ति॥

रत्नखचित फरा तुज गौरीकुमरा।
चंदनाची उटी कुंकुम केशरा॥

हिरे जड़ित मुकुट शोभतो बरा।
रुणझुणती नूपुरे चरणी घागरिया॥

जय देव जय देव, जय मंगलमूर्ति।
दर्शनमात्रे मनकामना पूर्ति॥

लंबोदर पीतांबर फणिवर बंधना।
सरळ सोंड वक्रतुंड त्रिनयना॥

दास रामाचा वाट पाहे सदना।
संकटी पावावे निर्वाणी रक्षावे।
सुरवर वंदना॥

जय देव जय देव, जय मंगलमूर्ति।
दर्शनमात्रे मनकामना पूर्ति॥`,
    "Vakratunda Mahakaya": `वक्रतुंड महाकाय
सूर्यकोटि समप्रभ।

निर्विघ्नं कुरु मे देव
सर्वकार्येषु सर्वदा॥`,
    "Shri Ganesh Vandana": `**श्री गणेश वंदना (जय गणेश जय गणेश देवा)**
जय गणेश जय गणेश जय गणेश देवा\
माता जाकी पार्वती पिता महादेवा ॥ (टेर) 
एक दंत दयावंत चार भुजा धारी\
मं सिंदूर चढ़े और संग की सवारी ॥\
हार चढ़े फूल चढ़े और चढ़े मेवा\
लड्डुअन का भोग लगे संत करें सेवा ॥  
जय गणेश जय गणेश जय गणेश देवा\
माता जाकी पार्वती पिता महादेवा ॥ 
अंधन को आँख देत कोढ़िन को काया\
बाँझन को पुत्र देत निर्धन को माया ॥\
‘सूर’ श्याम शरण आए मोहे पावन कीजै\
इनन की जैसी भावना तैसी फल दीजै ॥ 
जय गणेश जय गणेश जय गणेश देवा\
माता जाकी पार्वती पिता महादेवा ॥  `,
    "Om Jai Shiv Omkara": `ॐ जय शिव ओंकारा,
हर जय शिव ओंकारा।
ब्रह्मा, विष्णु, सदाशिव,
अर्द्धांगी धारा॥

ॐ जय शिव ओंकारा॥

एकानन चतुरानन पंचानन राजे।
हंसासन गरुड़ासन वृषवाहन साजे॥

ॐ जय शिव ओंकारा॥

दो भुज चार चतुर्भुज दशभुज ते सोहे।
तीनों रूप निरखता त्रिभुवन जन मोहे॥

ॐ जय शिव ओंकारा॥

अक्षमाला वनमाला मुण्डमाला धारी।
चंदन मृगमद चंदा भोले शुभकारी॥

ॐ जय शिव ओंकारा॥

श्वेताम्बर पीताम्बर बाघम्बर अंगे।
सनकादिक गरुड़ादिक भूतादिक संगे॥

ॐ जय शिव ओंकारा॥

करमध्ये कमण्डलु चक्र त्रिशूल धर्ता।
जगकर्ता जगभर्ता जगसंहारकर्ता॥

ॐ जय शिव ओंकारा॥

ब्रह्मा विष्णु सदाशिव जानत अविवेका।
प्रणवाक्षर के मध्ये ये तीनों एका॥

ॐ जय शिव ओंकारा॥

त्रिगुण स्वामी की आरती जो कोई नर गावे।
भक्त कहत शिवानंद स्वामी मनवांछित फल पावे॥

ॐ जय शिव ओंकारा॥`,
    "Shiv Chalisa": `
    ॥ दोहा ॥
    जय गणेश गिरिजा सुवन, मंगल मूल सुजान।
कहत अयोध्यादास तुम, देहु अभय वरदान॥

जय गिरिजा पति दीन दयाला।
सदा करत सन्तन प्रतिपाला॥

भाल चन्द्रमा सोहत नीके।
कानन कुण्डल नागफनी के॥

अंग गौर शिर गंग बहाये।
मुण्डमाल तन छार लगाये॥

वस्त्र खाल बाघम्बर सोहे।
छवि को देखि नाग मुनि मोहे॥

मैना मातु की ह्वै दुलारी।
बाम अंग सोहत छवि न्यारी॥

कर त्रिशूल सोहत छवि भारी।
करत सदा शत्रुन क्षयकारी॥

नन्दि गणेश सोहै तहँ कैसे।
सागर मध्य कमल हैं जैसे॥

कार्तिक श्याम और गणराऊ।
या छवि को कहि जात न काऊ॥

देवन जबहीं जाय पुकारा।
तब ही दुख प्रभु आप निवारा॥

किया उपद्रव तारक भारी।
देवन सब मिलि तुमहिं जुहारी॥

तुरत षडानन आप पठायउ।
लवनिमेष महँ मारि गिरायउ॥

आप जलंधर असुर संहारा।
सुयश तुम्हार विदित संसारा॥

त्रिपुरासुर सन युद्ध मचाई।
सबहि कृपा कर लीन बचाई॥

किया तपहिं भागीरथ भारी।
पुरब प्रतिज्ञा तसु पुरारी॥

दानिन महँ तुम सम कोउ नाहीं।
सेवक स्तुति करत सदाहीं॥

वेद नाम महिमा तव गाई।
अकथ अनादि भेद नहीं पाई॥

प्रकटी उदधि मंथन में ज्वाला।
जरे सुरासुर भये विहाला॥

कीन्ह दया तहं करी सहाई।
नीलकण्ठ तब नाम कहाई॥

पूजन रामचन्द्र जब कीन्हा।
जीत के लंक विभीषण दीन्हा॥

सहस कमल में हो रहे धारी।
कीन्ह परीक्षा तबहिं पुरारी॥

एक कमल प्रभु राखेउ जोई।
कमल नयन पूजन चहं सोई॥

कठिन भक्ति देखी प्रभु शंकर।
भये प्रसन्न दिए इच्छित वर॥

जय जय जय अनन्त अविनाशी।
करत कृपा सब के घटवासी॥

दुष्ट सकल नित मोहि सतावै।
भ्रमत रहे मोहि चैन न आवै॥

त्राहि त्राहि मैं नाथ पुकारो।
येहि अवसर मोहि आन उबारो॥

लै त्रिशूल शत्रुन को मारो।
संकट से मोहि आन उबारो॥

मात-पिता भ्राता सब कोई।
संकट में पूछत नहिं कोई॥

स्वामी एक है आस तुम्हारी।
आय हरहु अब संकट भारी॥

धन निर्धन को देत सदा ही।
जो कोई जाँचै सो फल पाहीं॥

अस्तुति केहि विधि करौं तुम्हारी।
क्षमहु नाथ अब चूक हमारी॥

शंकर हो संकट के नाशन।
मंगल कारण विघ्न विनाशन॥

योगी यति मुनि ध्यान लगावैं।
नारद शारद शीश नवावैं॥

नमो नमो जय नमः शिवाय।
सुर ब्रह्मादिक पार न पाय॥

जो यह पाठ करे मन लाई।
ता पर होत है शम्भु सहाई॥

ऋनियाँ जो कोई हो अधिकारी।
पाठ करे सो पावन हारी॥

पुत्र होन की इच्छा जोई।
निश्चय शिव प्रसाद तेहि होई॥

पण्डित त्रयोदशी को लावे।
ध्यान पूर्वक होम करावे॥

त्रयोदशी व्रत करे हमेशा।
ताके तन नहीं रहे कलेशा॥

धूप दीप नैवेद्य चढ़ावे।
शंकर सम्मुख पाठ सुनावे॥

जन्म जन्म के पाप नसावे।
अन्तवास शिवपुर में पावे॥

कहैं अयोध्यादास आस तुम्हारी।
जानि सकल दुःख हरहु हमारी॥

नित्त नेम उठि प्रातः ही, पाठ करो चालीस।
तुम मेरी मनोकामना, पूर्ण करो जगदीश॥

॥ दोहा ॥
मगसर छठि हेमन्त ऋतु, संवत चौसठ जान।
अस्तुति चालीसा शिवहि, पूर्ण कीन कल्याण॥
`,
    "Maha Mrityunjaya Mantra": `
    ॐ त्र्यम्बकं यजामहे
सुगन्धिं पुष्टिवर्धनम्।

उर्वारुकमिव बन्धनान्
मृत्योर्मुक्षीय मामृतात्॥`,
    "Jai Ambe Gauri": `जय अम्बे गौरी, मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी॥

मांग सिंदूर विराजत, टीको मृगमद को।
उज्ज्वल से दो नैना, चंद्रवदन नीको॥

जय अम्बे गौरी...

कनक समान कलेवर, रक्ताम्बर राजै।
रक्तपुष्प गल माला, कंठन पर साजै॥

जय अम्बे गौरी...

केहरि वाहन राजत, खड्ग खप्पर धारी।
सुर-नर-मुनिजन सेवत, तिनके दुखहारी॥

जय अम्बे गौरी...

कानन कुण्डल शोभित, नासाग्रे मोती।
कोटिक चंद्र दिवाकर, राजत सम ज्योति॥

जय अम्बे गौरी...

शुम्भ-निशुम्भ विदारे, महिषासुर घाती।
धूम्र विलोचन नैना, निशदिन मदमाती॥

जय अम्बे गौरी...

चण्ड-मुण्ड संहारे, शोणित बीज हरे।
मधु-कैटभ दोऊ मारे, सुर भयहीन करे॥

जय अम्बे गौरी...

ब्रह्माणी रुद्राणी, तुम कमला रानी।
आगम निगम बखानी, तुम शिव पटरानी॥

जय अम्बे गौरी...

चौंसठ योगिनी मंगल गावत, नृत्य करत भैरों।
बाजत ताल मृदंगा, अरु बाजत डमरू॥

जय अम्बे गौरी...

तुम ही जग की माता, तुम ही हो भरता।
भक्तन की दुख हरता, सुख संपत्ति करता॥

जय अम्बे गौरी...

भुजा चार अति शोभित, खड्ग खप्पर धारी।
मनवांछित फल पावत, सेवत नर नारी॥

जय अम्बे गौरी...

कंचन थाल विराजत, अगर कपूर बाती।
श्रीमालकेतु में राजत, कोटि रतन ज्योति॥

जय अम्बे गौरी...

अम्बे जी की आरती, जो कोई नर गावे।
कहत शिवानंद स्वामी, सुख-संपत्ति पावे॥

जय अम्बे गौरी, मैया जय श्यामा गौरी।
तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी॥`,
    "Durga Chalisa": `॥ दोहा ॥

नमो नमो दुर्गे सुख करनी।
नमो नमो अम्बे दुःख हरनी॥

निरंकार है ज्योति तुम्हारी।
तिहूँ लोक फैली उजियारी॥

॥ चौपाई ॥

शशि ललाट मुख महाविशाला।
नेत्र लाल भृकुटि विकराला॥

रूप मातु को अधिक सुहावे।
दरश करत जन अति सुख पावे॥

तुम संसार शक्ति लय कीना।
पालन हेतु अन्न धन दीना॥

अन्नपूर्णा हुई जग पाला।
तुम ही आदि सुन्दरी बाला॥

प्रलयकाल सब नाशन हारी।
तुम गौरी शिवशंकर प्यारी॥

शिव योगी तुम्हरे गुण गावें।
ब्रह्मा विष्णु तुम्हें नित ध्यावें॥

रूप सरस्वती को तुम धारा।
दे सुबुद्धि ऋषि मुनिन उबारा॥

धरा रूप नरसिंह को अम्बा।
प्रगट भई फाड़कर खम्बा॥

रक्षा करि प्रह्लाद बचायो।
हिरण्याक्ष को स्वर्ग पठायो॥

लक्ष्मी रूप धरो जग माहीं।
श्री नारायण अंग समाहीं॥

क्षीरसिन्धु में करत विलासा।
दयासिन्धु दीजै मन आसा॥

हिंगलाज में तुम्हीं भवानी।
महिमा अमित न जात बखानी॥

मातंगी अरु धूमावति माता।
भुवनेश्वरी बगला सुखदाता॥

श्री भैरव तारा जग तारिणी।
छिन्न भाल भव दुःख निवारिणी॥

केहरि वाहन सोहत भवानी।
लांगुर वीर चलत अगवानी॥

कर में खप्पर खड्ग विराजै।
जाको देख काल डर भाजै॥

सोहै अस्त्र और त्रिशूला।
जाते उठत शत्रु हिय शूला॥

नगरकोट में तुम्हीं विराजत।
तिहुँलोक में डंका बाजत॥

शुम्भ निशुम्भ दानव तुम मारे।
रक्तबीज शंखन संहारे॥

महिषासुर नृप अति अभिमानी।
जेहि अघ भार मही अकुलानी॥

रूप कराल कालिका धारा।
सेन सहित तुम तिहि संहारा॥

परी गाढ़ सन्तन पर जब जब।
भई सहाय मातु तुम तब तब॥

अमरपुरी अरु बासव लोका।
तव महिमा सब रहें अशोका॥

ज्वाला में है ज्योति तुम्हारी।
तुम्हें सदा पूजें नर नारी॥

प्रेम भक्ति से जो यश गावें।
दुःख दारिद्र निकट नहिं आवें॥

ध्यावे तुम्हें जो नर मन लाई।
जन्म-मरण ताको छुटि जाई॥

जोगी सुर मुनि कहत पुकारी।
योग न हो बिन शक्ति तुम्हारी॥

शंकर आचारज तप कीनो।
काम अरु क्रोध जीति सब लीनो॥

निशिदिन ध्यान धरो शंकर को।
काहु काल नहि सुमिरो तुमको॥

शक्ति रूप का मरम न पायो।
शक्ति गई तब मन पछितायो॥

शरणागत हुई कीर्ति बखानी।
जय जय जय जगदम्ब भवानी॥

भई प्रसन्न आदि जगदम्बा।
दई शक्ति नहिं कीन विलम्बा॥

मोको मातु कष्ट अति घेरो।
तुम बिन कौन हरै दुःख मेरो॥

आशा तृष्णा निपट सतावें।
मोह मदादिक सब विनशावें॥

शत्रु नाश कीजै महारानी।
सुमिरौं इकचित तुम्हें भवानी॥

करो कृपा हे मातु दयाला।
ऋद्धि सिद्धि दे करहु निहाला॥

जब लगि जिऊँ दया फल पाऊँ।
तुम्हरो यश मैं सदा सुनाऊँ॥

दुर्गा चालीसा जो कोई गावै।
सब सुख भोग परम पद पावै॥

देवीदास शरण निज जानी।
करहु कृपा जगदम्ब भवानी॥

॥ दोहा ॥

शरणागत रक्षा करे, भक्त रहे निश्चिन्त।
दुर्गा चालीसा पढ़त, मिटे सकल भय द्वन्द्व॥`,
    "Durga Saptashati Path": `मंगलाचरण
॥ श्री गणेशाय नमः ॥

॥ श्री गुरुभ्यो नमः ॥

॥ श्री दुर्गायै नमः ॥

ॐ नमश्चण्डिकायै।
श्री दुर्गा ध्यानम्
ॐ विद्युद्दामसमप्रभां मृगपतिस्कन्धस्थितां भीषणाम्।
कन्याभिः करवालखेटविलसद्धस्ताभिरासेविताम्॥

हस्तैश्चक्रगदासिखेटविशिखांश्चापं गुणं तर्जनीम्।
बिभ्राणामनलात्मिकां शशिधरां दुर्गां त्रिनेत्रां भजे॥
श्री देवी कवचम्
मार्कण्डेय उवाच।

ॐ यद्गुह्यं परमं लोके सर्वरक्षाकरं नृणाम्।
यन्न कस्यचिदाख्यातं तन्मे ब्रूहि पितामह॥

ब्रह्मोवाच।

अस्ति गुह्यतमं विप्र सर्वभूतोपकारकम्।
देव्यास्तु कवचं पुण्यं तच्छृणुष्व महामुने॥

प्रथमं शैलपुत्री च द्वितीयं ब्रह्मचारिणी।
तृतीयं चन्द्रघण्टेति कूष्माण्डेति चतुर्थकम्॥

पञ्चमं स्कन्दमातेति षष्ठं कात्यायनीति च।
सप्तमं कालरात्रिश्च महागौरीति चाष्टमम्॥

नवमं सिद्धिदात्री च नवदुर्गाः प्रकीर्तिताः।
उक्तान्येतानि नामानि ब्रह्मणैव महात्मना॥

अग्निना दह्यमानास्तु शत्रुमध्ये गता रणे।
विषमे दुर्गमे चैव भयार्ताः शरणं गताः॥

न तेषां जायते किञ्चिदशुभं रणसङ्कटे।
नापदं तस्य पश्यामि शोकदुःखभयं न हि॥

यैस्तु भक्त्या स्मृता नित्यं तेषां वृद्धिः प्रजायते।
ये त्वां स्मरन्ति देवेशि रक्षसे तान्न संशयः॥`,

};

// Bengali lyrics
const LYRICS_BN: Record<string, string> = {
    "Hanuman Chalisa": `প্রারম্ভিক দোহা

শ্রী গুরু চরণ সরোজ রজ, নিজ মন মুকুর সুধারি।
    বরনউঁ রঘুবর বিমল যশু, যো দায়কু ফল চারি॥

    বুদ্ধিহীন তনু জানিকে, সুমিরৌ পবন- কুমার।
    বল বুদ্ধি বিদ্যা দেহু মোহি, হরহু ক্লেশ বিকার॥

11. লায় সজীবন লখন জিয়ায়ে।
    শ্রী রঘুবীর হরষি উর লায়ে॥

12. রঘুপতি কীন্হী বহুত বড়াই।
    তুম মম প্রিয় ভরতহি সম ভাই॥

13. সহস বদন তুম্হরো যশ গাবৈঁ।
    অস কহি শ্রীপতি কণ্ঠ লগাবৈঁ॥

14. সনকাদিক ব্রহ্মাদি মুনীশা।
    নারদ সারদ সহিত অহীশা॥

15. যম কুবের দিগপাল জহাঁ তে।
    কবি কোবিদ কহি সকৈঁ কহাঁ তে॥

16. তুম উপকার সুগ্রীবহি কীন্হা।
    রাম মিলায় রাজ পদ দীন্হা॥

17. তুম্হরো মন্ত্র বিভীষণ মানা।
    লঙ্কেশ্বর ভয়ে সব জগ জানা॥

18. যুগ সহস্র যোজন পর ভানু।
    লীল্যো তাহি মধুর ফল জানু॥

19. প্রভু মুদ্রিকা মেলি মুখ মাহিঁ।
    জলধি লাঁঘি গয়ে অচরজ নাহিঁ॥

20. দুর্গম কাজ জগত কে জেতে।
    সুগম অনুগ্রহ তুম্হরে তেতে॥

21. রাম দুয়ারে তুম রখবারে।
    হোত ন আজ্ঞা বিনু পৈসারে॥

22. সব সুখ লহৈ তুম্হারী শরণা।
    তুম রক্ষক কাহু কো ডরনা॥

23. আপন তেজ সম্হারো আপৈ।
    তিনোঁ লোক হাঁক তেঁ কাঁপৈ॥

24. ভূত পিশাচ নিকট নহিঁ আবৈ।
    মহাবীর জব নাম সুনাবৈ॥

25. নাসৈ রোগ হরৈ সব পীরা।
    জপত নিরন্তর হনুমত বীরা॥

26. সংকট তেঁ হনুমান ছুড়াবৈ।
    মন ক্রম বচন ধ্যান জো লাবৈ॥

27. সব পর রাম তপস্বী রাজা।
    তিনকে কাজ সকল তুম সাজা॥

28. ঔর মনোরথ জো কোই লাবৈ।
    সোই অমিত জীবন ফল পাবৈ॥

29. চারোঁ যুগ প্রতাপ তুম্হারা।
    হৈ প্রসিদ্ধ জগত উজিয়ারা॥

30. সাধু সন্ত কে তুম রখবারে।
    অসুর নিকন্দন রাম দুলারে॥

31. অষ্ট সিদ্ধি নৌ নিধি কে দাতা।
    অস বর দীন্হ জানকী মাতা॥

32. রাম রসায়ন তুম্হরে পাসা।
    সদা রহো রঘুপতি কে দাসা॥

33. তুম্হরে ভজন রাম কো পাবৈ।
    জনম জনম কে দুখ বিসরাবৈ॥

34. অন্ত কাল রঘুবর পুর জাই।
    জহাঁ জন্ম হরি - ভক্ত কহাই॥

35. ঔর দেবতা চিত্ত ন ধরই।
    হনুমত সেই সর্ব সুখ করই॥

36. সংকট কটৈ মিটৈ সব পীরা।
    জো সুমিরৈ হনুমত বলবীরা॥

37. জয় জয় জয় হনুমান গোসাঁই।
    কৃপা করহু গুরুদেব কী নাঁই॥

38. জো শত বার পাঠ কর কোই।
    ছুটহি বন্দি মহা সুখ হোই॥

39. জো যহ পড়ৈ হনুমান চালিসা।
    হোয় সিদ্ধি সাক্ষী গৌরীশা॥

40. তুলসীদাস সদা হরি চেরা।
    কীজৈ নাথ হৃদয় মহঁ ডেরা॥

    শেষ দোহা

পবনতনয় সংকট হরণ, মঙ্গল মূরতি রূপ।
রাম লখন সীতা সহিত, হৃদয় বসহু সুরভূপ॥

`,
    "Aarti Kije Hanuman Lala Ki": `শ্রী রামচন্দ্র কৃপালু ভজমন,
    হরণ ভবভয় দারুণম।
নবকঞ্জ লোচন, কঞ্জ মুখ,
    কর কঞ্জ পদ কঞ্জারুণম॥

কন্দর্প অগণিত অমিত ছবি,
    নবনীল নীরদ সুন্দরম।
পটপীত মানহু তড়িৎ রুচি,
    শুচি নৌমি জনক সুতাবরম॥

ভজু দীনবন্ধু দিনেশ দানব,
    দৈত্যবংশ নিকন্দনম।
রঘুনন্দ আনন্দকন্দ,
    কৌশলচন্দ্র দশরথ নন্দনম॥

শির মুকুট কুণ্ডল তিলক,
    চারু উদার অঙ্গ বিভূষণম।
আজানুভুজ শর চাপ ধর,
    সঙ্গ্রামজিত খরদূষণম॥

ইতি বদতি তুলসীদাস,
    শঙ্কর শেষ মুনি মন রঞ্জনম।
মম হৃদয় কঞ্জ নিবাস কুরু,
    কামাদি খলদল গঞ্জনম॥ `,
    "Sankat Mochan Ashtak": `বাল সময় রবি ভক্ষি লিয়ো তব,
    তীনহুঁ লোক भयो অন্ধিয়ারো।
তাহি সোঁ ত্রাস भयो জগ কো,
    যহ সংকট কাহু সোঁ জাত ন টারো॥

দেবন আনি করি বিনতী তব,
    ছাড়ি দিয়ো রবি কষ্ট নিবারো।
কো নহি জানত হৈ জগ মেঁ কপি,
    সংকটমোচন নাম তিহারো॥১॥

বালি কী ত্রাস কপীস বসেঁ গিরি,
    জাত মহাপ্রভু পন্থ নিহারো।
চৌঁকি মহামুনি শাপ দিয়ো তব,
    চাহিয়ে কৌন বিচার বিচারো॥

কৈ দ্বিজ রূপ লিবায় মহাপ্রভু,
    সো তুম দাস কে শোক নিবারো।
কো নহি জানত হৈ জগ মেঁ কপি,
    সংকটমোচন নাম তিহারো॥২॥

অঙ্গদ কে সঙ্গ লেন গয়ে সিয়,
    খোজ কপীস যহ বেন উচারো।
জীবত না বচিহৌ হম সো জু,
    বিনা সুধি লায়ে ইহাঁ পগু ধারো॥

হেরি থাকে তট সিন্ধু সবৈ তব,
    লায় সিয়া - সুধি প্রাণ উবারো।
কো নহি জানত হৈ জগ মেঁ কপি,
    সংকটমোচন নাম তিহারো॥৩॥

রাবন ত্রাস দঈ সিয় কো সব,
    রাক্ষসি সোঁ কহি শোক নিবারো।
তাহি সময় হনুমান মহাপ্রভু,
    জায় মহা রজনীচর মারো॥

চাহত সীয় অশোক সোঁ আগি সু,
    দৈ প্রভু মুদ্রিকা শোক নিবারো।
কো নহি জানত হৈ জগ মেঁ কপি,
    সংকটমোচন নাম তিহারো॥৪॥

বান লগ্যো উর লছিমন কে তব,
    প্রাণ তজে সুত রাবন মারো।
লৈ গৃহ বৈদ্য সুষেন সমেত,
    তবৈ গিরি দ্রোণ সু বীর উপারো॥

আনি সজীবন হাত দঈ তব,
    লছিমন কে তুম প্রাণ উবারো।
কো নহি জানত হৈ জগ মেঁ কপি,
    সংকটমোচন নাম তিহারো॥৫॥

রাবন যুদ্ধ অজান কিয়ো তব,
    নাগ কী ফাঁস সবৈ সির ডারো।
শ্রীরঘুনাথ সমেত সবৈ দল,
    মোহ भयो যহ সংকট ভারো॥

আনি খগেশ তবৈ হনুমান জু,
    বন্ধন কাটি সুত্রাস নিবারো।
কো নহি জানত হৈ জগ মেঁ কপি,
    সংকটমোচন নাম তিহারো॥৬॥

বন্ধু সমেত জবৈ অহিরাবন,
    লৈ রঘুনাথ পাতাল সিধারো।
দেবিহিঁ পূজি ভলি বিধি সোঁ বলি,
    দেউ সবৈ মিলি মন্ত্র বিচারো॥

জায় সহায় भयो তব হী,
    অহিরাবন সৈন্য সমেত সংহারো।
কো নহি জানত হৈ জগ মেঁ কপি,
    সংকটমোচন নাম তিহারো॥৭॥

কাজ কিয়ে বড় দেবন কে তুম,
    বীর মহাপ্রভু দেখি বিচারো।
কৌন সো সংকট মোর গরীব কো,
    জো তুমসোঁ নহি জাত হৈ টারো॥

বেগি হরো হনুমান মহাপ্রভু,
    জো কছু সংকট হয় হামারো।
কো নহি জানত হৈ জগ মেঁ কপি,
    সংকটমোচন নাম তিহারো॥৮॥

দোহা

লাল দেহ লালী লসে,
    অরু ধরী লাল লঙ্গুর।
বজ্র দেহ দানব দলন,
    জয় জয় জয় কপি সুর॥`,
    "Shri Ramchandra Kripalu Bhajman": ``,
    "Aarti Shri Ramchandra Ji Ki": `আরতি শ্রী রামচন্দ্র জী কি,
    কীরতি কলিত ললিত সিয়া পী কি।

গাবত ব্রহ্মাদিক মুনি নারদ,
    বাল্মীকি বিজ্ঞান বিশারদ।
শুক সনকাদিক শেষ অরু শারদ,
    বরনি পবনসুত কীরতি নীকি।

আরতি শ্রী রামচন্দ্র জী কি।

রহত সো অবধ মে রুচির ভবন মে,
    আসন পর হরি চপল চরণ মে।
করত কৃপা বহু রূপ ধরন মে,
    সুর নর মুনি সব হোত সুখী কি।

আরতি শ্রী রামচন্দ্র জী কি।

রজত জনকপুর ধাম মে,
    অবধপুরী মে সিয়া রাম জী।
ভক্তন কে মন মন্দির মে,
    বসত সদা সুখধাম জী।

আরতি শ্রী রামচন্দ্র জী কি।`,
    "Ram Raksha Stotram": `॥ শ্রী রাম রক্ষা স্তোত্রম্ ॥

অস্য শ্রী রামরক্ষা স্তোত্রমন্ত্রস্য।
বুধকৌশিক ঋষিঃ।
শ্রী সীতারামচন্দ্রো দেবতা।
অনুষ্টুপ্ ছন্দঃ।
সীতা শক্তিঃ।
শ্রীমদ্ হনুমান কীলকম্।
শ্রীরামচন্দ্রপ্রীত্যর্থে রামরক্ষা স্তোত্রজপে বিনিয়োগঃ॥

॥ ধ্যানম্ ॥

ধ্যায়েদাজানুবাহুং ধৃতশরধনুষং বদ্ধপদ্মাসনস্থং
পীতং বাসো বসানং নবকমলদলস্পর্ধিনেত্রং প্রসন্নম্।
বামাঙ্কারূঢ়সীতামুখকমলমিলল্লোচনং নীরদাভং
নানালঙ্কারদীপ্তং দধতমুরুজটামণ্ডনং রামচন্দ্রম্॥

চরিতং রঘুনাথস্য শতকোটিপ্রবিস্তরম্।
একৈকমক্ষরং পুংসাং মহাপাতকনাশনম্॥

ধ্যাত্বা নীলোৎপলশ্যামং রামং রাজীবলোচনম্।
জানকীলক্ষ্মণোপেতং জটামুকুটমণ্ডিতম্॥

সসিতূণধনুর্বাণপাণিং নক্তঞ্চরান্তকম্।
স্বলীলয়া জগত্ত্রাতুমাবির্ভূতমজং বিভুম্॥

রামরক্ষাং পঠেৎপ্রাজ্ঞঃ পাপঘ্নীং সর্বকামদাম্।
শিরো মে রাঘবঃ পাতু ভালং দশরথাত্মজঃ॥

কৌসল্যেয়ো দৃশৌ পাতু বিশ্বামিত্রপ্রিয়ঃ শ্রুতি।
ঘ্রাণং পাতু মখত্রাতা মুখং সৌমিত্রিবৎসলঃ॥

জিহ্বাং বিদ্যানিধিঃ পাতু কণ্ঠং ভরতবন্দিতঃ।
স্কন্ধৌ দিব্যায়ুধঃ পাতু ভুজৌ ভগ্নেশকার্মুকঃ॥

করৌ সীতাপতিঃ পাতু হৃদয়ং জামদগ্ন্যজিত্।
মধ্যং পাতু খরধ্বংসী নাভিং জাম্ববদাশ্রয়ঃ॥

সুগ্রীবেশঃ কটী পাতু সক্থিনী হনুমৎপ্রভুঃ।
ঊরূ রঘূত্তমঃ পাতু রক্ষঃকুলবিনাশকৃত্॥

জানুনী সেতুকৃৎপাতু জঙ্ঘে দশমুখান্তকঃ।
পাদৌ বিভীষণশ্রীদঃ পাতু রামোঽখিলং বপুঃ॥

এতাং রামবলোপেতাং রক্ষাং যঃ সুকৃতী পঠেৎ।
স চিরায়ুঃ সুখী পুত্রী বিজয়ী বিনয়ী ভবেৎ॥

পাতালভূতলব্যোমচারিণশ্ছদ্মচারিণঃ।
ন দ্রষ্টুমপি শক্তাস্তে রক্ষিতং রামনামভিঃ॥

রামেতি রামভদ্রেতি রামচন্দ্রেতি বা স্মরন্।
নরো ন লিপ্যতে পাপৈর্ভুক্তিং মুক্তিং চ বিন্দতি॥

জগজ্জৈত্রৈকমন্ত্রেণ রামনাম্নাভিরক্ষিতম্।
যঃ কণ্ঠে ধারয়েত্তস্য করস্থাঃ সর্বসিদ্ধয়ঃ॥

বজ্রপঞ্জরনামেদং যো রামকবচং স্মরেৎ।
অব্যাহতাজ্ঞঃ সর্বত্র লভতে জয়মঙ্গলম্॥

আদিষ্টবান্ যথা স্বপ্নে রামরক্ষামিমাং হরঃ।
তথা লিখিতবান্ প্রাতঃ প্রবুদ্ধো বুধকৌশিকঃ॥

আরামঃ কল্পবৃক্ষাণাং বিরামঃ সকলাপদাম্।
অভিরামস্ত্রিলোকানাং রামঃ শ্রীমান্ স নঃ প্রভুঃ॥

তরুণৌ রূপসম্পন্নৌ সুকুমারৌ মহাবলৌ।
পুণ্ডরীকবিশালাক্ষৌ চীরকৃষ্ণাজিনাম্বরৌ॥

ফলমূলাশিনৌ দান্তৌ তাপসৌ ব্রহ্মচারিণৌ।
পুত্রৌ দশরথস্যৈতৌ ভ্রাতরৌ রামলক্ষ্মণৌ॥

শরণ্যৌ সর্বসত্ত্বানাং শ্রেষ্ঠৌ সর্বধনুষ্মতাম্।
রক্ষঃকুলনিহন্তারৌ ত্রায়েতাং নো রঘূত্তমৌ॥

আত্তসজ্জধনুষাবিষুস্পৃশা বক্ষয়া শুগনিষঙ্গিনৌ।
রক্ষণায় মম রামলক্ষ্মণাবগ্রতঃ পথি সদৈব গচ্ছতাম্॥

সন্নদ্ধঃ কবচী খড়্গী চাপবাণধরো যুবা।
গচ্ছন্মনোরথোঽস্মাকং রামঃ পাতু সলক্ষ্মণঃ॥

রামো দাশরথিঃ শূরো লক্ষ্মণানুচরো বলী।
কাকুৎস্থঃ পুরুষঃ পূর্ণঃ কৌসল্যেয়ো রঘূত্তমঃ॥

বেদান্তবেদ্যো যজ্ঞেশঃ পুরাণপুরুষোত্তমঃ।
জানকীবল্লভঃ শ্রীমানপ্রমেয়পরাক্রমঃ॥

ইত্যেতানি জপেন্নিত্যং মদ্ভক্তঃ শ্রদ্ধয়ান্বিতঃ।
অশ্বমেধাধিকং পুণ্যং সম্প্রাপ্নোতি ন সংশয়ঃ॥

রামং দুর্বাদলশ্যামং পদ্মাক্ষং পীতবাসসম্।
স্তুবন্তি নামভির্দিব্যৈর্ন তে সংসারিণো নরাঃ॥

রামং লক্ষ্মণপূর্বজং রঘুবরং সীতাপতিং সুন্দরম্।
কাকুৎস্থং করুণার্ণবং গুণনিধিং বিপ্রপ্রিয়ং ধার্মিকম্॥

রাজেন্দ্রং সত্যসন্ধং দশরথতনয়ং শ্যামলং শান্তমূর্তিম্।
বন্দে লোকাভিরামং রঘুকুলতিলকং রাঘবং রাবণারিম্॥

রামায় রামভদ্রায় রামচন্দ্রায় বেধসে।
রঘুনাথায় নাথায় সীতায়াঃ পতয়ে নমঃ॥

শ্রীরাম রাম রঘুনন্দন রাম রাম।
শ্রীরাম রাম ভরতাগ্রজ রাম রাম।
শ্রীরাম রাম রণকর্কশ রাম রাম।
শ্রীরাম রাম শরণং ভব রাম রাম॥

শ্রীরামচন্দ্রচরণৌ মনসা স্মরামি।
শ্রীরামচন্দ্রচরণৌ বচসা গৃণামি।
শ্রীরামচন্দ্রচরণৌ শিরসা নমামি।
শ্রীরামচন্দ্রচরণৌ শরণং প্রপদ্যে॥

মাতা রামো মৎপিতা রামচন্দ্রঃ।
স্বামী রামো মৎসখা রামচন্দ্রঃ।
সর্বস্বং মে রামচন্দ্রো দয়ালুঃ।
নান্যং জানে নৈব জানে ন জানে॥

দক্ষিণে লক্ষ্মণো যস্য বামে চ জনকাত্মজা।
পুরতো মারুতির্যস্য তং বন্দে রঘুনন্দনম্॥

লোকাভিরামং রণরঙ্গধীরং
রাজীবনেত্রং রঘুবংশনাথম্।
কারুণ্যরূপং করুণাকরং তং
শ্রীরামচন্দ্রং শরণং প্রপদ্যে॥

মনোজবং মারুততুল্যবেগং
জিতেন্দ্রিয়ং বুদ্ধিমতাং বরিষ্ঠম্।
বাতাত্মজং বানরযূথমুখ্যং
শ্রীরামদূতং শরণং প্রপদ্যে॥

কূজন্তং রামরামেতি মধুরং মধুরাক্ষরম্।
আরুহ্য কবিতাশাখাং বন্দে বাল্মীকিকোকিলম্॥

আপদামপহর্তারং দাতারং সর্বসম্পদাম্।
লোকাভিরামং শ্রীরামং ভূয়ো ভূয়ো নমাম্যহম্॥

ভর্জনং ভববীজানামর্জনং সুখসম্পদাম্।
তর্জনং যমদূতানাং রামরামেতি গর্জনম্॥

রামো রাজমণিঃ সদা বিজয়তে রামং রমেশং ভজে।
রামেণাভিহতা নিশাচরচমূ রামায় তস্মৈ নমঃ।
রামান্নাস্তি পরায়ণং পরতরং রামস্য দাসোঽস্ম্যহম্।
রামে চিত্তলয়ঃ সদা ভবতু মে ভো রাম মামুদ্ধর॥

রাম রামেতি রামেতি রমে রামে মনোরমে।
সহস্রনাম তত্তুল্যং রামনাম বরাননে॥

॥ ইতি শ্রীবুধকৌশিকবিরচিতং শ্রী রামরক্ষা স্তোত্রং সম্পূর্ণম্ ॥`,
    "Om Jai Jagdish Hare": `॥ ওঁ জয় জগদীশ হরে ॥

ওঁ জয় জগদীশ হরে,
স্বামী জয় জগদীশ হরে।
ভক্ত জনো কে সংকট,
দাস জনো কে সংকট,
ক্ষণ মে দূর করে॥
ওঁ জয় জগদীশ হরে॥

জো ধ্যাবে ফল পাবে,
দুঃখ বিনসে মন কা।
স্বামী দুঃখ বিনসে মন কা।
সুখ সম্পত্তি ঘর আবে,
কষ্ট মিটে তন কা॥
ওঁ জয় জগদীশ হরে॥

মাত-পিতা তুম মেরে,
শরণ গহুঁ ম্যায় কিসকি।
স্বামী শরণ গহুঁ ম্যায় কিসকি।
তুম বিন অউর ন দুজা,
আস করুঁ ম্যায় জিসকি॥
ওঁ জয় জগদীশ হরে॥

তুম পূরণ পরমাত্মা,
তুম অন্তর্যামী।
স্বামী তুম অন্তর্যামী।
পারব্রহ্ম পরমেশ্বর,
তুম সবকে স্বামী॥
ওঁ জয় জগদীশ হরে॥

তুম করুণা কে সাগর,
তুম পালনকর্তা।
স্বামী তুম পালনকর্তা।
ম্যায় মূরখ খল কামি,
কৃপা করো ভর্তা॥
ওঁ জয় জগদীশ হরে॥

তুম হো এক অগোচর,
সবকে প্রাণপতি।
স্বামী সবকে প্রাণপতি।
কিস বিধি মিলুঁ দয়াময়,
তুমকো ম্যায় কুমতি॥
ওঁ জয় জগদীশ হরে॥

দীনবন্ধু দুঃখহর্তা,
তুম রক্ষক মেরে।
স্বামী তুম রক্ষক মেরে।
আপনে হাত উঠাও,
দ্বার পড়া তেরে॥
ওঁ জয় জগদীশ হরে॥

বিষয়-বিকার মিটাও,
পাপ হরো দেবা।
স্বামী পাপ হরো দেবা।
শ্রদ্ধা-ভক্তি বাড়াও,
সন্তন কি সেবা॥
ওঁ জয় জগদীশ হরে॥

তন-মন-ধন সব হ্যায় তেরা,
স্বামী সব কুছ হ্যায় তেরা।
তেরা তুঝকো অর্পণ,
ক্যা লাগে মেরা॥
ওঁ জয় জগদীশ হরে॥

ওঁ জয় জগদীশ হরে,
স্বামী জয় জগদীশ হরে।
ভক্ত জনো কে সংকট,
দাস জনো কে সংকট,
ক্ষণ মে দূর করে॥
ওঁ জয় জগদীশ হরে॥`,
    "Aarti Kunj Bihari Ki": `॥ আরতি কুঞ্জবিহারী কি ॥

আরতি কুঞ্জবিহারী কি,
শ্রী গিরিধর কৃষ্ণ মুরারী কি॥
আরতি কুঞ্জবিহারী কি,
শ্রী গিরিধর কৃষ্ণ মুরারী কি॥

গলে মে বৈজয়ন্তী মালা, বজাবৈ মুরলী মধুর বালা।
শ্রবণ মে কুণ্ডল ঝলকালা, নন্দ কে আনন্দ নন্দলালা।
গগন সম অঙ্গ কান্তি কালী, রাধিকা চমক রহী আলী।
লতন মে ঠাঢ়ে বনমালী, ভ্রমর সী অলক,
কস্তূরী তিলক, চন্দ্র সী ঝলক,
ললিত ছবি শ্যামা প্যারি কি,
শ্রী গিরিধর কৃষ্ণ মুরারী কি॥
॥ আরতি কুঞ্জবিহারী কি...॥

কনকময় মোর মুকুট বিলসৈ, দেবতা দরশন কো তরসৈ।
গগন সো সুমন রাসি বরসৈ।
বজে মুরচঙ্গ, মধুর মৃদঙ্গ,
গোয়ালিন সঙ্গ, অতুল রতি গোপ কুমারী কি,
শ্রী গিরিধর কৃষ্ণ মুরারী কি॥
॥ আরতি কুঞ্জবিহারী কি...॥

জহাঁ তে প্রकट ভঈ গঙ্গা,
সকল মন হারিণী শ্রী গঙ্গা।
স্মরণ তে হোত মোহ ভঙ্গা,
বসী শিব শীস, জটা কে বীচ,
হরৈ অঘ কীচ,
চরণ ছবি শ্রী বনওয়ারী কি,
শ্রী গিরিধর কৃষ্ণ মুরারী কি॥
॥ আরতি কুঞ্জবিহারী কি...॥

চমকতী উজ্জ্বল তট রেনূ,
বজ রহী বৃন্দাবন বেনূ।
চহুঁ দিশি গোপী গোয়াল ধেনূ,
হসত মৃদু মন্দ, চাঁদনী চন্দ,
কটত ভব ফন্দ,
টের শুন দীন দুখারী কি,
শ্রী গিরিধর কৃষ্ণ মুরারী কি॥
॥ আরতি কুঞ্জবিহারী কি...॥

আরতি কুঞ্জবিহারী কি,
শ্রী গিরিধর কৃষ্ণ মুরারী কি॥
আরতি কুঞ্জবিহারী কি,
শ্রী গিরিধর কৃষ্ণ মুরারী কি॥`,
    "Achyutam Keshavam": `॥ শ্রী অচ্যুতাষ্টকম্ ॥

অচ্যুতং কেশবং রামনারায়ণং
কৃষ্ণদামোদরং বাসুদেবং হরিম্।
শ্রীধরং মাধবং গোপিকাবল্লভং
জানকীনায়কং রামচন্দ্রং ভজে॥১॥

অচ্যুতং কেশবং সত্যভামাধবং
মাধবং শ্রীধরং রাধিকাৰাধিতম্।
ইন্দিরামন্দিরং চেতসা সুন্দরং
দেবকীনন্দনং নন্দজং সন্দধে॥২॥

বিষ্ণবে জিষ্ণবে শঙ্খিনে চক্রিণে
রুক্মিণীরাগিণে জানকীজানয়ে।
বল্লবীবল্লভায়ার্চিতায়াত্মনে
কংসবিধ্বংসিনে বংশিনে তে নমঃ॥৩॥

কৃষ্ণ গোবিন্দ হে রাম নারায়ণ
শ্রীপতে বাসুদেবাজিত শ্রীনিধে।
অচ্যুতানন্ত হে মাধবাধোক্ষজ
দ্বারকানায়ক দ্রৌপদীরক্ষক॥৪॥

রাক্ষসক্ষোভিতঃ সীতয়া শোভিতো
দণ্ডকারণ্যভূপুণ্যতাকারণঃ।
লক্ষ্মণেনান্বিতো বানরৈঃ সেবিতো
অগস্ত্যসম্পূজিতো রাঘবঃ পাতু মাম্॥৫॥

ধেনুকারিষ্টকানিষ্টকৃদ্দ্বেষিহা
কেশিহা কংসহৃদ্বংশিকাবাদকঃ।
পূতনাকোপকঃ সূরজাখেলনো
বালগোপালকঃ পাতু মাং সর্বদা॥৬॥

বিদ্যুদুদ্যোতবৎপ্রস্ফুরদ্বাসসং
প্রাবৃডম্ভোদবৎপ্রোল্লসদ্বিগ্রহম্।
বন্যয়া মালয়া শোভিতোরঃস্থলং
লোহিতাঙ্ঘ্রিদ্বয়ং বারিজাক্ষং ভজে॥৭॥

কুঞ্চিতৈঃ কুন্তলৈর্ভ্রাজমানাননং
রত্নমৌলিং লসৎকুণ্ডলং গণ্ডয়োঃ।
হারকেয়ূরকং কঙ্কণপ্রোজ্জ্বলং
কিঙ্কিণীমঞ্জুলং শ্যামলং তং ভজে॥৮॥

অচ্যুতস্যাষ্টকং যঃ পঠেদিষ্টদং
প্রেমতঃ প্রত্যহং পুরুষঃ সস্পৃহম্।
বৃত্ততঃ সুন্দরং কর্তৃবিশ্বম্ভরঃ
তস্য বশ্যো হরির্জায়তে সত্বরম্॥৯॥`,
    "Vishnu Sahasranama": `॥ শ্রী গোবিন্দ নামাবলী ॥

গোবিন্দা গোবিন্দা গোবিন্দা।
গোবিন্দা গোবিন্দা গোবিন্দা॥

শ্রী গোবিন্দা, হরি গোবিন্দা।
গোপাল গোবিন্দা, গোবিন্দা॥

ভেঙ্কট রমণা গোবিন্দা।
ভেঙ্কটেশ্বর গোবিন্দা॥

শ্রীপতি গোবিন্দা।
লক্ষ্মীপতি গোবিন্দা॥

বাসুদেব গোবিন্দা।
দেবকীনন্দন গোবিন্দা॥

নন্দনন্দন গোবিন্দা।
নবনীতচোর গোবিন্দা॥

গোবর্ধনধারী গোবিন্দা।
গোকুলনন্দন গোবিন্দা॥

মুরলী মনোহর গোবিন্দা।
মধুসূদন গোবিন্দা॥

মাধব গোবিন্দা।
কেশব গোবিন্দা॥

দামোদর গোবিন্দা।
পদ্মনাভ গোবিন্দা॥

পুণ্ডরীকাক্ষ গোবিন্দা।
পরমদয়াল গোবিন্দা॥

ভক্তবৎসল গোবিন্দা।
দীনদয়াল গোবিন্দা॥

রাধারমণ গোবিন্দা।
রুক্মিণীরমণ গোবিন্দা॥

সীতারাম গোবিন্দা।
শ্রীকৃষ্ণ গোবিন্দা॥

অনন্তশয়ন গোবিন্দা।
আনন্দমূর্তি গোবিন্দা॥

শরণাগতবৎসল গোবিন্দা।
সর্বলোকনাথ গোবিন্দা॥

গোবিন্দা গোবিন্দা গোবিন্দা।
শ্রী ভেঙ্কটেশ গোবিন্দা॥`,


    "Jai Ganesh Deva": `জয় গণেশ, জয় গণেশ, জয় গণেশ দেবা।
মাতা যাকী পার্বতী, পিতা মহাদেবা॥

একদন্ত দয়াবন্ত, চার ভুজাধারী।
মাথেতে তিলক শোভে, মূষকের সওয়ারি॥

জয় গণেশ, জয় গণেশ, জয় গণেশ দেবা।
মাতা যাকী পার্বতী, পিতা মহাদেবা॥

পান চড়ে, ফুল চড়ে, আর চড়ে মেওয়া।
লাড্ডুর ভোগ লাগে, সন্ত করে সেবা॥

জয় গণেশ, জয় গণেশ, জয় গণেশ দেবা।
মাতা যাকী পার্বতী, পিতা মহাদেবা॥

অন্ধকে চোখ দাও, কুষ্ঠরোগীকে কায়া।
নিঃসন্তানকে পুত্র দাও, নির্ধনকে মায়া॥

জয় গণেশ, জয় গণেশ, জয় গণেশ দেবা।
মাতা যাকী পার্বতী, পিতা মহাদেবা॥

সুর-শ্যাম শরণে এসেছে, সফল করো সেবা।
মাতা যাকী পার্বতী, পিতা মহাদেবা॥

জয় গণেশ, জয় গণেশ, জয় গণেশ দেবা।
মাতা যাকী পার্বতী, পিতা মহাদেবা॥`,
    "Sukhkarta Dukhharta": `সুখকর্তা দুঃখহর্তা বার্তা বিঘ্নাচি।
নুরভি পুরভি প্রেম কৃপা জয়াচি॥

সর্বাঙ্গী সুন্দর উটি শেন্দুরাচি।
কণ্ঠী ঝলকে মাল মুক্তাফলাঞ্চি॥

জয় দেব জয় দেব, জয় মঙ্গলমূর্তি।
দর্শনমাত্রে মনকামনা পূর্তি॥

রত্নখচিত ফরা তুজ গৌরীকুমরা।
চন্দনাচি উটি কুঙ্কুম কেশরা॥

হীরে জড়িত মুকুট শোভতো বরা।
রুণঝুণতি নূপুরে চরণী ঘাগরিয়া॥

জয় দেব জয় দেব, জয় মঙ্গলমূর্তি।
দর্শনমাত্রে মনকামনা পূর্তি॥

লম্বোদর পীতাম্বর ফণিবর বন্ধনা।
সরল সোঁড় বক্রতুণ্ড ত্রিনয়না॥

দাস রামাচা वाट पाहे সদনা।
সঙ্কটি পাবাভে নির্বাণী রক্ষাভে।
সুরবর বন্দনা॥

জয় দেব জয় দেব, জয় মঙ্গলমূর্তি।
দর্শনমাত্রে মনকামনা পূর্তি॥`,
    "Vakratunda Mahakaya": `বক্রতুণ্ড মহাকায়
সূর্যকোটি সমপ্রভ।

নির্বিঘ্নং কুরু মে দেব
সর্বকার্যেষু সর্বদা॥`,
    "Shri Ganesh Vandana": `জয় গণেশ জয় গণেশ জয় গণেশ দেবা
মাতা জাকি পার্বতী, পিতা মহাদেবা॥

একদন্ত দয়াবন্ত, চার ভুজাধারী
মাথায় সিঁদুর চড়ে, আর মূষিকের সওয়ারি॥

হার চড়ে, ফুল চড়ে, আর চড়ে মেওয়া
লাড্ডুর ভোগ লাগে, সন্ত করে সেবা॥

জয় গণেশ জয় গণেশ জয় গণেশ দেবা
মাতা জাকি পার্বতী, পিতা মহাদেবা॥

অন্ধকে চোখ দাও, কুষ্ঠরোগীকে কায়া
বন্ধ্যাকে পুত্র দাও, নির্ধনকে মায়া॥

'সুর' শ্যাম শরণে এসেছে, আমায় পবিত্র করো
যার যেমন ভাবনা, তাকে তেমন ফল দাও॥

জয় গণেশ জয় গণেশ জয় গণেশ দেবা
মাতা জাকি পার্বতী, পিতা মহাদেবা॥`,
    "Om Jai Shiv Omkara": `ওম জয় শিব ওঙ্কারা,
হর জয় শিব ওঙ্কারা।
ব্রহ্মা, বিষ্ণু, সদাশিব,
অর্ধাঙ্গিনী ধারা॥

ওম জয় শিব ওঙ্কারা॥

একানন চতুরানন পঞ্চানন রাজে।
হংসাসন গরুড়াসন বৃষবাহন সাজে॥

ওম জয় শিব ওঙ্কারা॥

দো ভুজ চার চতুর্ভুজ দশভুজ তে শোভে।
তিনো রূপ নিরখতা ত্রিভুবন জন মোহে॥

ওম জয় শিব ওঙ্কারা॥

অক্ষমালা বনমালা মুন্ডমালা ধারী।
চন্দন মৃগমদ চন্দা ভোলে শুভকারী॥

ওম জয় শিব ওঙ্কারা॥

শ্বেতাম্বর পীতাম্বর বাঘাম্বর অঙ্গে।
সনকাদিক গরুড়াদিক ভূতাদিক সঙ্গে॥

ওম জয় শিব ওঙ্কারা॥

করমধ্যে কমণ্ডলু চক্র ত্রিশূল ধরতা।
জগকর্তা জগভর্তা জগসংহারকর্তা॥

ওম জয় শিব ওঙ্কারা॥

ব্রহ্মা বিষ্ণু সদাশিব জানত অবিবেকা।
প্রণবাক্ষর কে মধ্যে এ তিনো একা॥

ওম জয় শিব ওঙ্কারা॥

ত্রিগুণ স্বামীর আরতি যে কেউ নর গায়ে।
ভক্ত কহত শিবানন্দ স্বামী মনবাঞ্ছিত ফল পায়ে॥

ওম জয় শিব ওঙ্কারা॥`,
    "Shiv Chalisa": `
    ॥ দোহা ॥
    জয় গণেশ গিরিজা সুবন, মঙ্গল মূল সুজান।
কহত অযোধ্যাদাস তুম, দেহু অভয় বরদান॥

জয় গিরিজা পতি দীন দয়ালা।
সদা করত সন্তন প্রতিপালা॥

ভাল চন্দ্রমা শোভত নীকে।
কানন কুণ্ডল নাগফণী কে॥

অঙ্গ গৌর শির গঙ্গ বহায়ে।
মুণ্ডমাল তন ছার লাগায়ে॥

বস্ত্র খাল বাঘাম্বর শোভে।
ছবি কো দেখি নাগ মুনি মোহে॥

মৈনা মাতু কি হৈ দুলারী।
বাম অঙ্গ শোভত ছবি নিয়ারী॥

কর ত্রিশূল শোভত ছবি ভারী।
করত সদা শত্রুন ক্ষয়কারী॥

নন্দী গণেশ শোহৈ তহাঁ কৈসে।
সাগর মধ্য কমল হৈঁ জৈসে॥

কার্তিক শ্যাম অউর গণরাউ।
য়া ছবি কো কহি জাত ন কাউ॥

দেবন যখনই যায় পুকারা।
তব হি দুখ প্রভু আপ নিবারা॥

কিয়া উপদ্রব তারক ভারী।
দেবন সব মিলি তুমহিঁ জুহারী॥

তুরত ষড়ানন আপ পাঠায়উ।
লবনিমেষ মহঁ মারি গিরায়উ॥

আপ জালন্ধর অসুর সংহারা।
সুযশ তুমহার বিদিত সংসারা॥

ত্রিপুরাসুর সন যুদ্ধ মচাই।
সবহি কৃপা কর লীন বচাই॥

কিয়া তপহিঁ ভাগীরথ ভারী।
পুরব প্রতিজ্ঞা তসু পুরারী॥

দানিন মহঁ তুম সম কোউ নাহিঁ।
সেবক স্তুতি করত সদাহিঁ॥

বেদ নাম মহিমা তব গাই।
অকথ অনাদি ভেদ নহিঁ পাই॥

প্রকটি উদধি মন্থন মে জ্বালা।
জরে সুরাসুর ভয়ে বিহালা॥

কীन्ह দয়া তহঁ করি সহাই।
নীলকণ্ঠ তব নাম কহাই॥

পূজন রামচন্দ্র যখন কীन्हা।
জীত কে লঙ্ক বিভীষণ দীन्हা॥

সহস কমল মে হো রহে ধারি।
কীन्ह পরীক্ষা তবহিঁ পুরারি॥

এক কমল প্রভু রাখেউ জোই।
কমল নয়ন পূজন চহঁ সোই॥

কঠিন ভক্তি দেখি প্রভু শঙ্কর।
ভয়ে প্রসন্ন দিয়ে় ইচ্ছিত বর॥

জয় জয় জয় অনন্ত অবিনাশী।
করত কৃপা সব কে ঘটবাসী॥

দুষ্ট সকল নিত মোহি সতাবৈ।
ভ্রমত রহে মোহি চৈন ন আবৈ॥

ত্রাহি ত্রাহি ম্যায় নাথ পুকারো।
ইহি অবসর মোহি আন উবারো॥

লৈ ত্রিশূল শত্রুন কো মারো।
সংকট সে মোহি আন উবারো॥

মাত-পিতা ভ্রাতা সব কোই।
সংকট মে পুছত নহিঁ কোই॥

স্বামী এক হৈ আস তুমহারী।
আয় হরহু অব সংকট ভারী॥

ধন নির্ধন কো দেত সদা হি।
জো কোই যাচৈ সো ফল পাহী॥

অস্তুতি কেহি বিধি করৌঁ তুমহারী।
ক্ষমহু নাথ অব চূক হামারী॥

শঙ্কর হো সংকট কে নাশন।
মঙ্গল কারণ বিঘ্ন বিনাশন॥

যোগী যতি মুনি ধ্যান লগাবৈঁ।
নারদ শারদ শীশ নবাবৈঁ॥

নমো নমো জয় নমঃ শিবায়।
সুর ব্রহ্মাদিক পার ন পায়॥

জো যহ পাঠ করে মন লাই।
তা পর হোত হৈ শম্ভু সহাই॥

ঋণিয়া জো কোই হো অধিকারী।
পাঠ করে সো পাবন হারী॥

পুত্র হোন কি ইচ্ছা জোই।
নিশ্চয় শিব প্রসাদ তেহি হোই॥

পণ্ডিত ত্রয়োদশী কো লাবৈ।
ধ্যান পূর্বক হোম করাবৈ॥

ত্রয়োদশী ব্রত করে হমেশা।
তাকে তন নহিঁ রহে ক্লেশা॥

ধূপ দীপ নৈবেদ্য চঢ়াবৈ।
শঙ্কর সম্মুখ পাঠ শুনাবৈ॥

জন্ম জন্ম কে পাপ নসাবৈ।
অন্তবাস শিবপুর মে পাবৈ॥

কহৈঁ অযোধ্যাদাস আস তুমহারী।
জানি সকল দুঃখ হরহু হামারী॥


॥ দোহা ॥
নিত নেম উঠি প্রাতঃ হি, পাঠ করো চালীস।
তুম মেরী মনোকামনা, পূর্ণ করো জগদীশ॥

মগসর ছঠি হেমন্ত ঋতু, সংবৎ চৌষঠ জান।
অস্তুতি চালীসা শিবহি, পূর্ণ কীন কল্যাণ॥

`,
    "Maha Mrityunjaya Mantra": `
    ওঁ ত্র্যম্বকম্ যজামহে
সুগন্ধিং পুষ্টিবর্ধনম্।

উর্বারুকমিব বন্ধনান্
মৃত্যোর্ মুক্শীয় মামৃতাৎ॥`,
    "Jai Ambe Gauri": `জয় অম্বে গৌরী, মাইয়া জয় শ্যামা গৌরী।
তুমকো নিশদিন ধ্যাবত, হরি ব্রহ্মা শিবরী॥

মাঙ সিন্দুর বিরাজত, টীকা মৃগমদ কো।
উজ্জ্বল সে দো নয়না, চন্দ্রবদন নীको॥

জয় অম্বে গৌরী...

কনক সমান কলেবর, রক্তাম্বর রাজে।
রক্তপুষ্প গলমালা, কণ্ঠন পর সাজে॥

জয় অম্বে গৌরী...

কেহরি বাহন রাজত, খড়্গ খপ্পর ধারী।
সুর-নর-মুনিজন সেবত, তিনকে দুঃখহারী॥

জয় অম্বে গৌরী...

কানন কুণ্ডল শোভিত, নাসাগ্রে মোতি।
কোটিক চন্দ্র দিবাকর, রাজত সম জ্যোতি॥

জয় অম্বে গৌরী...

শুম্ভ-নিশুম্ভ বিদারে, মহিষাসুর ঘাতী।
ধূম্রলোচন নয়না, নিশদিন মদমাতী॥

জয় অম্বে গৌরী...

চণ্ড-মুণ্ড সংহারে, শোণিত বীজ হরে।
মধু-কৈটভ দোঁউ মারে, সুর ভয়হীন করে॥

জয় অম্বে গৌরী...

ব্রহ্মাণী রুদ্রাণী, তুমি কমলা রানী।
আগম নিগম বখানী, তুমি শিব পটরানী॥

জয় অম্বে গৌরী...

চৌষট্টি যোগিনী মঙ্গল গাবত, নৃত্য করত ভৈরোঁ।
বাজত তাল মৃদঙ্গ, অরু বাজত ডমরু॥

জয় অম্বে গৌরী...

তুমিই জগতের মাতা, তুমিই হও ভর্তা।
ভক্তদের দুঃখ হর্তা, সুখ-সম্পত্তি কর্তা॥

জয় অম্বে গৌরী...

ভুজা চার অতি শোভিত, খড়্গ খপ্পর ধারী।
মনবাঞ্ছিত ফল পায়, সেবত নরনারী॥

জয় অম্বে গৌরী...

কাঞ্চন থাল বিরাজত, আগর কর্পূর বাতি।
শ্রীমালকেতুতে রাজত, কোটি রতন জ্যোতি॥

জয় অম্বে গৌরী...

অম্বে জির আরতি, যে কেউ নর গাবে।
কহত শিবানন্দ স্বামী, সুখ-সম্পত্তি পাবে॥

জয় অম্বে গৌরী, মাইয়া জয় শ্যামা গৌরী।
তুমকো নিশদিন ধ্যাবত, হরি ব্রহ্মা শিবরী॥`,
    "Durga Chalisa": `॥ দোহা ॥

নমো নমো দুর্গে সুখ করনী,
নমো নমো অম্বে দুঃখ হরনী।

নিরাকার হ্যায় জ্যোতি তুমহারী,
তিনহুঁ লোক ফৈলী উজিয়ারী।

॥ চৌপাই ॥

শশি ললাট মুখ মহাবিশালা,
নেত্র লাল ভ্রুকুটি বিকরালা।

রূপ মাতু কো অধিক সুহাবে,
দরশ করত জন অতি সুখ পাবে।

তুম সংসার শক্তি লয় কীনা,
পালন হেতু অন্ন ধন দীনা।

অন্নপূর্ণা হুই জগ পালা,
তুম হি আদি সুন্দরী বালা।

প্রলয়কাল সব নাশন হারী,
তুম গৌরী শিবশঙ্কর কী প্যারি।

শিব যোগী তুমহারে গুণ গাবেঁ,
ব্রহ্মা বিষ্ণু তুমহেঁ নিত ধ্যাবেঁ।

রূপ সরস্বতী কো তুম ধারা,
দে সুবুদ্ধি ঋষি মুনিন উবারা।

ধরা রূপ নরসিংহ কো অম্বা,
প্রগট ভয়ী ফাড়কর খম্বা।

রক্ষা করি প্রহ্লাদ বচায়ো,
হিরণ্যাক্ষ কো স্বর্গ পঠায়ো।

লক্ষ্মী রূপ ধরো জগ মাহিঁ,
শ্রী নারায়ণ অঙ্গ সমাহিঁ।

ক্ষীরসিন্ধু মে করত বিলাসা,
দয়াসিন্ধু দিজৈ মন আশা।

হিংলাজ মে তুমহিঁ ভবানী,
মহিমা অমিত ন জাত বখানী।

মাতঙ্গী অরু ধূমাবতী মাতা,
ভুবনেশ্বরী বগলা সুখদাতা।

শ্রী ভৈরব তারা জগ তারিণী,
ছিন্ন ভাল ভব দুঃখ নিবারিণী।

কেহরি বাহন সোহত ভবানী,
লাঙ্গুর বীর চলত অগবানি।

কর মে খপ্পর খড়্গ বিরাজৈ,
জাকো দেখ কাল ডর ভাজৈ।

সোহৈ অস্ত্র অউর ত্রিশূলা,
যাতে উঠত শত্রু হিয় শূলা।

নগরকোট মে তুমহিঁ বিরাজত,
তিনহুঁ লোক মে ডঙ্কা বাজত।

শুম্ভ নিশুম্ভ দানব তুম মারে,
রক্তবীজ শঙ্খন সংহারে।

মহিষাসুর নৃপ অতি অভিমানী,
জেহি অঘ ভার মহি আকুলানী।

রূপ করাল কালিকা ধারা,
সেন সহিত তুম তিহি সংহারা।

পড়ি গাঢ় সন্তন পর জব জব,
ভয়ী সহায় মাতু তুম তব তব।

অমরপুরী অরু বাসব লোকা,
তব মহিমা সব রহেঁ অশোকা।

জ্বালা মে হ্যায় জ্যোতি তুমহারী,
তুমহেঁ সদা পূজেঁ নর নারী।

প্রেম ভক্তি সে জো যশ গাবেঁ,
দুঃখ দারিদ্র নিকট নহিঁ আবেঁ।

ধ্যাবে তুমহেঁ জো নর মন লাই,
জন্ম-মরণ তাকো ছুটি জাই।

যোগী সুর মুনি কহত পুকারী,
যোগ ন হো বিন শক্তি তুমহারী।

শঙ্কর আচার্য তপ কীনা,
কাম অরু ক্রোধ জিতি সব লীনা।

নিশিদিন ধ্যান ধরো শঙ্কর কো,
কাহু কাল নহিঁ সুমিরো তুমকো।

শক্তি রূপ কা মরম ন পায়ো,
শক্তি গয়ী তব মন পছিতায়ো।

শরণাগত হুই কীর্তি বখানী,
জয় জয় জয় জগদম্ব ভবানী।

ভয়ী প্রসন্ন আদি জগদম্বা,
দয়ী শক্তি নহিঁ কীণ বিলম্বা।

মোকো মাতু কষ্ট অতি ঘেরো,
তুম বিন কৌন হরৈ দুঃখ মেরো।

আশা তৃষ্ণা নিপট সতাবেঁ,
মোহ মদাদিক সব বিনশাবেঁ।

শত্রু নাশ কীজৈ মহারানী,
সুমিরৌ একচিত্ত তুমহেঁ ভবানী।

করো কৃপা হে মাতু দয়ালা,
ঋদ্ধি সিদ্ধি দে করহু নিহালা।

জব লগ জিয়ুঁ দয়া ফল পাউঁ,
তুমহারো যশ ম্যায় সদা শুনাউঁ।

দুর্গা চালিশা জো কোই গাবে,
সব সুখ ভোগ পরম পদ পাবে।

দেবীদাস শরণ নিজ জানী,
করহু কৃপা জগদম্ব ভবানী।

॥ দোহা ॥

শরণাগত রক্ষা করে, ভক্ত রহে নিশ্চিন্ত,
দুর্গা চালিশা পড়ত, মিটে সকল ভয় দ্বন্দ্ব।`,
    "Durga Saptashati Path": `
    মঙ্গলাচরণ
    ॥ শ্রী গণেশায় নমঃ ॥
॥ শ্রী গুরুভ্যো নমঃ ॥
॥ শ্রী দুর্গায়ৈ নমঃ ॥
ওঁ নমশ্চণ্ডিকায়ৈ।

|| শ্রী দুর্গা ধ্যানম্||
ওঁ বিদ্যুদ্দামসমপ্রভাং মৃগপতিস্কন্ধস্থিতাং ভীষণাম্।
কন্যাভিঃ করবালখেটবিলসদ্ধস্তাভিরাসেবিতাম্॥

হস্তৈশ্চক্রগদাসিখেটবিশিখাংশ্চাপং গুণং তর্জনীম্।
বিভ্রাণামনলাত্মিকাং শশিধরাং দুর্গাং ত্রিনেত্রাং ভজে॥

|| শ্রী দেবী কবচম্ ||
মার্কণ্ডেয় উবাচ।

ওঁ যদ্গুহ্যং পরমং লোকে সর্ব্বরক্ষাকরং নৃণাম্।
যন্ন কস্যচিদাখ্যাতং তন্মে ব্রূহি পিতামহ॥
ব্রহ্মোবাচ।
অস্তি গুহ্যতমং বিপ্র সর্বভূতোপকারকম্।
দেব্যাস্ত কবচং পুণ্যং তচ্ছৃণুষ্ব মহামুনে॥

প্রথমং শৈলপুত্রী চ দ্বিতীয়ং ব্রহ্মচারিণী।
তৃতীয়ং চন্দ্রঘণ্টেতি কূষ্মাণ্ডেতি চতুর্থকম্॥

পঞ্চমং স্কন্দমাতেতি ষষ্ঠং কাত্যায়নীতি চ।
সপ্তমং কালরাত্রিশ্চ মহাগৌরীতি চাষ্টমম্॥

নবমং সিদ্ধিদাত্রী চ নবদুর্গাঃ প্রকীর্তিতাঃ।
উক্তান্যেতানি নামানি ব্রহ্মণৈব মহাত্মনা॥

অগ্নিনা দহ্যমানাস্তু শত্রুমধ্যে গতা রণে।
বিষমে দুর্গমে চৈব ভয়ার্তাঃ শরণং গতাঃ॥

ন তেষাং জায়তে কিঞ্চিদশুভং রণসঙ্কটে।
নাপদং তস্য পশ্যামি শোকদুঃখভয়ং ন হি॥

যৈস্তু ভক্ত্যা স্মৃতা নিত্যং তেষাং বৃদ্ধিঃ প্রজায়তে।
যে ত্বাং স্মরন্তি দেবেশি রক্ষসে তান্ন সংশয়ঃ॥

`,
};

// Urdu lyrics
const LYRICS_UR: Record<string, string> = {
    "Hanuman Chalisa": `دوہا

شری گرو چرَن سروج رَج، نِج مَن مُکور سُدھار
بَرَنَؤں رَگھُو بَر بِمَل جَسُو، جو دایَک پھَل چار

بُدّھِہین تَنُو جانِکے، سُمِرَؤں پَوَن کُمار
بَل بُدّھی بِدّیا دےہُ موہِیں، ہَرَہُ کلیس بِکار

چوپائی

جَے ہَنُمان گیان گُن ساگر
جَے کَپیس تِہُوں لوک اُجاگر

رام دُوت اَتُلِت بَل دھاما
اَنجَنی پُتر پَوَن سُت ناما

مَہابِیر بِکرم بَجرنگی
کُمَتی نِوار سُمَتی کے سنگی

کنچن بَرَن بِراج سُبیسَا
کانَن کُنڈَل کُنجِت کیسا

ہاتھ بَجر اَؤ دَھوجا بِراجے
کاندھے مُونج جَنےؤُو ساجے

شنکر سُوَن کیسَری نندن
تیج پَرتاپ مَہا جگ وَندن

بِدّیاوان گُنی اَتی چاتُر
رام کاج کَرِبے کو آتُر

پربھو چَرِتر سُنِبے کو رَسِیا
رام لَکھن سیتا مَن بَسِیا

سُوکشم رُوپ دَھری سِیہیں دِکھاوا
بِکَٹ رُوپ دَھری لَنک جَراوا

بھیم رُوپ دَھری اَسُر سَںہارے
رام چندر کے کاج سَںوارے

لائے سَنجیون لَکھن جِیائے
شری رَگھُوبیر ہرَشی اُر لائے

رَگھُپَتی کینہیں بَہُت بَڑائی
تُم مَم پِریہ بَھرت سَم بھائی

سَہَس بَدَن تُمہَرو جَس گاوَیں
اَس کَہِ شری پَتی کَنٹھ لَگاوَیں

سَنکادِک بَرَہما دِی مُنیسا
نارَد سارَد سَہِت اَہِیسا

یَم کُبیر دِگپال جَہاں تے
کَبِ کوبِد کَہِ سَکے کَہاں تے

تُم اُپکار سُگریوہیں کِینہا
رام مِلائے راج پَد دِینہا

تُمہَرو مَنتر بِبھیشن مانا
لَنکیشور بَئے سَب جَگ جانا

جُگ سَہَسر جوجَن پَر بھانو
لیلیو تَاہِ مَدھُر پَھل جانو

پربھو مُدریکا میلی مُکھ ماہیں
جَلَدھی لانگھِ گئے اَچَرَج ناہیں

دُرگَم کاج جَگَت کے جیتے
سُگَم اَنُگرَہ تُمہَرے تیتے

رام دُوارے تُم رَکھوارے
ہوت نہ آگیّا بِنو پَیسے

سَب سُکھ لَہَیں تُمہاری سرنا
تُم رَکشَک کاہُو کو ڈَرنا

آپَن تیج سَمہارو آپَے
تینوں لوک ہانک تے کانپَے

بُھوت پِشَچ نِکَٹ نہیں آوَیں
مَہابِیر جَب نام سُناؤَیں

ناسَے روگ ہَرَے سَب پیرا
جَپَت نِرَنتَر ہَنُمَت بیرا

سَنکٹ تے ہَنُمان چُھڑاوَیں
مَن کرَم بچَن دھیان جو لاوَیں

سَب پَر رام تَپَسوی راجا
تِن کے کاج سَکَل تُم ساجا

اَؤر مَنورتھ جو کوئی لاوَے
سوئی اَمِت جیون پَھل پاوَے

چاروں جُگ پَرتاپ تُمہارا
ہے پَرسِدّھ جَگَت اُجیَارا

سادھو سَنت کے تُم رَکھوارے
اَسُر نِکَندن رام دُلارے

اَشٹ سِدّھی نَو نِدھی کے داتا
اَس بَر دین جانکی ماتا

رام رَسایَن تُمہَرے پاسا
سَدا رَہو رَگھُپَتی کے داسا

تُمہَرے بھَجن رام کو پاوَے
جَنَم جَنَم کے دُکھ بِسَراوَے

اَنت کال رَگھُبَر پُر جائی
جَہاں جَنَم ہَری بَھکت کَہائی

اَؤر دیوَتا چِتّ نہ دَھرئی
ہَنُمَت سےئی سَرو سُکھ کَرئی

سَنکٹ کَٹے مِٹے سَب پیرا
جو سُمِرَے ہَنُمَت بَل بیرا

جَے جَے جَے ہَنُمان گوسائیں
کِرپا کَرَہُ گرو دیو کی نائیں

جو شَت بار پاٹھ کَر کوئی
چُھوٹَہِ بَندی مَہا سُکھ ہوئی

جو یہ پَڑھے ہَنُمان چالیسا
ہوئے سِدّھی ساکھی گَوریسا

تُلسیداس سَدا ہَری چیرا
کیجے ناتھ ہِرِدَے مَہَں ڈیرا

دوہا

پَوَن تَنَے سَنکٹ ہَرَن، مَنگَل مُورتی رُوپ
رام لَکھن سیتا سَہِت، ہِرِدَے بَسَہُ سُر بُھوپ

`,
    "Aarti Kije Hanuman Lala Ki": `شری رام چندر کرپالو بھجمَن،
ہَرَن بھَو بھَے دارُنَم۔
نَو کَنج لوچَن، کَنج مُکھ،
کَر کَنج پَد کَنجارُنَم॥

کَندَرپ اَگنِت اَمِت چھَوی،
نَو نیل نیرَد سُندَرَم۔
پَٹ پیت مانہُ تَڑِت رُچِی،
شُچِی نَومی جَنَک سُتاوَرَم॥

بھَجو دین بَندھو دِنیش دانَو،
دَیتیہ وَنش نِکَندَنَم۔
رَگھُنَند اَنَند کَند،
کَوشَل چندر دَشرتھ نَندَنَم॥

سِر مُکُٹ کُنڈَل تِلَک،
چارُ اُدار اَنگ بِبھوشَنَم۔
آجانُ بھُج شَر چاپ دھر،
سنگرام جِت کھَر دُوشَنَم॥

اِتی وَدَتی تُلسی داس،
شنکر شیش مُنی مَن رَنجَنَم۔
مَم ہِردَے کَنج نِواس کُرو،
کامادِی کھَل دَل گَنجَنَم॥ `,
    "Sankat Mochan Ashtak": `بال سَمَے رَوِی بَھکشِ لیو تَب،
تینَہوں لوک بھَیو اَندھیارو۔
تَاہِ سوں تْراس بھَیو جَگ کو،
یہ سَنکٹ کَاہُ سوں جات ن ٹارو॥

دیون آنی کَری بِنتی تَب،
چھاڑی دیو رَوِی کَشٹ نِوارو۔
کو نہیں جانَت ہے جَگ میں کَپی،
سَنکٹ موچَن نام تِہارو॥۱॥

بالی کی تْراس کَپیس بَسَیں گِری،
جات مَہاپْرَبھو پَنتھ نِہارو۔
چَونکی مَہامُنی شاپ دِیو تَب،
چاہیے کون بِچار بِچارو॥

کَے دِوِج رُوپ لِوائے مَہاپْرَبھو،
سو تُم داس کے شوک نِوارو۔
کو نہیں جانَت ہے جَگ میں کَپی،
سَنکٹ موچَن نام تِہارو॥۲॥

اَنگَد کے سَنگ لَین گَئے سِیا،
کھوج کَپیس یہ بَین اُچارو۔
جیوت نَہ بچِہَو ہم سو جُو،
بِنا سُدھی لائے اِہاں پَگُ دھارو॥

ہیری تھَکے تَٹ سِندھو سَبَے تَب،
لائے سِیا سُدھی پْران اُبارو۔
کو نہیں جانَت ہے جَگ میں کَپی،
سَنکٹ موچَن نام تِہارو॥۳॥

راوَن تْراس دَئی سِیا کو سَب،
راکْشَسی سوں کَہی شوک نِوارو۔
تَاہی سَمَے ہَنُمان مَہاپْرَبھو،
جائے مَہا رَجَنیچَر مارو॥

چاہَت سِیا اَشوک سوں آگِی سُو،
دَے پْرَبھو مُدْرِکا شوک نِوارو۔
کو نہیں جانَت ہے جَگ میں کَپی،
سَنکٹ موچَن نام تِہارو॥۴॥

بان لَگْیو اُر لَچھِمَن کے تَب،
پْران تَجے سُت راوَن مارو۔
لَے گِرہ بَیدْیَہ سُشین سَمیت،
تَبَے گِری دْرون سُو بِیر اُپارو॥

آنی سَجیوَن ہاتھ دَئی تَب،
لَچھِمَن کے تُم پْران اُبارو۔
کو نہیں جانَت ہے جَگ میں کَپی،
سَنکٹ موچَن نام تِہارو॥۵॥

راوَن جُدّھ اَجان کِیو تَب،
ناگ کی پھانس سَبَے سِر ڈارو۔
شْری رَگھوناتھ سَمیت سَبَے دَل،
موہ بھَیو یہ سَنکٹ بھارو॥

آنی کھَگیش تَبَے ہَنُمان جُو،
بَندھن کاٹی سُتْراس نِوارو۔
کو نہیں جانَت ہے جَگ میں کَپی،
سَنکٹ موچَن نام تِہارو॥۶॥

بَندھو سَمیت جَبَے اَہِراوَن،
لَے رَگھوناتھ پَتال سِدھارو۔
دیویہِیں پُوجی بھَلی بِدھی سوں بَلی،
دےؤ سَبَے مِلی مَنتر بِچارو॥

جائے سَہائے بھَیو تَب ہی،
اَہِراوَن سَینیہ سَمیت سَںہارو۔
کو نہیں جانَت ہے جَگ میں کَپی،
سَنکٹ موچَن نام تِہارو॥۷॥

کاج کِیے بَڑ دیوَن کے تُم،
بِیر مَہاپْرَبھو دیکھی بِچارو۔
کَون سو سَنکٹ مور غریب کو،
جو تُم سوں نہیں جات ہے ٹارو॥

بیگی ہَرو ہَنُمان مَہاپْرَبھو،
جو کَچھُ سَنکٹ ہوئے ہَمارو۔
کو نہیں جانَت ہے جَگ میں کَپی،
سَنکٹ موچَن نام تِہارو॥۸॥

دوہا

لال دَیہ لالی لَسے،
اَرو دَھری لال لَنگور۔
بَجر دَیہ دانَو دَلَن،
جَے جَے جَے کَپی سُور॥`,
    "Shri Ramchandra Kripalu Bhajman": `شری رام چندر کرپالو بھجمَن،
ہَرَن بھَو بھَے دارُنَم۔
نَو کَنج لوچَن، کَنج مُکھ،
کَر کَنج پَد کَنجارُنَم॥

کَندَرپ اَگنِت اَمِت چھَوی،
نَو نیل نیرَد سُندَرَم۔
پَٹ پیت مانہُ تَڑِت رُچِی،
شُچِی نَومی جَنَک سُتاوَرَم॥

بھَجو دین بَندھو دِنیش دانَو،
دَیتیہ وَنش نِکَندَنَم۔
رَگھُنَند اَنَند کَند،
کَوشَل چندر دَشرتھ نَندَنَم॥

سِر مُکُٹ کُنڈَل تِلَک،
چارُ اُدار اَنگ بِبھوشَنَم۔
آجانُ بھُج شَر چاپ دھر،
سنگرام جِت کھَر دُوشَنَم॥

اِتی وَدَتی تُلسی داس،
شنکر شیش مُنی مَن رَنجَنَم۔
مَم ہِردَے کَنج نِواس کُرو،
کامادِی کھَل دَل گَنجَنَم॥`,

    "Aarti Shri Ramchandra Ji Ki": `آرتی شری رام چندر جی کی،
کیرتی کلت للت سیا پی کی۔

گاؤت برہما دک منی نارَد،
 بالمیکی وگیان وشارد۔
شک سنکادک شیش ارو شارد،
برنی پون سُت کیرتی نیکی۔

آرتی شری رام چندر جی کی۔

رہت سو اودھ میں روچِر بھون میں،
آسن پر ہری چپل چرن میں۔
کرت کرپا بہو روپ دھرن میں،
سُر نر منی سب ہوت سُکھی کی۔

آرتی شری رام چندر جی کی۔

رجت جنک پور دھام میں،
اودھ پوری میں سیا رام جی۔
بھکتن کے من مندر میں،
بست سدا سُکھ دھام جی۔

آرتی شری رام چندر جی کی۔`,

    "Ram Raksha Stotram": `॥ شری رام رکشا ستوترم ॥

اَسْیَ شری رام رکشا ستوتر منترسْیَ۔
بُدھ کوشک رِشیہ۔
شری سیتا رام چندرو دیوتا۔
اَنُشٹُپ چھندہ۔
سیتا شکتیہ۔
شری مد ہنومان کیلکم۔
شری رام چندر پریتیارتھے رام رکشا ستوتر جپے وِنیوگہ۔

॥ دھیانم ॥

دھیاید آجانوباہم دھرت شر دھنشم بدھ پدم آسنستھم،
پیتَم واسو وَسانم نوَ کمل دل سپردھی نیترم پرسنم۔
وامانکاروڑھ سیتا مکھ کمل مِلَل لوچنم نیرَدابھم،
نانا النکار دیپتم ددھتَم اُرو جٹا منڈنم رام چندرم۔

چَرِتَم رگھوناتھسْیَ شت کوٹی پرَوِسترم،
ایک ایکَم اکشرَم پُنسام مہا پاتک ناشنم۔

دھیاتوا نیلو تپل شیامم رامم راجیولوچنم،
جانکی لکشمنوپیتَم جٹا مَکُٹ منڈتم۔

سسی توٗن دھنُربان پانِم نکتنچر انتکم،
سوا لیلَیا جگت تراتُم آوِربھوتَم اجم وِبھُم۔

رام رکشام پٹھیت پرَاجنہہ پاپگھنیَم سروَ کامدام،
شِرو می راگھوَہ پاتو بھالم دشرتھ آتماجَہ۔

کوسلیو درِشو پاتو وِشوامتر پریہہ شروتی،
گھرانَم پاتو مکھ تراتا مکھم سومترِوَتسَلَہ۔

جِہوام وِدیا ندھیہ پاتو کنٹھم بھرت وندتَہ،
اسکندھو دِویایُدھَہ پاتو بھُجَو بھگنیش کارمُکَہ۔

کَرَو سیتاپتیہ پاتو ہردیَم جامدگنیہ جِت،
مدھیَم پاتو کھردھونسی نابھِم جامبَود آشرَیَہ۔

سُگریویشَہ کٹی پاتو سکِتھنی ہنومت پرَبھُہ،
اورو رگھُتّمَہ پاتو رکشَہ کُل وِنَاش کِرِت۔

جانُنی سیتُکِرِت پاتو جنگھے دش مکھ انتَکَہ،
پادَو بِبھیشن شری دَہ پاتو رامو اَکھِلَم وَپُہ۔

ایتام رام بَلوپیتام رکشام یَہ سُکِریتی پٹھیت،
س چِرایُہ سُکھی پُتری وِجَیی وِنَیی بھَوَیت۔

پاتال بھوتَل ویوم چارِنَش چھَدْم چارِنَہ،
ن دَرشتُم اَپی شکْتاسْتے رکشِتَم رام نامَبھِہ۔

رامیتی رام بھدرَیتی رام چندریتی وا سمرَن،
نَرو ن لِپیتے پاپَیر بھُکتِم مُکتِم چ وِندتی۔

جگَج جَیتر ایک منترَین رام نامنا بھِرکشِتَم،
یَہ کنٹھے دھارَیَیت تَسْیَ کرستھاہ سروَ سِدھَیَہ۔

وَجر پنجر نامیدَم یو رام کَوچَم سمرَیت،
اَویاہتاگْیہ سروَتر لَبھَتے جَی مَنگلَم۔

آدِشتَوان یَتھا سوپنے رام رکشام اِمام ہرَہ،
تَتھا لِکھِتَوان پراتَہ پرَبُدھو بُدھ کوشکَہ۔

آرامَہ کَلپ وِرکشَنام وِرامَہ سَکَلاپَدام،
اَبھِرامَس تِرلوکانام رامَہ شریمان س نَہ پربھُہ۔

تَرُنَو روپ سمپنَو سُکُمارَو مہابَلَو،
پُنڈریک وِشالاکشَو چیر کرشن اجِن امبرَو۔

پھل مولاشِنَو دانتَو تاپَسَو برہم چارِنَو،
پُترو دشرتھَسْیَیتَو بھراتَرَو رام لکشمنَو۔

شرنیَو سروَ ستّوانام شریشٹھَو سروَ دھنُشمَتام،
رکشَہ کُل نِہنتارَو تراییتام نو رگھُتّمَو۔

آتّ سَجّ دھنُشاوِشو سپرشا وَکشَیا شُگ نِشنگِنَو،
رکشَنایَ مَم رام لکشمنَو اَگرَتَہ پَتھی سَدَیوَ گَچھَتام۔

سَنّدھَہ کَوچی کھڑگی چاپ بان دھَرو یُوا،
گَچھَن مَنورَتھو اَسمَاکَم رامَہ پاتو سَلکشمنَہ۔

رامو دَاشرَتھیہ شورو لکشمنانُچَرو بَلی،
کاکُتستھَہ پُرُشَہ پورنَہ کوسلیو رگھُتّمَہ۔

ویدانت ویدیَو یَگنیشَہ پُران پُرُشوتّمَہ،
جانکی وَلّبھَہ شریمان اَپریمَیَ پَراکرمَہ۔

اِتی ایتانی جَپین نِتیَم مَد بھکتَہ شردھَیان وِتَہ،
اَشو میدھادھِکَم پُنْیَم سَم پراپنوٹی نَ سنشیَہ۔

رامَم دُروَ دَل شیامَم پدم اکشم پیت وَاسَسَم،
ستُوَنتی نامَبھِر دِویَیر نَ تے سَنسارِنو نَرَہ۔

رامَم لکشمن پوروجَم رگھو وَرَم سیتاپتِم سُندَرَم،
کاکُتستھَم کارُنا اَرنَوَم گُن نِدھِم وِپر پریَم دھارمِکَم۔

راجیندرم ستیَ سندھَم دشرتھ تَنَیَم شیامَلَم شانتمورتیَم،
وَندے لوکابھِرامَم رگھُ کُل تِلَکَم راگھَوَم راونارِم۔

رامایَ رام بھدرایَ رام چندرایَ ویدَسے،
رگھوناتھایَ ناتھایَ سیتایاہ پَتَیَے نمَہ۔

شری رام رام رگھونندن رام رام،
شری رام رام بھرتاگرَج رام رام،
شری رام رام رَن کَرکش رام رام،
شری رام رام شرنَم بھَو رام رام۔

شری رام چندر چَرَنو مَنَسا سمرامی،
شری رام چندر چَرَنو وَچَسا گرِنامی،
شری رام چندر چَرَنو شِرَسا نمامی،
شری رام چندر چَرَنو شرنَم پرَپَدیے۔

ماتا رامو مَت پِتا رام چندرَہ،
سوامی رامو مَت سَکھا رام چندرَہ،
سَروَسْوَم می رام چندرو دَیالوُہ،
نانْیَم جانے نَیوَ جانے نَ جانے۔

دَکشِنے لکشمنو یَسْیَ وامے چ جنک آتماجا،
پُرتو مارُتِر یَسْیَ تَم وَندے رگھونندنَم۔

لوکابھِرامَم رَن رنگ دھیرَم،
راجیو نیتَرَم رگھو وَنش ناتھَم،
کارُنیَ روپَم کرُنا کَرَم تَم،
شری رام چندرَم شرنَم پرَپَدیے۔

مَنوجَوَم مارُت تُلیَ ویگَم،
جِتیندریََم بُدھِمَتام وَرِشٹھَم،
وات آتماجَم وانَر یوتھ مکھْیَم،
شری رام دوتَم شرنَم پرَپَدیے۔

کُوجَنتَم رام رامیتی مَدھُرَم مَدھُراکشرَم،
آرُہْیَ کَوِتا شاخام وَندے والمیکی کوکِلَم۔

آپَدام اَپَہرتارَم داتارَم سروَ سمپَدام،
لوکابھِرامَم شری رامَم بھویو بھویو نمامی اَہم۔

بھَرجَنَم بھَو بیجانام اَرجَنَم سُکھ سمپَدام،
تَرجَنَم یَم دوتانام رام رامیتی گَرجَنَم۔

رامو راج مَنِہ سَدا وِجَیَتے رامَم رمیشَم بھَجے،
رامینابھِہتا نِشाचَر چَمو رامایَ تَسمَے نمَہ۔
رامان ناستی پَرایَنَم پَرَتَرَم رامَسْیَ داسو اَسمْیَہم،
رامے چِتّ لَیَہ سَدا بھَوَتُو می بھو رام مامُدّھر۔

رام رامیتی رامیتی رَمی رامے مَنورَمی،
سَہسر نام تَت تُلیَ رام نام وَرانَنے۔

اِتی شری بُدھ کوشک وِرچِتَم
شری رام رکشا ستوترَم سمپورنَم۔`,
    "Om Jai Jagdish Hare": `॥ اوم جے جگدیش ہرے ॥

اوم جے جگدیش ہرے،
سوامی جے جگدیش ہرے۔
بھکت جنوں کے سنکٹ،
داس جنوں کے سنکٹ،
کشن میں دور کرے॥
اوم جے جگدیش ہرے॥

جو دھیائے پھل پائے،
دکھ بِنسے من کا۔
سوامی دکھ بِنسے من کا۔
سکھ سمپتی گھر آئے،
کشت مٹے تن کا॥
اوم جے جگدیش ہرے॥

مات پتا تم میرے،
شرن گہوں میں کس کی۔
سوامی شرن گہوں میں کس کی۔
تم بن اور نہ دوجا،
آس کروں میں جس کی॥
اوم جے جگدیش ہرے॥

تم پورن پرماتما،
تم انتر یامی۔
سوامی تم انتر یامی۔
پاربرہم پرمیشور،
تم سب کے سوامی॥
اوم جے جگدیش ہرے॥

تم کرُنا کے ساگر،
تم پالن کرتا۔
سوامی تم پالن کرتا۔
میں مورکھ کھل کامی،
کرپا کرو بھرتا॥
اوم جے جگدیش ہرے॥

تم ہو ایک اگَوچر،
سب کے پران پتی۔
سوامی سب کے پران پتی۔
کس ودھی ملوں دیا مے،
تم کو میں کمتی॥
اوم جے جگدیش ہرے॥

دین بندھو دکھ ہرتا،
تم رکشک میرے۔
سوامی تم رکشک میرے۔
اپنے ہاتھ اٹھاؤ،
دوار پڑا تیرے॥
اوم جے جگدیش ہرے॥

وشے وِکار مٹاؤ،
پاپ ہرو دیوا۔
سوامی پاپ ہرو دیوا۔
شردھا بھکتی بڑھاؤ،
سنتن کی سیوا॥
اوم جے جگدیش ہرے॥

تن من دھن سب ہے تیرا،
سوامی سب کچھ ہے تیرا۔
تیرا تجھ کو ارپن،
کیا لاگے میرا॥
اوم جے جگدیش ہرے॥

اوم جے جگدیش ہرے،
سوامی جے جگدیش ہرے۔
بھکت جنوں کے سنکٹ،
داس جنوں کے سنکٹ،
کشن میں دور کرے॥
اوم جے جگدیش ہرے॥`,
    "Aarti Kunj Bihari Ki": `॥ آرتی کنج بہاری کی ॥

آرتی کنج بہاری کی،
شری گری دھر کرشن مراری کی॥
آرتی کنج بہاری کی،
شری گری دھر کرشن مراری کی॥

گلے میں بیجنتی مالا، بجاوے مرلی مدھر بالا۔
شروَن میں کنڈل جھلکالا، نند کے آنند نند لالا۔
گگن سم انگ کانتی کالی، رادھیکا چمک رہی آلی۔
لتن میں ٹھاڑھے بن مالی، بھنور سی الک،
کستوری تلک، چندر سی جھلک،
للت چھوی شیاما پیاری کی،
شری گری دھر کرشن مراری کی॥
॥ آرتی کنج بہاری کی...॥

کنکمے مور مکھٹ بلسے، دیوتا درشن کو ترسیں۔
گگن سوں سمن راسی برسیں۔
بجے مرچنگ، مدھر مردنگ،
گوالن سنگ، اتل رتی گوپ کماری کی،
شری گری دھر کرشن مراری کی॥
॥ آرتی کنج بہاری کی...॥

جہاں تے پرکٹ بھئی گنگا،
سکل من ہارنی شری گنگا۔
سمرن تے ہوت موہ بھنگا،
بسی شیو شیش، جٹا کے بیچ،
ہرے اگھ کیچ،
چرن چھوی شری بنواری کی،
شری گری دھر کرشن مراری کی॥
॥ آرتی کنج بہاری کی...॥

چمکتی اجول ٹٹ رینو،
بج رہی ورنداون بینو۔
چہوں دِسی گوپی گوال دھینو،
ہسنت مردو مند، چاندنی چند،
کٹت بھوَ پھند،
ٹیر سن دین دکھاری کی،
شری گری دھر کرشن مراری کی॥
॥ آرتی کنج بہاری کی...॥

آرتی کنج بہاری کی،
شری گری دھر کرشن مراری کی॥
آرتی کنج بہاری کی،
شری گری دھر کرشن مراری کی॥`,

    "Achyutam Keshavam": `॥ شری اچیوتاشٹکم ॥

اچیتَم کیشوَم رام ناراینَم
کرشن دامودَرَم واسودیوَم ہَرِم
شری دھرَم مادھوَم گوپیکا ولبھَم
جانکی نایکَم رام چندرَم بھجے ॥۱॥

اچیتَم کیشوَم ستیہ بھاما دھوَم
مادھوَم شری دھرَم رادھیکا رادھتَم
اندرا مندرَم چیتسا سندرَم
دیوکی نندنَم نند جَم سنددھے ॥۲॥

وشنوے جشنوے شنکھنے چکرنے
رکمِنی راگنے جانکی جانَے
ولّوی ولبھایارچتایاتمنے
کَنس ودھونسنے ونشنے تے نمہ ॥۳॥

کرشن گووند ہے رام ناراین
شری پتے واسودیو اجت شری ندھے
اچیتاننت ہے مادھو ادھو کشج
دوارکا نایک دروپدی رکشک ॥۴॥

راکشش کشوبھتہ سیتیا شوبھتو
دنڈکارنیہ بھو پنیہ تا کارنہ
لکشمنین انوتو وانرَے سیوتو
اگستیہ سمپوجتو راگھو پاتو مام ॥۵॥

دھینوکارشٹک انشٹ کِرد دویشہا
کیشہا کَنس ہرد ونشکا وادکہ
پوتنا کوپکہ سورجا کھیلنو
بال گوپالکہ پاتو مام سروَدا ॥۶॥

وِدیوددیوتوت پرَسفُرَد واسَسَم
پراوِڑمبھودوت پرولّسَد وِگرہَم
ونیایا مالیا شوبھتورَستھلَم
لوہتانگھری دویَم وارجاکشَم بھجے ॥۷॥

کنچتَے کنتلَے بھراجماناننَم
رتن مولِم لسَت کنڈلَم گنڈَیوہ
ہار کیورَکَم کنکن پروجلَم
کنکنِی منجلَم شیامَلَم تَم بھجے ॥۸॥

اچیتسیہ اشٹکَم یہ پڑھے دِشٹدَم
پریمَتہ پرتیہَم پُرشہ سسپریہَم
وِرتتہ سندرَم کرتر وِشومبھرہ
تسیہ وشو ہریرجایتے ستورَم ॥۹॥`,
    "Vishnu Sahasranama": `مریچِر دمنو ہنسہ سپرنو بھجگوتّمَہ
ہِرنیہ نابھہ سُتپاہ پدم نابھہ پرجاپتیہ॥۲۱॥

امرتیہ سروَدِک سِمہہ سندھاتا سندھیمان ستھِرَہ
اجو دُرمرشنہ شاستا وِشروتاتما سوراریہا॥۲۲॥

گُرُرگُرُتمو دھامہ ستیہہ ستیہ پراکرمہ
نِمِشونمِشہ سرَگوی واچسپتِر اُدار دھِیہ॥۲۳॥

اَگرنیر گرامنِیہ شریمان نیایو نیتا سمیرنَہ
سہسر مور دھا وشواتما سہسراکشہ سہسرپات॥۲۴॥

آورتنو نِوِرتاتما سموِرتہ سمپر مَردنہ
اہہ سمورتکو وہنِر انِلو دھرنی دھرہ॥۲۵॥

سُپرسادہ پرسناتما وشو دھریگ وشوبھُگ وِبھُہ
ستکرتا ستکرتہ سادھُر جہنور ناراینو نرَہ॥۲۶॥

اسنکھییو پرمیاتما وِشِشٹہ شِشٹ کرِچ چُچِہ
سدھارتھہ سدھ سنکلپہ سدھِدہ سدھِ سادھنہ॥۲۷॥

ورِشاہی ورِش بھو وِشنُر ورِش پروا ورِشودرَہ
وردھنو وردھمانشچ وِوِکتہ شروتی ساگرَہ॥۲۸॥

سُبھُجو دُردھرو واگمی مہندرو وسُدو وسُہ
نیک روپو برِہدرُوپہ شِپی وِشٹہ پرکاشنَہ॥۲۹॥

اوجس تیجو دُیوتی دھرہ پرکاشاتما پرتاپنَہ
رِدھہ سپشٹاکشرو منترش چندرامشُر بھاسکر دُیُتیہ॥۳۰॥

امرتامشو دبھوو بھانُہ ششبِندُہ سریشورَہ
اوشدھم جگتہ سیتُہ ستیہ دھرم پراکرمہ॥۳۱॥

بھوت بھویہ بھون ناتھہ پونہ پاونو نلہ
کامہا کام کرِت کانتہ کامہ کام پردہ پر بھُہ॥۳۲॥

یُگادِکرِد یُگاوَرتو نیک مایو مہاشنَہ
ادرِشِیو ویکت روپشچ سہسرجِد اننت جِت॥۳۳॥

اشٹو وِشِشٹہ شِشٹیشٹہ شکھنڈی نہوشو ورِشَہ
کرودھہا کرودھ کرِت کرتا وشو باہُر مہیدھرَہ॥۳۴॥

اچُیتہ پرتھِتہ پرانہ پرانَدو واسوانُجَہ
اپام ندھِر ادھِشٹھانم اپرمتہ پرتِشٹھِتَہ॥۳۵॥

اسکندہ اسکند دھرو دھیوریو وردو وایو واہنَہ
واسودیو برِہد بھانُر آدی دیو پُرندَرَہ॥۳۶॥

اشوکہ تارنَس تارَہ شورَہ شورِر جنیشورَہ
انُکولہ شتاورتہ پدمی پدم نِبھیکشنَہ॥۳۷॥

پدم نابھو رَوندراکشہ پدم گربھہ شریر بھرت
مہردھِر رِدھو ورِدھاتما مہاکشو گرُڑ دھوجَہ॥۳۸॥

اَتُلَہ شربھو بھیمَہ سمیَگنیو ہوِر ہری
سرو لکشَن لکشَنیو لکشمی وان سَمِتِنجَیہ॥۳۹॥

وِکشرو روہِتو مارگو ہیتُر دامودَرَہ سہَہ
مہیدھرو مہابھاگو ویگوان امِتاشنَہ॥۴۰॥`,
    "Govinda Namavali": `॥ شری گووند ناماولی ॥

گووند گووند گووند۔
گووند گووند گووند॥

شری گووند، ہری گووند۔
گوپال گووند، گووند॥

وینکٹ رمنا گووند۔
وینکٹیشور گووند॥

شری پتی گووند۔
لکشمی پتی گووند॥

واسودیو گووند۔
دیوکی نندن گووند॥

نند نندن گووند۔
نوَ نیت چور گووند॥

گووردھن دھاری گووند۔
گوکل نندن گووند॥

مرلی منوہر گووند۔
مدھوسودن گووند॥

مادھو گووند۔
کیشو گووند॥

دامودر گووند۔
پدم نابھ گووند॥

پنڈریکاکش گووند۔
پرم دیال گووند॥

بھکت وتسَل گووند۔
دین دیال گووند॥

رادھا رمن گووند۔
رُکمِنی رمن گووند॥

سیتا رام گووند۔
شری کرشن گووند॥

اننت شین گووند۔
آنند مورتی گووند॥

شرناگت وتسَل گووند۔
سرو لوک ناتھ گووند॥

گووند گووند گووند۔
شری وینکٹیش گووند॥ `,
    "Jai Ganesh Deva": `جئے گنیش، جئے گنیش، جئے گنیش دیوا۔
ماتا جاکی پاروتی، پتا مہادیوا॥

ایک دنت دیَاونت، چار بھُجا دھاری۔
ماتھے پر تلک سُوہے، موشک کی سواری॥

جئے گنیش، جئے گنیش، جئے گنیش دیوا۔
ماتا جاکی پاروتی، پتا مہادیوا॥

پان چڑھے، پھول چڑھے، اور چڑھے میوا۔
لڈّوؤں کا بھوگ لگے، سنت کریں سیوا॥

جئے گنیش، جئے گنیش، جئے گنیش دیوا۔
ماتا جاکی پاروتی، پتا مہادیوا॥

اندھوں کو آنکھ دیتے، کوڑھیوں کو کایا۔
بانجھوں کو پتر دیتے، نردھن کو مایا॥

جئے گنیش، جئے گنیش، جئے گنیش دیوا۔
ماتا جاکی پاروتی، پتا مہادیوا॥

سور شیام شرن آئے، سفل کیجے سیوا۔
ماتا جاکی پاروتی، پتا مہادیوا॥

جئے گنیش، جئے گنیش، جئے گنیش دیوا۔
ماتا جاکی پاروتی، پتا مہادیوا॥`,
    "Sukhkarta Dukhharta": `سکھ کرتا دکھ ہرتا وارثا وِگھناچی۔
نوروی پوروی پریم کرپا جیاچی॥

سروانگی سندر اُٹی شیندوراچی۔
کنٹھی جھلکے مال مُکت پھلانچی॥

جے دیو جے دیو، جے منگل مورتی۔
درشن ماترے من کامنا پورتی॥

رتن کھچت پھرا تج گوری کمارا۔
چندنچی اُٹی کُکم کیشرا॥

ہیرے جڑت مُکٹ شوبھتو برا۔
رُن جھُنَتی نُپورے چرنی گھاگریا॥

جے دیو جے دیو، جے منگل مورتی۔
درشن ماترے من کامنا پورتی॥

لمبودر پیتامبر پھنیور بندھنا۔
سرل سونڈ وکرتُنڈ ترینَینا॥

داس رامچا واٹ پاہے سَدنا۔
سنکٹی پاواوے نِروانی رکشا وے۔
سُروَر وَندنا॥

جے دیو جے دیو، جے منگل مورتی۔
درشن ماترے من کامنا پورتی॥`,
    "Vakratunda Mahakaya": `وَکرتُنڈ مہاکای
سوریہ کوٹی سَم پربھا۔

نِروِگھنم کُرو مے دیو
سَرو کارییشو سَروَدا॥`,
    "Shri Ganesh Vandana": `جے گنیش جے گنیش جے گنیش دیوا
ماتا جاکی پاروتی، پتا مہادیوا॥

ایک دنت دیاؤنت، چار بھجا دھاری
ماتھے سندور چڑھے، اور موشک کی سواری॥

ہار چڑھے، پھول چڑھے، اور چڑھے میوا
لڈوؤں کا بھوگ لگے، سنت کریں سیوا॥

جے گنیش جے گنیش جے گنیش دیوا
ماتا جاکی پاروتی، پتا مہادیوا॥

اندھوں کو آنکھ دیتے، کوڑھیوں کو کایا
بانجھوں کو پتر دیتے، نردھن کو مایا॥

'سور' شیام شرن آئے، موہے پاون کیجے
ان کی جیسی بھاونا، ویسا پھل دیجے॥

جے گنیش جے گنیش جے گنیش دیوا
ماتا جاکی پاروتی، پتا مہادیوا॥`,
    "Om Jai Shiv Omkara": `اوم جے شیو اومکارا،
ہر جے شیو اومکارا۔
برہما، وشنو، سداشیو،
اردھانگنی دھارا॥

اوم جے شیو اومکارا॥

ایک آنن چتُرانن پنچانن راجے۔
ہنس آسن گرُڑ آسن ورش واہن ساجے॥

اوم جے شیو اومکارا॥

دو بھج چار چتُربھج دش بھج تے سوہے۔
تینو روپ نرکھتا تریبھون جن موہے॥

اوم جے شیو اومکارا॥

اکشمَالا ونمالا منڈمالا دھاری۔
چندن مِرگمد چندا بھولے شبھکاری॥

اوم جے شیو اومکارا॥

شویتامبر پیتامبر باگھامبر انگے۔
سنکادک گرُڑادک بھوتادک سنگے॥

اوم جے شیو اومکارا॥

کرمَدھیے کمَنڈلو چکر تریشول دھرتا۔
جگ کرتا جگ بھرتا جگ سنہار کرتا॥

اوم جے شیو اومکارا॥

برہما وشنو سداشیو جانت اویویکا۔
پرنوا اکشر کے مدھیے یہ تینوں ایکا॥

اوم جے شیو اومکارا॥

تریگن سوامی کی آرتی جو کوئی نر گائے۔
بھکت کہت شوانند سوامی من وانچھت پھل پائے॥

اوم جے شیو اومکارا॥`,
    "Shiv Chalisa": `॥ دوہا ॥
    جے گنیش گریجا سُوَن، منگل مول سُجان۔
کہت ایودھیاداس تم، دیہو ابھیے وردان॥

جے گریجا پتی دین دیالا۔
سدا کرت سنتن پرتی پالا॥

بھال چندرما سوهت نیکے۔
کانن کنڈل ناگ پھنی کے॥

انگ گور شر گنگ بہائے۔
منڈمال تن چھار لگائے॥

وستر کھال باگھمبر سوہے۔
چھوی کو دیکھی ناگ منی موہے॥

مینا مات کی ہوئی دلارى۔
بام انگ سوهت چھوی نیاری॥

کر تریشول سوهت چھوی بھاری۔
کرت سدا شترن کشے کاری॥

نندی گنیش سوہَیں تہاں کیسے۔
ساگر مدھیہ کمل ہیں جیسے॥

کارتک شیام اور گنراؤ۔
یا چھوی کو کہی جات نہ کاؤ॥

دیون جبہیں جائے پکارا۔
تب ہی دکھ پربھو آپ نوارا॥

کیا اپدرو تارک بھاری۔
دیون سب ملی تمہیں جوہاری॥

ترت شڑانن آپ پٹھایو۔
لَو نمیش مہاں ماری گرایو॥

آپ جالندھر اسُر سنہارا۔
سُیش تمہار ودت سنسارا॥

ترپوراسُر سن یدھ مچائی۔
سبہی کرپا کر لین بچائی॥

کیا تپہیں بھاگیرتھ بھاری۔
پورب پرتیگیا تسو پوراری॥

دانن مہاں تم سم کوؤ نہیں۔
سیوک ستُتی کرت سداہیں॥

وید نام مہما تَو گائی۔
اکتھ انادی بھید نہیں پائی॥

پرکٹی اُدھدھی منتھن میں جوالا۔
جرے سُراسُر بھئے وہالا॥

کینہ دیا تہاں کری سہائی۔
نیل کنٹھ تب نام کہائی॥

پوجن رام چندر جب کیہنا۔
جیت کے لنک وبھیشن دینا॥

سہس کمل میں ہو رہے دھاری۔
کینہ پریکشا تبہیں پوراری॥

ایک کمل پربھو راکھےؤ جوئی۔
کمل نین پوجن چاہیں سوئی॥

کٹھن بھکتی دیکھی پربھو شنکر۔
بھئے پرسن دیے اِچھت ور॥

جے جے جے اننت اویناشی۔
کرت کرپا سب کے گھٹواسی॥

دُشٹ سکل نت موہی ستاوے۔
بھرمت رہے موہی چین نہ آوے॥

تراہی تراہی میں ناتھ پکارو۔
یہی اوسر موہی آن اُبارو॥

لے تریشول شترن کو مارو۔
سنکٹ سے موہی آن اُبارو॥

مات پتا بھراتا سب کوئی۔
سنکٹ میں پوچھت نہیں کوئی॥

سوَامی ایک ہے آس تمہاری۔
آئے ہرہو اب سنکٹ بھاری॥

دھن نردھن کو دیت سدا ہی۔
جو کوئی یانچے سو پھل پاہی॥

استُتی کہی ودھی کروں تمہاری۔
کشمہو ناتھ اب چوک ہماری॥

شنکر ہو سنکٹ کے ناشن۔
منگل کارن وگھن ونَاشن॥

یوگی یتی منی دھیان لگاویں۔
نارد شارد شیش نواویں॥

نمو نمو جے نمः شیوائے۔
سُر برہما دِک پار نہ پائے॥

جو یہ پاٹھ کرے من لائی۔
تا پر ہوت ہے شمبھو سہائی॥

رِنیان جو کوئی ہو ادھیکاری۔
پاٹھ کرے سو پاون ہاری॥

پتر ہونے کی اِچھا جوئی۔
نِشچَے شیو پرساد تہی ہوئی॥

پنڈت تریودشی کو لاوے۔
دھیان پوروک ہوم کراوے॥

تریودشی ورت کرے ہمیشہ۔
تاکے تن نہیں رہے کلیشا॥

دھوپ دیپ نیویدیہ چڑھاوے۔
شنکر سَمکھ پاٹھ سناوے॥

جنم جنم کے پاپ نسائے۔
انت واس شیوپور میں پائے॥

کہیں ایودھیاداس آس تمہاری۔
جانی سکل دکھ ہرہو ہماری॥


॥ دوہا ॥
نت نیم اُٹھی پرات ہی، پاٹھ کرو چالیس۔
تم میری منوکامنا، پورن کرو جگدیش॥

مگسر چھٹھی ہیمنت رِتو، سَمت چونسٹھ جان۔
استُتی چالیسا شیوہی، پورن کین کلیان॥

`,
    "Maha Mrityunjaya Mantra": `
    اوم تریَمبکم یجامہے
سُگندھم پُشٹی وردھنم

اُروارُکَمِو بندھنَان
مِرتیور مُکشِیَ مَامرتات`,

    "Jai Ambe Gauri": `جے امبے گوری، میّا جے شیاما گوری
تم کو نش دن دھیاؤت، ہری برہما شوِری

مانگ سندور براجت، ٹیکا مرگمد کو
اجول سے دو نینا، چندر بدن نیکو

جے امبے گوری...

کنک سمان کلیور، رکتامبر راجے
رکت پشپ گل مالا، کنٹھن پر ساجے

جے امبے گوری...

کیہری واہن راجت، کھڑگ کھپر دھاری
سر-نر-منی جن سیوت، تنکے دکھہاری

جے امبے گوری...

کانن کنڈل شوبھت، ناساگرے موتی
کوٹک چندر دیواکر، راجت سم جیوتی

جے امبے گوری...

شمبھ-نشُمبھ وداری، مہیشاسر گھاتی
دھومر ولوچن نینا، نش دن مد ماتی

جے امبے گوری...

چنڈ-منڈ سنہارے، شونت بیج ہرے
مدھو-کیٹبھ دوں مارے، سر بھے ہین کرے

جے امبے گوری...

برہمانی رودرانی، تم کملہ رانی
آگم نگم بکھانی، تم شو پٹرانی

جے امبے گوری...

چونسٹھ یوگنی منگل گاوت، نرتیہ کرت بھیروں
باجت تال مردنگ، ارو باجت ڈمرو

جے امبے گوری...

تم ہی جگ کی ماتا، تم ہی ہو بھرتا
بھکتن کے دکھ ہرتا، سکھ سمپتی کرتا

جے امبے گوری...

بھجا چار اتی شوبھت، کھڑگ کھپر دھاری
من وانچھت پھل پاوت، سیوت نر ناری

جے امبے گوری...

کنچن تھال براجت، اگر کپور باتی
شری مالکیتو میں راجت، کوٹی رتن جیوتی

جے امبے گوری...

امبے جی کی آرتی، جو کوئی نر گاوے
کہت شوانند سوامی، سکھ سمپتی پاوے

جے امبے گوری، میّا جے شیاما گوری
تم کو نش دن دھیاؤت، ہری برہما شوِری`,
    "Durga Chalisa": `॥ دوہا ॥

نمو نمو درگے سکھ کرنی،
نمو نمو امبے دکھ ہرنی۔

نرآکار ہے جیوتی تمہاری،
تینہوں لوک پھیلی اجیاری۔

॥ چوپائی ॥

ششی لَلاٹ مکھ مہاوشالا،
نیتر لال بھروکٹی وکرالا۔

روپ ماتُو کو ادھک سُہاوے،
درش کرت جن اتی سکھ پاوے۔

تم سنسار شکتی لَے کینا،
پالن ہیتو اَن دھن دینا۔

انّپورنا ہوئی جگ پالا،
تم ہی آدی سندری بالا۔

پرلے کال سب ناشن ہاری،
تم گوری شیو شنکر کی پیاری۔

شیو یوگی تمہارے گن گاویں،
برہما وشنو تمہیں نت دھیائیں۔

روپ سرسوتی کو تم دھارا،
دے سبُدھی رشی منین اُبارا۔

دھرا روپ نر سنگھ کو امبا،
پرگٹ بھی پھاڑکر کھمبا۔

رکشا کری پرہلاد بچایو،
ہیرنیاکش کو سورگ پٹھایو۔

لکشمی روپ دھرو جگ ماہیں،
شری نارائن انگ سماہیں۔

کشیر سندھو میں کرت ولاسا،
دیا سندھو دیجیے من آسا۔

ہنگلاج میں تمہیں بھوانی،
مہما امِت نہ جات بکھانی۔

ماتنگی ارو دھوماوتی ماتا،
بھونیشوری بگلا سکھ داتا۔

شری بھیرو تارا جگ تارنی،
چھن بھال بھو دکھ نوارنی۔

کیہری واہن سوہت بھوانی،
لانگور ویر چلت اگوانی۔

کر میں کھپر کھڑگ براجے،
جاکو دیکھ کال ڈر بھاگے۔

سوہے استر اور ترشولا،
جاتے اٹھت شترو ہِیَہ شولا۔

نگرکوٹ میں تمہیں براجت،
تینہوں لوک میں ڈنکا باجت۔

شمبھ نشمبھ دانَو تم مارے،
رکت بیج شنکھن سنہارے۔

مہیشاسر نرپ اتی ابھیمانی،
جیہ اَگھ بھار مہی اکُلانی۔

روپ کرال کالیکا دھارا،
سین سمیت تم تہی سنہارا۔

پڑی گاڑھ سنتن پر جب جب،
بھی سہائے ماتُو تم تب تب۔

امرپوری ارو باسَو لوکا،
تَو مہما سب رہیں اشوکا۔

جوالا میں ہے جیوتی تمہاری،
تمہیں سدا پوجیں نر ناری۔

پریم بھکتی سے جو یش گاویں،
دکھ داردر نکٹ نہیں آویں۔

دھیائے تمہیں جو نر من لائی،
جنم مرن تاکو چھٹی جائی۔

جوگی سُر مُنی کہت پکاری،
یوگ نہ ہو بن شکتی تمہاری۔

شنکر آچاریہ تپ کینا،
کام ارو کرودھ جیتی سب لینا۔

نش دن دھیان دھرو شنکر کو،
کاہو کال نہیں سمیرو تم کو۔

شکتی روپ کا مرم نہ پایو،
شکتی گئی تب من پچھتایو۔

شرناگت ہوئی کیرتی بکھانی،
جے جے جے جگدمب بھوانی۔

بھی پرسن آدی جگدمبا،
دئی شکتی نہیں کین ولمبا۔

موکو ماتُو کشٹ اتی گھیرو،
تم بن کون ہرے دکھ میرو۔

آشا ترشنا نپٹ ستاویں،
موہ مدادک سب ونشاویں۔

شَترو ناش کیجے مہارانی،
سمروں اک چِت تمہیں بھوانی۔

کرو کرپا ہے ماتُو دیالا،
ردھی سدھی دے کرہو نہالا۔

جب لگ جیوں دیا پھل پاؤں،
تمہارو یش میں سدا سناؤں۔

درگا چالیسا جو کوئی گاوے،
سب سکھ بھوگ پرم پد پاوے۔

دیویداس شرن نج جانی،
کرہو کرپا جگدمب بھوانی۔

॥ دوہا ॥

شرناگت رکشا کرے، بھکت رہے نشچنت،
درگا چالیسا پڑھت، مٹے سکل بھے دوند۔`,
    "Durga Saptashati Path": `
   || ۱۔ منگل اچرن||   
   ॥ شری گنیشائے نمہ ॥
॥ شری گرو بھیو نمہ ॥
॥ شری درگایَے نمہ ॥
اوم نمش چندیکایَے۔

۲۔ شری درگا دھیانم
  اوم وِدیُت دام سم پربھام مِرگ پتی اسکندھ ستھتام بھیشنام۔
کنیابھیہ کر وال کھیت وِلسد دھستابھیراسیوِتام॥

ہستَیش چکر گدا اسی کھیت وِشکھانش چاپم گنم ترجنیَم۔
بِبھرانام انلاتمِکَام ششی دھَرام درگام ترِنیترَام بھجے॥

۳۔ شری دیوی کوَچم
مارکنڈیہ اُواچ۔

اوم ید گُہیم پرمم لوکے سرو رکشا کرم نرنام۔
ینّ کَسّی چداکھیاتم تنمے بروہی پِتامہ॥

برہموواچ۔

استی گُہیہ تمم وِپر سرو بھوتوپکارکم۔
دویاس تُو کوَچم پُنیم تچھرنوشو مہامنے॥

پرتھمم شیل پُتری چ دِوِتیم برہمچارِنی۔
ترِتیم چندرگھنٹےتی کوشمَنڈیتی چتُرتھکم॥

پنچمم اسکند ماتیتی ششٹھم کاتیاینی چ۔
سپتمم کال راتریشچ مہا گوری چ اشٹمم॥

نوَمم سدھی داتری چ نو درگاہ پرکیرتِتاہ۔
اُکتانی ایتانی نامانی برہمَنَیو مہاتمنا॥

اگنِنا دہیَمَناستو شترو مدھیے گتا رَنے۔
وِشمے درگمے چَیو بھَیارْتَاہ شرنم گتاہ॥

ن تیشام جایتے کنچد اشبھم رن سنکٹے۔
ناپدم تسّیہ پشیامی شوک دکھ بھیم نہِ॥

یَیستو بھکتیا سمرتا نِتیَم تیشام وِردھیہ پرجایتے۔
یے توام سمرنتی دیویشی رکشسے تانّ سنشیہ॥`,
};

const LYRICS_BY_LANG: Record<string, Record<string, string>> = {
    hi: LYRICS_HI,
    bn: LYRICS_BN,
    ur: LYRICS_UR,
};
const TABS = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "bn", label: "বাংলা" },
    { code: "ur", label: "اردو" },
];

function BhajanItem({ b }: { b: Bhajan }) {
    const { lang } = useLanguage();
    const about = ABOUT[b.title];

    const texts: Record<string, string> = {
        en: LYRICS[b.title]?.trim() ?? "",
        hi: LYRICS_HI[b.title]?.trim() ?? "",
        bn: LYRICS_BN[b.title]?.trim() ?? "",
        ur: LYRICS_UR[b.title]?.trim() ?? "",
    };
    const hasAny = Object.values(texts).some(Boolean);

    // Jis tab par click kiya wo; nahi to site ki language; nahi to pehli bhari hui language
    const [picked, setPicked] = useState<string | null>(null);
    const firstFilled = TABS.find((x) => texts[x.code])?.code ?? "en";
    const active = picked ?? (texts[lang] ? lang : firstFilled);

    return (
        <li>
            <details className="py-2">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 hover:text-saffron">
                    <span className="text-foreground">
                        {b.title} <span className="text-xs text-brown">▾</span>
                    </span>
                    <span className="rounded-full bg-saffron-light px-2.5 py-0.5 text-xs text-saffron-dark">
                        {b.kind}
                    </span>
                </summary>

                {about && <p className="mt-3 text-sm leading-relaxed text-brown">{about}</p>}

                {hasAny && (
                    <div className="mt-3">
                        <div className="mb-2 flex flex-wrap gap-2">
                            {TABS.map((x) => (
                                <button
                                    key={x.code}
                                    type="button"
                                    onClick={() => setPicked(x.code)}
                                    className={`rounded - full border px - 3 py - 1 text - xs transition ${active === x.code
                                        ? "border-saffron bg-saffron text-white"
                                        : "border-saffron-light bg-white text-brown hover:border-saffron"
                                        } `}
                                >
                                    {x.label}
                                </button>
                            ))}
                        </div>

                        <p
                            dir={active === "ur" ? "rtl" : "ltr"}
                            className="whitespace-pre-line rounded-lg bg-saffron-light/40 p-3 text-sm leading-relaxed text-foreground"
                        >
                            {texts[active] || "Is language me lyrics jald hi add honge."}
                        </p>
                    </div>
                )}
            </details>
        </li>
    );
}

// Diya (lamp) illustration - inline SVG, koi image file nahi chahiye
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
                    <div className="flex items-center gap-4 rounded-xl border border-saffron-light bg-white p-5 shadow-sm">
                        <DiyaArt />
                        <ul className="flex-1 divide-y divide-saffron-light text-sm">
                            {bhajans.map((b, i) => (
                                <BhajanItem key={i} b={b} />
                            ))}
                            {/* {bhajans.map((b, i) => {
                                const about = ABOUT[b.title];
                                const translated = lang !== "en" ? LYRICS_BY_LANG[lang]?.[b.title]?.trim() : "";
                                const lyrics = translated || LYRICS[b.title]?.trim();
                                return (
                                    <li key={i}>
                                        <details className="py-2">
                                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 hover:text-saffron">
                                                <span className="text-foreground">
                                                    {b.title} <span className="text-xs text-brown">▾</span>
                                                </span>
                                                <span className="rounded-full bg-saffron-light px-2.5 py-0.5 text-xs text-saffron-dark">
                                                    {b.kind}
                                                </span>
                                            </summary>
                                            {about && (
                                                <p className="mt-3 text-sm leading-relaxed text-brown">{about}</p>
                                            )}
                                            {lyrics && (
                                                <p className="mt-3 whitespace-pre-line rounded-lg bg-saffron-light/40 p-3 text-sm leading-relaxed text-foreground">
                                                    {lyrics}
                                                </p>
                                            )}
                                        </details>
                                    </li>
                                );
                            })} */}
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
                    <VisitInfo slug={temple.slug} />
                </aside>
            </div>
        </main>
    );
}