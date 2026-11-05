import type { MetadataRoute } from "next";
import { temples, states } from "@/data/temples";

const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aapki-site.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = ["", "/temples", "/states", "/about", "/contact"].map((p) => ({
        url: `${base}${p}`,
        lastModified: new Date(),
    }));
    const stateUrls = states.map((s) => ({
        url: `${base}/states/${s.slug}`,
        lastModified: new Date(),
    }));
    const templeUrls = temples.map((t) => ({
        url: `${base}/temples/${t.slug}`,
        lastModified: new Date(),
    }));
    return [...pages, ...stateUrls, ...templeUrls];
}