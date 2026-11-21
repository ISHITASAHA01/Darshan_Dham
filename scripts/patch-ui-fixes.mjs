import fs from "node:fs";

const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null);
const L = (...lines) => lines.join("\n");

function patch(file, name, fn) {
    const src = read(file);
    if (src === null) return console.log(`✗ ${name}: ${file} nahi mili`);
    const out = fn(src);
    if (out === "done") return console.log(`- ${name}: pehle se laga hua hai`);
    if (out === null) return console.log(`✗ ${name}: ${file} me wo jagah nahi mili (file alag hai)`);
    fs.writeFileSync(file, out);
    console.log(`✓ ${name}`);
}

patch("app/globals.css", "Dark mode fix", (s) => {
    if (s.includes("DD-DARK-FIX")) return "done";
    return s + L("",
        "",
        "/* DD-DARK-FIX: dark mode me safed cards ko dark surface do */",
        '.dark .bg-white:not([class*="border-[#"]) {',
        "  background-color: var(--surface, #14243a);",
        "}",
        ".dark input::placeholder,",
        ".dark textarea::placeholder {",
        "  color: var(--muted, #a8b3c4);",
        "  opacity: 0.85;",
        "}",
        ".dark select option {",
        "  background-color: var(--surface, #14243a);",
        "  color: var(--foreground, #f5eee6);",
        "}",
        "");
});

patch("app/layout.tsx", "Footer neeche", (s) => {
    if (s.includes("flex min-h-screen flex-col")) return "done";
    const re = /<Navbar \/>\s*\{children\}\s*<Footer \/>/;
    if (!re.test(s)) return null;
    return s.replace(re, L(
        '<div className="flex min-h-screen flex-col">',
        "              <Navbar />",
        '              <div className="flex-1">{children}</div>',
        "              <Footer />",
        "            </div>"));
});

patch("components/Navbar.tsx", "Navbar overlap", (s) => {
    if (s.includes("xl:flex")) return "done";
    const reps = [
        ['<Link href="/" className="flex items-center gap-2">', '<Link href="/" className="flex shrink-0 items-center gap-2">'],
        ['<div className="notranslate leading-tight">', '<div className="notranslate whitespace-nowrap leading-tight">'],
        ['<nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">', '<nav className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">'],
        ['<ul className="hidden items-center gap-6 lg:gap-8 md:flex">', '<ul className="hidden items-center gap-5 xl:gap-6 lg:flex">'],
        ["pb-1 text-sm font-medium transition-colors", "whitespace-nowrap pb-1 text-sm font-medium transition-colors"],
        ['rounded-full bg-saffron-light/50 px-4 py-2 lg:flex"', 'rounded-full bg-saffron-light/50 px-4 py-2 xl:flex"'],
        ['className="w-48 bg-transparent text-sm outline-none placeholder:text-brown/60"', 'className="w-36 bg-transparent text-sm outline-none placeholder:text-brown/60"'],
        ['className="md:hidden"', 'className="lg:hidden"'],
        ["bg-background px-4 pb-5 pt-3 md:hidden", "bg-background px-4 pb-5 pt-3 lg:hidden"],
        ["{/* Language switcher */}", L(
            "{/* Search icon: chhoti screen par poora search box nahi */}",
            '          <Link href="/temples" aria-label="Search temples" title="Search temples" className="hidden items-center justify-center rounded-full border border-saffron-light p-2 text-foreground transition hover:bg-saffron-light lg:flex xl:hidden">',
            '            <Search className="h-4 w-4" />',
            "          </Link>",
            "",
            "          {/* Language switcher */}")],
    ];
    for (const [a] of reps) if (!s.includes(a)) return null;
    for (const [a, b] of reps) s = s.replace(a, b);
    return s;
});

patch("app/login/page.tsx", "Login hover animation", (s) => {
    if (s.includes("setHovered")) return "done";
    const a1 = "const router = useRouter();";
    const a2 = '<div className="login-card-animate grid w-full max-w-5xl overflow-hidden rounded-3xl border border-saffron-light bg-[var(--surface)] shadow-xl md:grid-cols-2">';
    const a3 = '<div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4b2818] via-[#713d20] to-[#a65b25] p-8 text-white md:p-12">';
    const a4 = '<div className="bg-[var(--surface)] p-7 sm:p-10 md:p-12">';
    for (const a of [a1, a2, a3, a4]) if (!s.includes(a)) return null;

    s = s.replace(a1, a1 + '\n    const [hovered, setHovered] = useState<"left" | "right" | null>(null);');
    s = s.replace(a2, L(
        "<div",
        "                onMouseLeave={() => setHovered(null)}",
        '                className={`login-card-animate grid w-full max-w-5xl overflow-hidden rounded-3xl border border-saffron-light bg-[var(--surface)] shadow-xl md:transition-[grid-template-columns] md:duration-500 md:ease-out ${hovered === "left" ? "md:grid-cols-[1.12fr_0.88fr]" : hovered === "right" ? "md:grid-cols-[0.88fr_1.12fr]" : "md:grid-cols-2"}`}',
        "            >"));
    s = s.replace(a3, L(
        "<div",
        '                    onMouseEnter={() => setHovered("left")}',
        '                    className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4b2818] via-[#713d20] to-[#a65b25] p-8 text-white transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none md:p-12 ${hovered === "left" ? "md:z-10 md:[transform:perspective(1200px)_rotateY(2.5deg)_scale(1.04)]" : hovered === "right" ? "md:[transform:scale(0.97)]" : ""}`}',
        "                >"));
    s = s.replace(a4, L(
        "<div",
        '                    onMouseEnter={() => setHovered("right")}',
        '                    className={`bg-[var(--surface)] p-7 transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none sm:p-10 md:p-12 ${hovered === "right" ? "md:z-10 md:[transform:perspective(1200px)_rotateY(-2.5deg)_scale(1.03)]" : hovered === "left" ? "md:[transform:scale(0.97)]" : ""}`}',
        "                >"));
    return s;
});

patch("app/calendar/page.tsx", "Calendar hero images", (s) => {
    if (s.includes("calendarHeroImages")) return "done";
    const anchorState = "const [selectedDate, setSelectedDate] = useState(formatDate(today));";
    const anchorFn = "function formatDate(date: Date) {";
    const imgRe = /<Image\s+src="\/images\/hero\/hero2\.jpg"[\s\S]*?\/>\s*<div className="absolute inset-0 bg-gradient-to-r from-\[#101d2b\]\/95 via-\[#101d2b\]\/80 to-\[#101d2b\]\/35" \/>/;
    if (!s.includes(anchorState) || !s.includes(anchorFn) || !imgRe.test(s)) return null;

    s = s.replace(anchorFn, L(
        "const calendarHeroImages = [",
        '    "/images/calendar/moon-lotus.png",',
        '    "/images/calendar/sun-moon-krishna.png",',
        "];",
        "",
        anchorFn));
    s = s.replace(anchorState, L(
        anchorState,
        "    const [heroIndex, setHeroIndex] = useState(0);",
        "",
        "    useEffect(() => {",
        "        const timer = setInterval(() => {",
        "            setHeroIndex((index) => (index + 1) % calendarHeroImages.length);",
        "        }, 6000);",
        "",
        "        return () => clearInterval(timer);",
        "    }, []);"));
    s = s.replace(imgRe, L(
        "{calendarHeroImages.map((src, index) => (",
        "                            <Image",
        "                                key={src}",
        "                                src={src}",
        '                                alt="Sun, moon and sacred calendar"',
        "                                fill",
        "                                priority={index === 0}",
        '                                sizes="100vw"',
        '                                className={`object-cover transition-opacity duration-1000 ${index === heroIndex ? "opacity-70" : "opacity-0"}`}',
        "                            />",
        "                        ))}",
        '                        <div className="absolute inset-0 bg-gradient-to-r from-[#101d2b]/90 via-[#101d2b]/55 to-[#101d2b]/10" />'));
    return s;
});

console.log("\nKhatam. Ab server band karke dobara chalao: npm run dev");
