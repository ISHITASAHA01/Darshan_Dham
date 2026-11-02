import fs from "node:fs";
import path from "node:path";

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export function getTempleImage(slug: string): string | undefined {
    for (const ext of EXTENSIONS) {
        const file = path.join(process.cwd(), "public", "images", "temples", `${slug}.${ext}`);
        if (fs.existsSync(file)) return `/images/temples/${slug}.${ext}`;
    }
    return undefined;
}