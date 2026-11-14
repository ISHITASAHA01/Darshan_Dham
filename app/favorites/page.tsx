import { getAllTemples } from "@/lib/temples-db";
import FavoritesClient from "@/components/FavoritesClient";
import { getTempleImage } from "@/lib/temple-image";
export default async function FavoritesPage() {
    const temples = await getAllTemples();

    const items = temples.map((t) => ({
        ...t,
        image: t.image ?? getTempleImage(t.slug),
    }));

    return <FavoritesClient items={items} />;
}