import fs from "node:fs";

const f = "data/temples.ts";
let s = fs.readFileSync(f, "utf8");

if (s.includes("moreTemples2")) {
    console.log("temples.ts me moreTemples2 pehle se juda hai");
} else {
    const DEDUP = (list) =>
        `Array.from(new Map(${list}.map((t) => [t.slug, t])).values())`;

    if (s.includes("...moreTemples]")) {
        s = s.replace(
            /export const temples: Temple\[\] = \[\.\.\.baseTemples, \.\.\.moreTemples\];/,
            `export const temples: Temple[] = ${DEDUP("[...baseTemples, ...moreTemples, ...moreTemples2]")};`
        );
        s = s.replace(/import \{ moreTemples \} from "\.\/moreTemples";/, `import { moreTemples } from "./moreTemples";\nimport { moreTemples2 } from "./moreTemples2";`);
    } else {
        const startRe = /export const temples: Temple\[\] = \[/;
        if (!startRe.test(s)) { console.log("temples array nahi mila, temples.ts alag hai"); process.exit(1); }
        s = s.replace(startRe, "const baseTemples: Temple[] = [");
        const endIdx = s.indexOf("\n];\n", s.indexOf("const baseTemples"));
        if (endIdx < 0) { console.log("array ka end nahi mila"); process.exit(1); }
        s = s.slice(0, endIdx + 4) +
            `\nexport const temples: Temple[] = ${DEDUP("[...baseTemples, ...moreTemples2]")};\n` +
            s.slice(endIdx + 4);
        s = `import { moreTemples2 } from "./moreTemples2";\n` + s;
    }
    if (!s.includes("moreTemples2")) { console.log("Kuch badla nahi, temples.ts alag hai"); process.exit(1); }
    fs.writeFileSync(f, s);
    console.log("temples.ts me moreTemples2 jud gaya");
}

for (const sc of ["scripts/fetch-missing-images.mjs", "scripts/fetch-retry.mjs", "scripts/check-images.mjs"]) {
    if (!fs.existsSync(sc)) continue;
    let t = fs.readFileSync(sc, "utf8");
    if (t.includes("moreTemples2.ts")) continue;
    const n = t.replace(/\["temples\.ts", "moreTemples\.ts"\]/, '["temples.ts", "moreTemples.ts", "moreTemples2.ts"]');
    if (n !== t) { fs.writeFileSync(sc, n); console.log(sc + " update ho gayi"); }
}
