import BrowseByState from "@/components/BrowseByState";
import { getStates } from "@/lib/temples-db";

export const revalidate = 60;

export default async function StatesPage() {
  const states = await getStates();
  return (
    <main className="pt-8">
      <BrowseByState states={states} />
    </main>
  );
}
