import { getAllTemples } from "@/lib/temples-db";
import { getTempleImage } from "@/lib/temple-image";
import AccountClient from "@/components/AccountClient";

import type { Metadata } from "next";
export const metadata: Metadata = {
    title: "My Account | Darshan Dham",
    robots: {
        index: false,
        follow: false,
    },
};
export default async function AccountPage() {
    const temples = await getAllTemples();

    const items = temples.map((temple) => ({
        ...temple,
        image: temple.image ?? getTempleImage(temple.slug),
    }));

    return <AccountClient items={items} />;
}