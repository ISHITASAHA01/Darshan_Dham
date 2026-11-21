import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | undefined;

export function createSupabaseBrowserClient() {
    if (supabaseClient) {
        return supabaseClient;
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error("Supabase environment variables are missing.");
    }

    supabaseClient = createBrowserClient(url, anonKey);

    return supabaseClient;
}
