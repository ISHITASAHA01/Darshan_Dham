import { getAllTemples } from "@/lib/temples-db";
import { getTempleImage } from "@/lib/temple-image";
import AccountClient from "@/components/AccountClient";


export default async function AccountPage() {
    const temples = await getAllTemples();

    const items = temples.map((temple) => ({
        ...temple,
        image: temple.image ?? getTempleImage(temple.slug),
    }));

    return <AccountClient items={items} />;
}