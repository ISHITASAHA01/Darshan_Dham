
import type { MetadataRoute } from "next";
import { getAllTemples, getStates } from "@/lib/temples-db";

const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://darshan-dham.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [temples, states] = await Promise.all([
        getAllTemples(),
        getStates(),
    ]);

    const pages = [
        "",
        "/temples",
        "/states",
        "/about",
        "/contact",
        "/calendar",
        "/festivals",
    ].map((path) => ({
        url: `${base}${path}`,
        lastModified: new Date(),
    }));

    const stateUrls = states.map((state) => ({
        url: `${base}/states/${state.slug}`,
        lastModified: new Date(),
    }));

    const templeUrls = temples.map((temple) => ({
        url: `${base}/temples/${temple.slug}`,
        lastModified: new Date(),
    }));

    return [...pages, ...stateUrls, ...templeUrls];
}
