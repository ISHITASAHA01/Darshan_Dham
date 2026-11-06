import type { MetadataRoute } from "next";
import { getAllTemples, getStates } from "@/lib/temples-db";

const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aapki-site.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [temples, states] = await Promise.all([getAllTemples(), getStates()]);

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
