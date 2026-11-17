
import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

const IMAGE_ALIASES: Record<string, string[]> = {
    "ghrishneshwar-temple": ["grishneshwar-temple"],
    "kalika-mata-temple-pavagadh": ["pavagadh-kalika-mata-temple"],
    "karni-mata-temple-deshnok": ["karni-mata-temple"],
    "khatu-shyam-temple": ["khatu-shyam-ji-temple"],
    "udupi-krishna-temple": ["udupi-sri-krishna-matha"],
    "shantadurga-temple-goa": ["shantadurga-temple"],
    "mahalasa-temple-goa": ["mahalasa-narayani-temple"],
    "mangueshi-temple-goa": ["mangueshi-temple"],
    "saptakoteshwar-temple-goa": ["saptakoteshwar-temple"],
    "durgiana-temple-amritsar": ["durgiana-temple"],
};

export function getTempleImage(slug: string): string | undefined {
    const imageNames = [slug, ...(IMAGE_ALIASES[slug] ?? [])];

    for (const name of imageNames) {
        for (const ext of EXTENSIONS) {
            const file = path.join(
                process.cwd(),
                "public",
                "images",
                "temples",
                `${name}.${ext}`
            );

            if (fs.existsSync(file)) {
                return `/images/temples/${name}.${ext}`;
            }
        }
    }


    return undefined;
}